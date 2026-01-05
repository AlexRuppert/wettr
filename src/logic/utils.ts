import { type WeatherIconType } from '@/logic/weatherTypes'

export function getWeatherIconClass(icon: WeatherIconType) {
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

export function sortBy<T>(...sortFns: ((a: T, b: T) => number)[]) {
  return (a: T, b: T) => {
    for (const fn of sortFns) {
      const result = fn(a, b)
      if (result !== 0) {
        return result
      }
    }
    return 0
  }
}

export function isBetween(val: number, left: number, right: number) {
  return val >= left && val <= right
}
export function round(num: number, decimals: number = 0) {
  const factor = 10 ** decimals
  return Math.round(num * factor) / factor
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}

export function minThreshold(threshold: number, num: number) {
  return num >= threshold ? num : 0
}

export function chunk<T>(array: T[], size: number) {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
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
interface GeoBounds {
  lb: {
    lat: number
    lon: number
  }
  rt: {
    lat: number
    lon: number
  }
}

export function toLocalDecimal(num: string | number | null, precision = 0) {
  return Number.parseFloat(num?.toString() ?? '0')
    .toFixed(precision)
    .toLocaleString()
}

export function trimCoordinates({ lon, lat }) {
  return { lon: lon.toFixed(3), lat: lat.toFixed(3) }
}

export function cn(...props: (string | Record<string, boolean>)[]) {
  return props
    .flatMap(p => {
      if (typeof p === 'string') {
        return p
      } else if (typeof p === 'object') {
        return Object.entries(p)
          .filter(([_, value]) => !!value)
          .map(([key, _]) => key)
      } else return ''
    })
    .join(' ')
}

export function isDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getStrokeFill(outline: boolean) {
  return {
    stroke: outline ? 'currentColor' : 'none',
    fill: !outline ? 'currentColor' : 'none',
  }
}

function toGermanLocalDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
}

export function getGermanHour(date: Date): number {
  return +toGermanLocalDate(date).find(part => part.type === 'hour').value
}

export function getGermanDate(date: Date): number {
  return +toGermanLocalDate(date).find(part => part.type === 'day').value + 1
}
export function getGermanTimeString(date: Date): string {
  const localDate = toGermanLocalDate(date)
  return (
    localDate.find(part => part.type === 'hour').value +
    ':' +
    localDate.find(part => part.type === 'minute').value
  )
}
