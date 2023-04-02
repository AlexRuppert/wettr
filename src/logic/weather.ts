import type {
  WeatherDataType,
  RawCurrentWeatherDataType,
  RawDayWeatherDataType,
  WeatherIconType,
} from './weatherTypes'
import { getSunriseSunset } from './time'
import { getWeatherIconColors, isBetween } from './utils'
import { getCachedRequest } from './cache'
const ENDPOINT = 'https://api.brightsky.dev/'
const MS_IN_HOUR = 1000 * 60 * 60

let currentWeatherUrl = new URL(ENDPOINT + 'current_weather')
let weatherUrl = new URL(ENDPOINT + 'weather')

function trimCoordinates({ lon, lat }) {
  return { lon: lon.toFixed(3), lat: lat.toFixed(3) }
}

export async function getCurrentWeather(lat: number, lon: number) {
  currentWeatherUrl.search = new URLSearchParams({
    ...trimCoordinates({ lon, lat }),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).toString()
  return processCurrentWeatherData(
    await (await getCachedRequest(currentWeatherUrl.toString(), 9)).json()
  )
}

function addTimePortion(date = new Date(), beforeMidnight = false) {
  const dateString = /[+-]\d{4}/.exec(date.toString())[0]
  const timeZoneOffset = dateString.slice(0, 3) + ':' + dateString.slice(3)

  return `T${beforeMidnight ? '23:59' : '00:00'}:00${timeZoneOffset}`
}
function dateToDateTime(date = new Date(), beforeMidnight = false) {
  return date.toISOString().split('T')[0] + addTimePortion(date, beforeMidnight)
}
export async function getWeather(lat: number, lon: number, days = 3) {
  const now = new Date()
  const future = new Date(now.getTime() + MS_IN_HOUR * 24 * days - 10)

  weatherUrl.search = new URLSearchParams({
    ...trimCoordinates({ lon, lat }),
    days: days.toString(),
    date: dateToDateTime(now),
    last_date: dateToDateTime(future, true),
  }).toString()
  const result = processWeatherData(
    await (await getCachedRequest(weatherUrl.toString(), 9)).json(),
    lat,
    lon
  )
  return result
}

function renameRaw(keys, raw) {
  return Object.fromEntries(
    keys.map(key => [
      key
        .replaceAll(/_([a-z])/g, (_, l) => l.toUpperCase())
        .replaceAll(/_\d+/g, ''),
      raw[key],
    ])
  )
}

function processCurrentWeatherData(
  weatherData: RawCurrentWeatherDataType
): WeatherDataType {
  const renamed = renameRaw(
    [
      'timestamp',
      'cloud_cover',
      'condition',
      'dew_point',
      'precipitation_60',
      'pressure_msl',
      'relative_humidity',
      'visibility',
      'wind_direction_10',
      'wind_speed_10',
      'wind_gust_direction_10',
      'wind_gust_speed_10',
      'sunshine_30',
      'temperature',
      'icon',
    ],
    weatherData.weather
  )
  return {
    ...renamed,
    temperature: Math.round(renamed.temperature),
  } as WeatherDataType
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
        cloudCover,
        windSpeed,
        windGustSpeed,
      }) => ({
        timestamp: new Date(timestamp),
        temperaturePercent:
          temperatureRange === 0
            ? 0
            : Math.abs((temperature - min) / temperatureRange),
        temperature,
        precipitationPercent:
          Math.min(Math.pow(Math.sqrt(precipitation) * 1.7, 2), 6) / 6,
        sunninessPercent: 1 - cloudCover / 100,
        wind: windSpeed,
        windGust: windGustSpeed,
      })
    ),
  }
}

function processWeatherData(
  weatherData: RawDayWeatherDataType,
  lat,
  lon
): any[] {
  const daysHash = new Map()
  console.log(weatherData)
  weatherData.weather.forEach(weather => {
    const renamed = renameRaw(Object.keys(weather), weather)

    const result = {
      ...renamed,
      temperature: Math.round(renamed.temperature),
      hours: new Date(renamed.timestamp).getHours(),
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
            isBetween(v.hours, +start, +end) && sections[name].push(v)
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
    }
  )

  return result
}
