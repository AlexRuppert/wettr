<svelte:options immutable />

<script context="module">
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
</script>

<script lang="ts">
  import SvgIcon from './SvgIcon.svelte'
  import type { WeatherIconType } from '../../logic/weatherTypes'
  export let icon: WeatherIconType
  export let color: string = '#444'

  let path: string
  $: path = iconLookup[icon]
</script>

<SvgIcon d={path} fill={color} />
