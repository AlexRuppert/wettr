import { getCurrentWeather, getWeather } from '@/logic/weather'
import { getWeatherWarnings } from '@/logic/weatherWarnings'
;('preloadthis')
onmessage = async function ({ data: { type, data } }) {
  let result
  switch (type) {
    case 'currentWeatherData':
      result = getCurrentWeather(data.lat, data.lon)
      break
    case 'weatherData':
      result = getWeather(data.lat, data.lon, data.days)
      break
    case 'weatherWarningData':
      result = getWeatherWarnings(data)
    default:
      break
  }

  postMessage({ type, data: await result })
}

export {}
