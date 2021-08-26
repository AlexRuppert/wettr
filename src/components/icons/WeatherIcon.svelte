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
  export let color: string = undefined

  const iconLookup = {
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
  }
  let path: string
  $: path = iconLookup[icon]
</script>

<SvgIcon d={path} fill={color} />
