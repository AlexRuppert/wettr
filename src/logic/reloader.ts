import {
  currentWeatherData,
  locationCoordinates,
  weatherData,
  weatherWarningData,
} from '@/stores/store.svelte'
import Worker from '@/workers/worker.ts?worker'
import { get } from '@/logic/svelte.svelte'

export const FORECAST_DAYS = 7
const CHECK_INTERVAL_MS = 10 * 60 * 1000

let nextCheckTimeout
let nextCheckTime = 0

export const worker = new Worker()

worker.onmessage = function ({ data: { type, data } }) {
  switch (type) {
    case 'currentWeatherData':
      currentWeatherData.value = data
      break
    case 'weatherData':
      weatherData.value = data
      break
    case 'weatherWarningData':
      weatherWarningData.value = data
      break
    default:
      break
  }
}

export async function reload() {
  try {
    const coordinates = get(locationCoordinates)

    worker.postMessage({
      type: 'currentWeatherData',
      data: coordinates,
    })
    worker.postMessage({
      type: 'weatherData',
      data: { ...coordinates, days: FORECAST_DAYS },
    })

    worker.postMessage({
      type: 'weatherWarningData',
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
