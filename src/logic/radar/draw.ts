import { mercatorProjection, getScale, isInBounds, GeoBounds } from './utils'

function getKmSizeInPx(viewBounds, ctx) {
  return (
    ctx.canvas.height / ((viewBounds.rt.lat - viewBounds.lb.lat) * 70 * 0.8)
  )
}

function getCloudColor(value: number) {
  return `hsla(${250 + 20 * value},${20 + value * 80}%,${
    (1 - value) * 80
  }%,${1}`
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

export function initCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  return ctx
}

export function drawLocation(ctx: CanvasRenderingContext2D) {
  drawCircle(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, 3, '#fa4a2f')
  drawCircle(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, 2, '#fff')
}

export function drawClouds(
  clouds,
  viewBounds: GeoBounds,
  ctx: CanvasRenderingContext2D
) {
  ctx.translate(0, ctx.canvas.height)
  ctx.scale(1, -1)
  const scale = getScale(viewBounds)
  console.log(scale)
  const radius = getKmSizeInPx(viewBounds, ctx) / 2
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
