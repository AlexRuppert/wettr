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
