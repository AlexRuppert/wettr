import { stageReload, reloader } from './../logic/reloader'
import { writable } from 'svelte/store'
export const locationCoordinates = writable({ lat: 0, lon: 0 })

export const currentWeatherData = writable({})
export const weatherData = writable([])
export let coordinates
locationCoordinates.subscribe(async ({ lat, lon }) => {
  if (lat !== 0 || lon !== 0) {
    coordinates = { lat, lon }
    stageReload(true)
  }
})

reloader()