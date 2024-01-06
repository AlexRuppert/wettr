import { type Coordinates } from '@/logic/locations'
import { writable } from '@/logic/svelte.svelte'
import { type CurrentWeatherDataType } from '@/logic/weatherTypes'

export let locationCoordinates = writable<Coordinates>({ lat: 0, lon: 0 })
export let locationState = writable<string>('')
export let darkMode = writable(false)
export let currentWeatherData = writable<CurrentWeatherDataType>(null)
export let weatherData = writable([])
export let weatherWarningData = writable([])
