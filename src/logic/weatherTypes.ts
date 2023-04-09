export type WeatherIconType =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'fog'
  | 'wind'
  | 'rain'
  | 'sleet'
  | 'snow'
  | 'hail'
  | 'thunderstorm'

type Condition =
  | 'dry'
  | 'fog'
  | 'rain'
  | 'sleet'
  | 'snow'
  | 'hail'
  | 'thunderstorm'

type Source = {
  id: number
  dwd_station_id: string
  observation_type: string
  lat: number
  lon: number
  height: number
  station_name: string
  wmo_station_id: string
  first_record: string
  last_record: string
  distance: number
}

type common = {
  source_id: number
  timestamp: string
  cloud_cover: number
  condition: Condition
  dew_point: number
  pressure_msl: number
  relative_humidity: number
  visibility: number
  temperature: number
  icon: WeatherIconType
}
export interface CurrentWeatherDataType extends common {
  precipitation_10: number
  precipitation_30: number
  precipitation_60: number
  wind_direction_10: number
  wind_direction_30: number
  wind_direction_60: number
  wind_speed_10: number
  wind_speed_30: number
  wind_speed_60: number
  wind_gust_direction_10: number
  wind_gust_direction_30: number
  wind_gust_direction_60: number
  wind_gust_speed_10: number
  wind_gust_speed_30: number
  wind_gust_speed_60: number
  sunshine_30: number
  sunshine_60: number
  fallback_source_ids: {}
  icon: WeatherIconType
}
export interface RawCurrentWeatherDataType {
  weather: CurrentWeatherDataType
  sources: Source[]
}
export interface RawDayWeatherDataType {
  weather: (common & {
    precipitation: number
    precipitation_probability: number
    wind_direction: number
    wind_speed: number
    wind_gust_direction: number
    wind_gust_speed: number
    sunshine: number
  })[]
  sources: Source[]
}

export interface WeatherDataType {
  timestamp: string
  cloudCover: number
  condition: string
  dewPoint: number
  precipitation: number
  precipitationProbability: number
  pressureMsl: number
  relativeHumidity: number
  visibility: number
  windDirection: number
  windSpeed: number
  windGustDirection: number
  windGustSpeed: number
  sunshine: number
  temperature: number
  icon: WeatherIconType
  hours: number
}

export interface DayWeatherDataType {
  day: Date
  dayParts: { icon: WeatherIconType }[]
  max: { temperature: number }
  min: { temperature: number }
  dayGraph: {
    timestamp: Date
    sunninessPercent: number
    precipitationPercent: number
    temperaturePercent: number
    temperature: number
    wind: number
    windGust: number
  }[]
  dayLight: { sunrise: Date; sunset: Date }
  data: WeatherDataType[]
}
