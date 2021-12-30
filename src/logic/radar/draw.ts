import type { GeoBounds } from './utils'
import { mercatorProjection, getScale, isInBounds } from './utils'

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

export function initCanvas(canvas: HTMLCanvasElement, width: number) {
  canvas.width = width * 3
  canvas.height = width * 3
  const ctx = canvas.getContext('2d')
  ctx.translate(0, ctx.canvas.height)
  ctx.scale(1, -1)
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
  clouds.forEach(cell => {
    if (isInBounds(cell, viewBounds)) {
      let pos = mercatorProjection(viewBounds, cell)

      drawCircle(
        ctx,
        pos.x * ctx.canvas.width * scale.x,
        pos.y * ctx.canvas.height * scale.y,
        radius,
        getCloudColor(cell.value)
      )
    }
  })

  ctx.restore()
}
