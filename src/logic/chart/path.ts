function getLine(pointA: Point, pointB: Point) {
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
  previous: Point,
  current: Point,
  next: Point,
  angleIncrement: number,
  height: number,
  paddingBottom: number,
) {
  const opposedLine = getLine(previous, next)
  const angle = opposedLine.angle + angleIncrement
  const length = opposedLine.length * SMOOTHING
  const x = current.x + Math.cos(angle) * length
  const y =
    current.y +
    (current.y == height - paddingBottom ? 0 : Math.sin(angle) * length)

  return { x, y }
}
function bezier(a: Point[], i: number, height: number, paddingBottom: number) {
  const ceil = i < a.length - 1 ? 1 : 0
  const floor = i > 1 ? 2 : 1
  const startPoint = getControlPoint(
    a[i - floor],
    a[i - 1],
    a[i],
    0,
    height,
    paddingBottom,
  )
  const endPoint = getControlPoint(
    a[i - 1],
    a[i],
    a[i + ceil],
    Math.PI,
    height,
    paddingBottom,
  )

  return `C${startPoint.x},${startPoint.y} ${endPoint.x},${endPoint.y} ${a[i].x},${a[i].y}`
}

export function getPathData(
  points: Point[],
  height: number,
  paddingBottom: number,
) {
  if (points.length <= 0) return ''

  const beziers = points
    .slice(1)
    .reduce(
      (acc, cur, i, arr) => acc + bezier(points, i + 1, height, paddingBottom),
      '',
    )
  return `M${points[0].x},${points[0].y}${beziers}`
}

interface Point {
  x: number
  y: number
}
