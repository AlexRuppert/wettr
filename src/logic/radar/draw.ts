import type { GeoBounds } from './utils'
import { mercatorProjection, getScale } from './utils'

let offscreenCanvas: HTMLCanvasElement = document.createElement('canvas')

let colorCache: string[] = []
function getKmSizeInPx(viewBounds, ctx) {
  return (
    ctx.canvas.height / ((viewBounds.rt.lat - viewBounds.lb.lat) * 60 * 0.7)
  )
}

function getCloudColor(value: number) {
  return `hsla(${200 + 80 * value},${80 + value * 20}%,${58}%,${1}`
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string
) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fill()
}

function createColorCache() {
  for (let i = 0; i <= 100; i++) {
    colorCache.push(getCloudColor(i / 100))
  }
}
export function initCanvas(canvas: HTMLCanvasElement, width: number) {
  canvas.width = width * 3
  canvas.height = width * 3
  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.translate(0, ctx.canvas.height)
  ctx.scale(1, -1)
  createColorCache()
  return ctx
}

function clip(ctx: CanvasRenderingContext2D, mini: boolean) {
  if (mini) {
    drawRoundedRectPath(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, 30)
    ctx.clip()
  }
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

export function drawLocation(
  ctx: CanvasRenderingContext2D,
  color = '#fff',
  radius = 3
) {
  ctx.globalCompositeOperation = 'source-over'
  drawCircle(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, radius, color)
}

export function drawClouds(
  clouds,
  viewBounds: GeoBounds,
  ctx: CanvasRenderingContext2D,
  mini = false
) {
  const scale = getScale(viewBounds)
  const radius = getKmSizeInPx(viewBounds, ctx) / 2
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.globalCompositeOperation = 'darken'
  ctx.save()
  clip(ctx, mini)
  console.time('drawClouds')
  //console.log(new Set((clouds.map(c=>c.value))))
  //clouds = clouds.filter((cell, i) => i % 2 === 0)
  //console.log(clouds.length)
  for (const cell of clouds) {
    let pos = mercatorProjection(viewBounds, cell)
    drawCircle(
      ctx,
      (pos.x * ctx.canvas.width * scale.x) | 0,
      (pos.y * ctx.canvas.height * scale.y) | 0,
      radius | 0,
      colorCache[cell.value * 100]
    )
  }

  console.timeEnd('drawClouds')

  ctx.restore()
}
