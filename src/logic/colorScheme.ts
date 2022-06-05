import { darkMode } from '../stores/store'
let colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)')
const setColorScheme = (e: MediaQueryListEvent) => {
  darkMode.set(e.matches)
  document.documentElement.classList[e.matches ? 'add' : 'remove']('dark')
}
setColorScheme(colorSchemeQueryList as unknown as MediaQueryListEvent)
colorSchemeQueryList.addEventListener('change', setColorScheme)
