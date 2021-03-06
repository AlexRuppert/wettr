import type { WeatherIconType } from './weatherTypes'

export function getForegroundColor(darkMode) {
  return getDarkLightColor(COLORS.foreground, darkMode)
}

export function getDarkLightColor(color, darkMode) {
  return darkMode ? color.dark : color.light
}

export const COLORS = {
  foreground: {
    light: '#444444',
    dark: '#9ca3aa',
  },
  rain: {
    light: '#0066ED',
    dark: '#2784FF',
  },
  sun: {
    light: '#FFB901',
    dark: '#FFC637',
  },
  warning: {
    light: '#EA580C',
    dark: '#EA580C',
  },
}

export const getWeatherIconColors = (icon: WeatherIconType) => {
  switch (icon) {
    case 'rain':
    case 'sleet':
    case 'hail':
    case 'snow':
    case 'thunderstorm':
      return COLORS.rain
    case 'clear-day':
    case 'clear-night':
    case 'partly-cloudy-day':
    case 'partly-cloudy-night':
      return COLORS.sun
    default:
      return COLORS.foreground
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