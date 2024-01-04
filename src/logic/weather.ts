import { getWeatherIconClass } from './utils'
import { Coordinates } from './locations'
import { getCachedRequest } from '@/logic/cache'
import { getSunriseSunset } from '@/logic/time'
import { chunk, isBetween, trimCoordinates } from '@/logic/utils'
import {
  type CurrentWeatherDataType,
  type DayWeatherData,
  type RawCurrentWeatherDataType,
  type RawDayWeatherDataType,
  type WeatherDataType,
  type WeatherIconType,
} from '@/logic/weatherTypes'
const ENDPOINT = 'https://api.brightsky.dev/'
const MS_IN_HOUR = 1000 * 60 * 60

let currentWeatherUrl = new URL(ENDPOINT + 'current_weather')
let weatherUrl = new URL(ENDPOINT + 'weather')

export async function getCurrentWeather(coordinates: Coordinates) {
  currentWeatherUrl.search = new URLSearchParams({
    ...trimCoordinates(coordinates),
    tz: 'Europe/Berlin',
  }).toString()
  return processCurrentWeatherData(
    await (await getCachedRequest(currentWeatherUrl.toString(), 9)).json(),
  )
}

export async function getWeather(coordinates: Coordinates, days = 3) {
  const now = new Date()
  const future = new Date(now.getTime() + MS_IN_HOUR * 24 * days - 10)

  weatherUrl.search = new URLSearchParams({
    ...trimCoordinates(coordinates),
    date: now.toISOString().split('T')[0],
    last_date: future.toISOString().split('T')[0],
    tz: 'Europe/Berlin',
  }).toString()
  return processWeatherData(
    await (await getCachedRequest(weatherUrl.toString(), 9)).json(),
    coordinates,
  )
}

function processCurrentWeatherData(
  weatherData: RawCurrentWeatherDataType,
): CurrentWeatherDataType {
  return {
    ...weatherData.weather,
    temperature: Math.round(weatherData.weather.temperature),
  } as CurrentWeatherDataType
}

function getMostRelevantIcon(times: WeatherDataType[]) {
  const iconValue = (icon: WeatherIconType) =>
    /thunderstorm|hail/.test(icon) ? 12 : /sleet|snow/.test(icon) ? 5 : 1

  const iconCount = new Map()
  let maxIcon = 'clear-day'
  let maxOccurrence = 0
  times.forEach(time => {
    const icon = time.icon.replace('night', 'day') as WeatherIconType
    const value = (iconCount.get(icon) ?? 0) + iconValue(icon)
    iconCount.set(icon, value)
    if (value > maxOccurrence) {
      maxOccurrence = value
      maxIcon = icon
    }
  })
  return maxIcon as WeatherIconType
}

function getDayGraphData(times: WeatherDataType[]) {
  let temperatures = times.map(t => t.temperature).sort((a, b) => a - b)
  const [min, max] = [temperatures[0], temperatures[temperatures.length - 1]]

  const temperatureRange = max - min
  return {
    min: { temperature: min },
    max: { temperature: max },
    dayGraph: times.map(
      ({
        timestamp,
        temperature,
        precipitation,
        precipitation_probability,
        cloud_cover,
        wind_speed,
        wind_gust_speed,
      }) => ({
        timestamp: new Date(timestamp),
        temperaturePercent:
          temperatureRange === 0
            ? 0
            : Math.abs((temperature - min) / temperatureRange),
        temperature,
        precipitationPercent:
          Math.min(
            Math.pow(
              (1 + precipitation_probability / 100) * precipitation * 1.6,
              2,
            ),
            6,
          ) / 6,
        sunninessPercent: 1 - cloud_cover / 100,
        wind: wind_speed,
        windGust: wind_gust_speed,
      }),
    ),
  }
}

function processWeatherData(
  weatherData: RawDayWeatherDataType,
  coordinates: Coordinates,
): DayWeatherData[] {
  console.log(weatherData.weather)

  const days = chunk(
    weatherData.weather.map(weather => {
      return {
        ...weather,
        temperature: Math.round(weather.temperature),
        hours: new Date(weather.timestamp).getHours(),
      } as WeatherDataType
    }),
    24,
  ).slice(0, -1)

  const result = days.map((hourData: WeatherDataType[]) => {
    const day = new Date(hourData[0].timestamp)
    const dayLight = getSunriseSunset(day, coordinates)

    const relevantHours = hourData.filter(h => isBetween(h.hours, 7, 21))
    const icon = getMostRelevantIcon(relevantHours)
    const iconClass = getWeatherIconClass(icon)
    return {
      day,
      dayLight,
      daySummary: {
        icon,
        iconClass,
      },
      ...getDayGraphData(hourData),
      data: hourData as WeatherDataType[],
    }
  })
  console.log(result)
  return result
}
