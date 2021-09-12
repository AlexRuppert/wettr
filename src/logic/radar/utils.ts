const PI2 = 2 * Math.PI
const PI_PER_180 = Math.PI / 180

export function mercatorLat(lat) {
  return Math.log(Math.tan(deg2rad(lat) / 2 + Math.PI /4))
}

export function deg2rad(val) {
  return val * PI_PER_180
}

export function rad2deg(val) {
  return val / PI_PER_180
}

export function getScale(viewBounds) {
  const { x, y } = mercatorProjection(viewBounds, viewBounds.rt)
  return { x: 1 / x, y: 1 / y }
}

const bounds = {
  lb: {
    lon: 3.5889,
    lat: 46.9526,
  },
  rt: {
    lon: 15.7208,
    lat: 54.7405,
  },
}

export function mercatorProjection(viewBounds, { lon, lat }) {
  let x = deg2rad(lon - viewBounds.lb.lon)
  let y = (mercatorLat(lat) - mercatorLat(viewBounds.lb.lat))
  return { x, y }
}

export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function round3(value) {
  return Math.round((value + Number.EPSILON) * 1000) / 1000
}

export function getLocationBounds({ lon, lat }, radiusKm = 13) {
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
export function isInBounds({ lon, lat }, viewBounds) {
  const EPSILON = 0.02
  return (
    lon + EPSILON >= viewBounds.lb.lon &&
    lon - EPSILON <= viewBounds.rt.lon &&
    lat + EPSILON >= viewBounds.lb.lat &&
    lat - EPSILON <= viewBounds.rt.lat
  )
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
