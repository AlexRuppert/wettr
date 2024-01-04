import { getCurrentWeather, getWeather } from '@/logic/weather'

import { getWeatherWarnings } from '@/logic/weatherWarnings'
const CURRENT_WEATHER_DATA = 'currentWeatherData'
const WEATHER_DATA = 'weatherData'
const WEATHER_WARNING_DATA = 'weatherWarningData'
;('preloadthis')
onmessage = async function ({ data: { type, data } }) {
  let result
  switch (type) {
    case CURRENT_WEATHER_DATA:
      result = getCurrentWeather(data.lat, data.lon)
      break
    case WEATHER_DATA:
      result = getWeather(data.lat, data.lon, data.days)
      break
    case WEATHER_WARNING_DATA:
      result = getWeatherWarnings(data)
    default:
      break
  }

  postMessage({ type, data: await result })
}

export {}
