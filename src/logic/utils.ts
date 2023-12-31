import type { WeatherIconType } from './weatherTypes'

export function getDarkLightColor(color, darkMode) {
  return darkMode ? color.dark : color.light
}

export const getWeatherIconClass = (icon: WeatherIconType) => {
  switch (icon) {
    case 'rain':
    case 'sleet':
    case 'hail':
    case 'snow':
    case 'thunderstorm':
      return 'rain'
    case 'clear-day':
    case 'clear-night':
    case 'partly-cloudy-day':
    case 'partly-cloudy-night':
      return 'sun'
    default:
      return 'other'
  }
}

export function sort<T>(array: T[], fn?: (a: T, b: T) => number) {
  const copy = array.slice()
  copy.sort(fn)
  return copy
}

export const isBetween = (val: number, left: number, right: number) =>
  val >= left && val <= right

export const round = (num: number, decimals: number = 0) => {
  const factor = 10 ** decimals
  return Math.round(num * factor) / factor
}

export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max)
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

export function getLocationBounds({ lon, lat }, radiusKm = 8) {
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

export function toLocalDecimal(num, precision = 0) {
  return Number.parseFloat(num).toFixed(precision).toLocaleString()
}
