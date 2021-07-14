import { writable } from 'svelte/store'
import Weather from './../logic/weather'
export const locationCoordinates = writable({ lat: 0, lon: 0 })

export const currentWeatherData = writable({})
export const weatherData = writable([])
locationCoordinates.subscribe(async ({ lat, lon }) => {
  if (lat !== 0 || lon !== 0) {
    currentWeatherData.set(Weather.getCurrentWeatherDummy())
    weatherData.set(await Weather.getWeatherDummy())
  }
})
