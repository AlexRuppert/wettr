import { currentWeatherData, coordinates, weatherData } from './../stores/store'
import Weather from './weather'

const CHECK_INTERVAL_MS = 10 * 60 * 1000
const FORECAST_DAYS = 6
let nextCheckTimeout
let nextCheckTime = 0

export async function reload() {
  try {
    currentWeatherData.set(
      await Weather.getCurrentWeather(coordinates.lat, coordinates.lon)
    )
    weatherData.set(
      await Weather.getWeather(coordinates.lat, coordinates.lon, FORECAST_DAYS)
    )
  } catch (err) {
    console.error(err)
  }

  nextCheckTime = Date.now() + CHECK_INTERVAL_MS
  clearTimeout(nextCheckTimeout)
  nextCheckTimeout = setTimeout(stageReload, CHECK_INTERVAL_MS)
}

export async function stageReload(force = false) {
  const state = document.visibilityState

  if (
    force ||
    (state === 'visible' && Date.now() > nextCheckTime && coordinates)
  ) {
    reload()
  }
}

export function reloader() {
  document.addEventListener('visibilitychange', () => stageReload())
  document.addEventListener('pagehide', () => stageReload())
  stageReload()
}
