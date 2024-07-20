import { getWeatherPrecipitation } from '@/logic/precipitation'
import { getCurrentWeather, getWeather } from '@/logic/weather'

import { getWeatherWarnings } from '@/logic/weatherWarnings'
const CURRENT_WEATHER_DATA = 'currentWeatherData'
const WEATHER_DATA = 'weatherData'
const WEATHER_WARNING_DATA = 'weatherWarningData'
const WEATHER_PRECIPITATION = 'weatherPrecipitation'
;('preloadthis')
onmessage = async function ({ data: { type, data } }) {
  let result
  switch (type) {
    case CURRENT_WEATHER_DATA:
      result = getCurrentWeather(data)
      break
    case WEATHER_DATA:
      result = getWeather(data, data.days)
      break
    case WEATHER_WARNING_DATA:
      result = getWeatherWarnings(data)
      break
    case WEATHER_PRECIPITATION:
      result = getWeatherPrecipitation(data)
    default:
      break
  }

  postMessage({ type, data: await result })
}

export {}
