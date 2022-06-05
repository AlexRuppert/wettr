function getLine(pointA, pointB) {
  const lengthY = pointB.y - pointA.y
  const lengthX = pointB.x - pointA.x
  const length = Math.hypot(lengthY, lengthX)
  const angle = Math.atan2(lengthY, lengthX)

  return {
    length,
    angle,
  }
}
const SMOOTHING = 0.1
function getControlPoint(
  previous,
  current,
  next,
  angleIncrement,
  height,
  paddingBottom
) {
  const opposedLine = getLine(previous, next)

  const angle = opposedLine.angle + angleIncrement
  const length = opposedLine.length * SMOOTHING

  const x = current.x + Math.cos(angle) * length
  let y = current.y + Math.sin(angle) * length
  if (current.y == height - paddingBottom) {
    y = height - paddingBottom
  }

  return { x, y }
}
function bezier(a, i, height, paddingBottom) {
  const ceil = i < a.length - 1 ? 1 : 0
  const floor = i > 1 ? 2 : 1
  const startPoint = getControlPoint(
    a[i - floor],
    a[i - 1],
    a[i],
    0,
    height,
    paddingBottom
  )
  const endPoint = getControlPoint(
    a[i - 1],
    a[i],
    a[i + ceil],
    Math.PI,
    height,
    paddingBottom
  )

  return `C${startPoint.x},${startPoint.y} ${endPoint.x},${endPoint.y} ${a[i].x},${a[i].y}`
}

export function getPathData(
  points: { x: number; y: number }[],
  height: number,
  paddingBottom: number
) {
  if (points.length > 0) {
    let beziers = ''
    for (let i = 1; i < points.length; i++) {
      beziers += bezier(points, i, height, paddingBottom)
    }
    return `M${points[0].x},${points[0].y}${beziers}`
  }
  return ''
}
