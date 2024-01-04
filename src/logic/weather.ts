import { getCachedRequest } from '@/logic/cache'
import { getSunriseSunset } from '@/logic/time'
import { isBetween, trimCoordinates } from '@/logic/utils'
import {
  CurrentWeatherDataType,
  type RawCurrentWeatherDataType,
  type RawDayWeatherDataType,
  type WeatherDataType,
  type WeatherIconType,
} from '@/logic/weatherTypes'
const ENDPOINT = 'https://api.brightsky.dev/'
const MS_IN_HOUR = 1000 * 60 * 60

let currentWeatherUrl = new URL(ENDPOINT + 'current_weather')
let weatherUrl = new URL(ENDPOINT + 'weather')

export async function getCurrentWeather(lat: number, lon: number) {
  currentWeatherUrl.search = new URLSearchParams({
    ...trimCoordinates({ lon, lat }),
    tz: 'Europe/Berlin',
  }).toString()
  return processCurrentWeatherData(
    await (await getCachedRequest(currentWeatherUrl.toString(), 9)).json(),
  )
}

export async function getWeather(lat: number, lon: number, days = 3) {
  const now = new Date()
  const future = new Date(now.getTime() + MS_IN_HOUR * 24 * days - 10)

  weatherUrl.search = new URLSearchParams({
    ...trimCoordinates({ lon, lat }),
    date: now.toISOString().split('T')[0],
    last_date: future.toISOString().split('T')[0],
    tz: 'Europe/Berlin',
  }).toString()
  return processWeatherData(
    await (await getCachedRequest(weatherUrl.toString(), 9)).json(),
    lat,
    lon,
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

function getMostRelevantIcon(times) {
  const iconValue = (icon: WeatherIconType) =>
    /thunderstorm|hail/.test(icon) ? 12 : 1

  const iconCount = new Map()
  let maxIcon = 'clear-day'
  let maxOccurrence = 0
  times.forEach(time => {
    const icon = time.icon.replace('night', 'day')
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
  lat,
  lon,
): any[] {
  const daysHash = new Map()

  weatherData.weather.forEach(weather => {
    const result = {
      ...weather,
      temperature: Math.round(weather.temperature),
      hours: new Date(weather.timestamp).getHours(),
    } as WeatherDataType
    const [dayString, timeString] = result.timestamp.split('T')
    const tzOffset = +result.timestamp.split('+')[1].replace(':', '') / 100 //extremely simplified

    let day = new Date(new Date(dayString).getTime() - tzOffset * MS_IN_HOUR)
    if (timeString.startsWith('00')) {
      const previousDay = new Date(day.getTime() - MS_IN_HOUR * 24)
      daysHash.get(previousDay.toISOString())?.push({
        ...result,
      })
    }
    daysHash.get(day.toISOString())?.push(result) ??
      daysHash.set(day.toISOString(), [result])
  })

  const result = Array.from(daysHash.entries()).map(
    ([key, values]: [Date, WeatherDataType[]]) => {
      const day = new Date(key)
      const dayLight = getSunriseSunset(day, lat, lon)
      let sections = {
        day: [],
        morning: [],
        noon: [],
        evening: [],
      }
      //console.log(day, values)

      values.forEach(v => {
        ;[
          ['day', 0, 24],
          ['morning', 4, 9],
          ['noon', 10, 22],
          ['evening', 18, 22],
        ].forEach(
          ([name, start, end]) =>
            isBetween(v.hours, +start, +end) && sections[name].push(v),
        )
      })
      return {
        day,
        dayLight,
        dayParts: [sections.morning, sections.noon, sections.evening].map(t => {
          const icon = getMostRelevantIcon(t)
          return { icon }
        }),
        ...getDayGraphData(sections.day),
        data: values as WeatherDataType[],
      }
    },
  )

  return result
}
