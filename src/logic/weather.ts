import type {
  WeatherDataType,
  RawCurrentWeatherDataType,
  RawDayWeatherDataType,
  DayWeatherDataType,
  WeatherIconType,
} from './weatherTypes'
import { currentWeatherData, weatherData } from '../stores/store'
import { getSunriseSunset } from './time'
const ENDPOINT = 'https://api.brightsky.dev/'
const MS_IN_HOUR = 1000 * 60 * 60
const DUMMY_DELAY = 500
let currentWeatherUrl = new URL(ENDPOINT + 'current_weather')
let weatherUrl = new URL(ENDPOINT + 'weather')

export default class Weather {
  static normalizeIcon(icon) {
    return icon.replace(/-\w/g, text => text.replace(/-/, '').toUpperCase())
  }
  static async getCurrentWeather(lat: number, lon: number) {
    currentWeatherUrl.search = new URLSearchParams({
      lat: lat.toFixed(3),
      lon: lon.toFixed(3),
      tz: 'Europe/Berlin',
    }).toString()
    const result = this.processCurrentWeatherData(
      await (await fetch(currentWeatherUrl.toString())).json()
    )

    currentWeatherData.set(result)
    return result
  }

  static formatTimeZoneOffset(date = new Date()) {
    let tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-'
    const pad = t => {
      const normalized = Math.floor(Math.abs(t))
      return (normalized < 10 ? '0' : '') + normalized
    }
    return dif + pad(tzo / 60) + ':' + pad(tzo % 60)
  }

  static addTimePortion(date = new Date(), beforeMidnight = false) {
    return (
      (beforeMidnight ? 'T23:59:00' : 'T00:00:00') +
      Weather.formatTimeZoneOffset(date)
    )
  }
  static dateToDateTime(date = new Date(), beforeMidnight = false) {
    return (
      new Intl.DateTimeFormat('eu').format(date).replace(/\//g, '-') +
      Weather.addTimePortion(date, beforeMidnight)
    )
  }
  static async getWeather(lat: number, lon: number, days = 3) {
    const now = new Date()
    const future = new Date(now.getTime() + MS_IN_HOUR * 24 * days - 10)

    weatherUrl.search = new URLSearchParams({
      lat: lat.toFixed(3),
      lon: lon.toFixed(3),
      days: days.toString(),
      date: Weather.dateToDateTime(now),
      last_date: Weather.dateToDateTime(future, true),
    }).toString()
    const result = this.processWeatherData(
      await (await fetch(weatherUrl.toString())).json(),
      lat,
      lon
    )
    weatherData.set(result)
    return result
  }

  static processCurrentWeatherData(
    weatherData: RawCurrentWeatherDataType
  ): WeatherDataType {
    const weather = weatherData.weather
    return {
      timestamp: weather.timestamp,
      cloudCover: weather.cloud_cover,
      condition: weather.condition,
      dewPoint: weather.dew_point,
      precipitation: weather.precipitation_60,
      pressureMsl: weather.pressure_msl,
      relativeHumidity: weather.relative_humidity,
      visibility: weather.visibility,
      windDirection: weather.wind_direction_10,
      windSpeed: weather.wind_speed_10,
      windGustDirection: weather.wind_gust_direction_10,
      windGustSpeed: weather.wind_gust_speed_10,
      sunshine: weather.sunshine_30,
      temperature: Math.round(weather.temperature),
      icon: this.normalizeIcon(weather.icon) as WeatherIconType,
    }
  }

  static processWeatherData(
    weatherData: RawDayWeatherDataType,
    lat,
    lon
  ): any[] {
    const mapped = weatherData.weather.map(weather => ({
      timestamp: weather.timestamp,
      cloudCover: weather.cloud_cover,
      condition: weather.condition,
      dewPoint: weather.dew_point,
      precipitation: weather.precipitation,
      pressureMsl: weather.pressure_msl,
      relativeHumidity: weather.relative_humidity,
      visibility: weather.visibility,
      windDirection: weather.wind_direction,
      windSpeed: weather.wind_speed,
      windGustDirection: weather.wind_gust_direction,
      windGustSpeed: weather.wind_gust_speed,
      sunshine: weather.sunshine,
      temperature: Math.round(weather.temperature),
      icon: this.normalizeIcon(weather.icon),
    }))

    const daysHash = {}
    mapped.forEach(element => {
      const day = element.timestamp.split('T')[0]
      if (!daysHash[day]) {
        daysHash[day] = []
      }
      daysHash[day].push(element)
    })

    let iconCount = {}
    const between = (val: number, left: number, right: number) =>
      val >= left && val <= right
    const getHours = (timestamp: string | number | Date) =>
      new Date(timestamp).getHours()
    const mostRelevantIcon = times => {
      const iconValue = (icon: WeatherIconType) => {
        switch (icon) {
          case 'thunderstorm':
          case 'hail':
            return 12
          default:
            return 1
        }
      }
      iconCount = {}
      times.forEach(
        element =>
          (iconCount[element.icon] =
            iconValue(element.icon) + (iconCount[element.icon] ?? 0))
      )
      return Object.entries(iconCount).reduce(
        (acc, [key, value]) => (value > acc[1] ? [key, value] : acc),
        ['clear-day', 0]
      )[0] as WeatherIconType
    }

    const getIconColor = (icon: WeatherIconType) => {
      switch (icon) {
        case 'rain':
        case 'sleet':
        case 'hail':
        case 'snow':
        case 'thunderstorm':
          return '#0066ED'
        case 'clearDay':
        case 'clearNight':
        case 'partlyCloudyDay':
        case 'partlyCloudyNight':
          return '#FFB901'
        default:
          return '#444444'
      }
    }

    const dayGraphData = (times: WeatherDataType[]) => {
      let max = -Infinity,
        min = Infinity

      times.forEach(element => {
        if (element.temperature > max) max = element.temperature
        if (element.temperature < min) min = element.temperature
      })
      return {
        min: { temperature: min },
        max: { temperature: max },
        dayGraph: times.map(time => {
          return {
            timestamp: time.timestamp,
            temperature: Math.abs(
              (time.temperature - min) / (Math.abs(max) - Math.abs(min))
            ),
            precipitation:
              Math.min(Math.pow(Math.sqrt(time.precipitation) * 1.7, 2), 6) / 6,
            sunniness: 1 - time.cloudCover / 100,
          }
        }),
      }
    }
    const result = Object.entries(daysHash).map(
      ([key, value]: [string, (WeatherDataType & { hours?: number })[]]) => {
        value = value.map(v => ({
          ...v,
          hours: getHours(v.timestamp),
        }))

        const day = new Date(key)
        const dayTimes = []
        const morningTimes = []
        const noonTimes = []
        const eveningTimes = []
        const dayLight = getSunriseSunset(day, lat, lon)

        value.forEach(v => {
          if (between(v.hours, 4, 22)) dayTimes.push(v)
          if (between(v.hours, 4, 9)) morningTimes.push(v)
          if (between(v.hours, 10, 17)) noonTimes.push(v)
          if (between(v.hours, 18, 22)) eveningTimes.push(v)
        })

        return {
          day,
          dayLight,
          dayParts: [morningTimes, noonTimes, eveningTimes].map(t => {
            const icon = mostRelevantIcon(t)
            return { icon, color: getIconColor(icon) }
          }),
          ...dayGraphData(dayTimes),
          data: value as WeatherDataType[],
        }
      }
    )

    return result
  }
}
