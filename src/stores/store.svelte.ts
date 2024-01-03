import { type Coordinates } from '@/logic/locations'
import { writable } from '@/logic/svelte.svelte'
import { type WeatherDataType } from '@/logic/weatherTypes'

export let locationCoordinates = writable<Coordinates>({ lat: 0, lon: 0 })
export let darkMode = writable(false)
export let currentWeatherData = writable<WeatherDataType>(null)
export let weatherData = writable([])
export let weatherWarningData = writable([])
