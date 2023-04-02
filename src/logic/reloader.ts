import { get } from 'svelte/store'
import { locationCoordinates, thread } from './../stores/store'

import { getLocationBounds } from './radar/utils'

const CHECK_INTERVAL_MS = 10 * 60 * 1000
export const FORECAST_DAYS = 7
let nextCheckTimeout
let nextCheckTime = 0

export async function reload() {
  try {
    const coordinates = get(locationCoordinates)
    const worker = get(thread)
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
        get(locationCoordinates))
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

export async function reloadClouds() {
  try {
    get(thread).postMessage({
      type: 'cloudData',
      data: {
        bounds: getLocationBounds(get(locationCoordinates)),
        onlyNow: false,
      },
    })
  } catch (err) {
    console.error(err)
  }
}
