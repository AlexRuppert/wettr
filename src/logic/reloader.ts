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

const cloudsCache = new Map()

async function getCloudDataFromCache(viewBounds, now = false) {
  const key = JSON.stringify(viewBounds)

  if (cloudsCache.has(key)) {
    const cached = cloudsCache.get(key)
    //in time
    if (Date.now() < cached.timestamp + CHECK_INTERVAL_MS) {
      return cached.clouds
    } else {
      cloudsCache.delete(key)
    }
  }
  console.log('reloadClouds')
  const clouds = await getClouds(viewBounds, now)

  cloudsCache.set(key, { clouds, timestamp: Date.now() })
  return clouds
}

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
    const currentCloudRequest = getCloudDataFromCache(
      getLocationBounds(coordinates),
      true
    )
    currentWeatherRequest.then(data => {
      currentWeatherData.set(data)
    })
    currentCloudRequest.then(data => {
      currentCloudData.set(data)
    })
    weatherRequest.then(data => {
      weatherData.set(data)
    })
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
    const cloudRequest = getCloudDataFromCache(getLocationBounds(coordinates))
    cloudData.set(await cloudRequest)
  } catch (err) {
    console.error(err)
  }
}
