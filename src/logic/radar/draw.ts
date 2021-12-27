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

export function initCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  circle = false
) {
  canvas.width = width * 3
  canvas.height = width * 3
  const ctx = canvas.getContext('2d')
  ctx.translate(0, ctx.canvas.height)
  ctx.scale(1, -1)
  if (circle) {
    drawCircle(
      ctx,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      ctx.canvas.width / 2 - 3,
      'transparent'
    )
    ctx.clip()
  }
  return ctx
}

export function drawLocation(
  ctx: CanvasRenderingContext2D,
  color = '#fff',
  radius = 3
) {
  drawCircle(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, radius, color)
}

export function drawClouds(
  clouds,
  viewBounds: GeoBounds,
  ctx: CanvasRenderingContext2D
) {
  const scale = getScale(viewBounds)
  const radius = getKmSizeInPx(viewBounds, ctx) / 2
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.globalCompositeOperation = 'darken'

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
  ctx.globalCompositeOperation = 'source-over'
}
