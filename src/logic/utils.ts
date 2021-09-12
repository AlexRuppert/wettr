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
}

export const getWeatherIconColors = (icon: WeatherIconType) => {
  switch (icon) {
    case 'rain':
    case 'sleet':
    case 'hail':
    case 'snow':
    case 'thunderstorm':
      return COLORS.rain
    case 'clearDay':
    case 'clearNight':
    case 'partlyCloudyDay':
    case 'partlyCloudyNight':
      return COLORS.sun
    default:
      return COLORS.foreground
  }
}
