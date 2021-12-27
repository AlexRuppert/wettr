import { stageReload, reloader } from './../logic/reloader'
import { writable } from 'svelte/store'
import type {Coordinates} from './../logic/locations'
import { isLocationSet } from '../logic/locations'
import type { GeoBounds } from '../logic/radar/utils'
export const locationCoordinates = writable({ lat: 0, lon: 0 })

export const darkMode = writable(false)
export const radarOpen = writable(false)
export const currentWeatherData = writable({})
export const weatherData = writable([])
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

reloader()
