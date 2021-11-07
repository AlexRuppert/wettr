import {
  currentWeatherData,
  coordinates,
  weatherData,
  currentCloudData,
  cloudData,
} from './../stores/store'
import { getClouds } from './radar/clouds'
import { getLocationBounds } from './radar/utils'
import Weather from './weather'

const CHECK_INTERVAL_MS = 10 * 60 * 1000
const FORECAST_DAYS = 6
let nextCheckTimeout
let nextCheckTime = 0

export async function reload() {
  try {
    const currentWeatherRequest = Weather.getCurrentWeather(
      coordinates.lat,
      coordinates.lon
    )
    const weatherRequest = Weather.getWeather(
      coordinates.lat,
      coordinates.lon,
      FORECAST_DAYS
    )
    const currentCloudRequest = getClouds(getLocationBounds(coordinates), true)
    currentWeatherData.set(await currentWeatherRequest)
    currentCloudData.set(await currentCloudRequest)
    weatherData.set(await weatherRequest)
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

export async function reloadClouds() {
  try {
    console.log('reloadClouds')
    const cloudRequest = getClouds(getLocationBounds(coordinates))
    cloudData.set(await cloudRequest)
  } catch (err) {
    console.error(err)
  }
}
