import { stageReload } from './../logic/reloader'
import { writable, readable } from 'svelte/store'
import type { Coordinates } from './../logic/locations'
import { isLocationSet } from '../logic/locations'
import type { GeoBounds } from '../logic/radar/utils'

import Worker from './../workers/worker.ts?worker'
export const locationCoordinates = writable({ lat: 0, lon: 0 })

const worker = new Worker()

worker.onmessage = function ({ data: { type, data } }) {
  switch (type) {
    case 'currentWeatherData':
      currentWeatherData.set(data)
      break
    case 'weatherData':
      weatherData.set(data)
      break
    case 'cloudData':
      cloudData.set(data)
      break
    case 'currentCloudData':
      currentCloudData.set(data)
      break
    case 'weatherWarningData':
      weatherWarningData.set(data)
      break

    default:
      break
  }
}

export const thread = readable(worker)
export const darkMode = writable(false)
export const radarOpen = writable(false)
export const currentWeatherData = writable({})
export const weatherData = writable([])
export const weatherWarningData = writable([])
export const currentCloudData = writable({
  times: [],
  clouds: [],
  viewBounds: {},
} as { times: Date[]; clouds: any[]; viewBounds: GeoBounds })
export const cloudData = writable({ times: [], clouds: [], viewBounds: {} } as {
  times: Date[]
  clouds: any[]
  viewBounds: GeoBounds
})
export let coordinates: Coordinates
locationCoordinates.subscribe(async ({ lat, lon }) => {
  if (isLocationSet({ lat, lon })) {
    coordinates = { lat, lon }
    stageReload(true)
  }
})
