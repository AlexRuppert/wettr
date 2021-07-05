<script lang="ts">
  import {
    clearDay,
    clearNight,
    partlyCloudyDay,
    partlyCloudyNight,
    cloudy,
    fog,
    hail,
    rain,
    sleet,
    snow,
    thunderstorm,
    wind,
  } from './icons'

  import SvgIcon from './SvgIcon.svelte'
  import type { WeatherIconType } from '../../logic/weatherTypes'
  export let icon: WeatherIconType

  function mapIconToPath(icon: WeatherIconType) {
    return {
      'clear-day': clearDay,
      'clear-night': clearNight,
      'partly-cloudy-day': partlyCloudyDay,
      'partly-cloudy-night': partlyCloudyNight,
      cloudy: cloudy,
      fog: fog,
      wind: wind,
      rain: rain,
      sleet: sleet,
      snow: snow,
      hail: hail,
      thunderstorm: thunderstorm,
    }[icon]
  }
  let path: string
  $: path = mapIconToPath(icon)
</script>

<SvgIcon d={path} />
