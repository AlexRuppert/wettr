import { writable } from 'svelte/store'
import Weather from './../logic/weather'
export const locationCoordinates = writable({ lat: 0, lon: 0 })

export const currentWeatherData = writable(Weather.getCurrentWeatherDummy())
export const weatherData = writable(Weather.getWeatherDummy())
