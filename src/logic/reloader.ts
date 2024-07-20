import {
  currentWeatherData,
  locationCoordinates,
  weatherData,
  weatherPrecipitation,
  weatherWarningData,
} from '@/stores/store.svelte'
import Worker from '@/workers/worker.ts?worker'
import { get } from '@/logic/svelte.svelte'

export const FORECAST_DAYS = 7
const CHECK_INTERVAL_MS = 10 * 60 * 1000

let nextCheckTimeout
let nextCheckTime = 0

const worker = new Worker()

const CURRENT_WEATHER_DATA = 'currentWeatherData'
const WEATHER_DATA = 'weatherData'
const WEATHER_WARNING_DATA = 'weatherWarningData'
const WEATHER_PRECIPITATION = 'weatherPrecipitation'
worker.onmessage = function ({ data: { type, data } }) {
  switch (type) {
    case CURRENT_WEATHER_DATA:
      currentWeatherData.value = data
      break
    case WEATHER_DATA:
      weatherData.value = data
      break
    case WEATHER_WARNING_DATA:
      weatherWarningData.value = data
      break
    case WEATHER_PRECIPITATION:
      weatherPrecipitation.value = data
      break
    default:
      break
  }
}
export async function reloadPercipitation() {
  try {
    const coordinates = get(locationCoordinates)
    worker.postMessage({
      type: WEATHER_PRECIPITATION,
      data: coordinates,
    })
  } catch (err) {
    console.error(err)
  }
}
export async function reload() {
  try {
    const coordinates = get(locationCoordinates)

    worker.postMessage({
      type: CURRENT_WEATHER_DATA,
      data: coordinates,
    })
    worker.postMessage({
      type: WEATHER_DATA,
      data: { ...coordinates, days: FORECAST_DAYS + 1 },
    })
    worker.postMessage({
      type: WEATHER_WARNING_DATA,
      data: coordinates,
    })
  } catch (err) {
    console.error(err)
  }

  nextCheckTime = Date.now() + CHECK_INTERVAL_MS
  clearTimeout(nextCheckTimeout)
  nextCheckTimeout = setTimeout(stageReload, CHECK_INTERVAL_MS)
}

export async function stageReload(force = false) {
  init()
  setTimeout(() => {
    const state = document.visibilityState
    if (
      force ||
      (state === 'visible' &&
        Date.now() > nextCheckTime &&
        locationCoordinates.value)
    ) {
      reload()
    }
  }, 0)
}
let initialized = false
function init() {
  if (!initialized) {
    document.addEventListener('visibilitychange', () => stageReload())
    document.addEventListener('pagehide', () => stageReload())
    initialized = true
  }
}
