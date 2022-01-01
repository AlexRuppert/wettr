const PI_PER_180 = Math.PI / 180

export function mercatorLat(lat) {
  return Math.log(Math.tan(deg2rad(lat) / 2 + Math.PI / 4))
}

export function deg2rad(val) {
  return val * PI_PER_180
}

export function getScale(viewBounds) {
  const { x, y } = mercatorProjection(viewBounds, viewBounds.rt)
  return { x: 1 / x, y: 1 / y }
}

export function mercatorProjection(viewBounds, { lon, lat }) {
  let x = deg2rad(lon - viewBounds.lb.lon)
  let y = mercatorLat(lat) - mercatorLat(viewBounds.lb.lat)
  return { x, y }
}


export function getLocationBounds({ lon, lat }, radiusKm = 15) {
  const deg = radiusKm / 70
  return {
    lb: {
      lat: lat - deg,
      lon: lon - deg,
    },
    rt: {
      lat: lat + deg,
      lon: lon + deg,
    },
  }
}
export function isInBounds({ lon, lat }, viewBounds: GeoBounds) {
  const EPSILON = 0.02
  return (
    lon + EPSILON >= viewBounds.lb.lon &&
    lon - EPSILON <= viewBounds.rt.lon &&
    lat + EPSILON >= viewBounds.lb.lat &&
    lat - EPSILON <= viewBounds.rt.lat
  )
}

export function getNowestTime(times: Date[]) {
  if (times.length <= 0) return { index: -1, time: undefined }
  const now = new Date().getTime()
  const index = times
    .map(t => t.getTime())
    .reduce(
      (acc, val, i, arr) =>
        Math.abs(val - now) < Math.abs(arr[acc] - now) ? i : acc,
      0
    )
  const time = times[index]
  return { index, time }
}

export interface GeoBounds {
  lb: {
    lat: number
    lon: number
  }
  rt: {
    lat: number
    lon: number
  }
}
