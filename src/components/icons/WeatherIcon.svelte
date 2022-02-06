<svelte:options immutable />

<script context="module">
  const iconLookup = {
    clearDay: ['sun', 'sun-rays'],
    clearNight: ['sun'],
    partlyCloudyDay: ['cloud', 'sun-part', 'sun-part-rays'],
    partlyCloudyNight: ['cloud', 'sun-part'],
    cloudy: ['cloud', 'cloud-part'],
    fog: ['fog'],
    hail: ['cloud-open', 'hail'],
    rain: ['cloud-open', 'rain'],
    sleet: ['cloud-open', 'sleet'],
    snow: ['cloud-open', 'snow'],
    thunderstorm: ['cloud-open', 'thunderstorm'],
    wind: ['wind'],
  }
</script>

<script lang="ts">
  import { getDarkLightColor, getWeatherIconColors } from '../../logic/utils'
  import type { WeatherIconType } from '../../logic/weatherTypes'
  import { darkMode } from '../../stores/store'
  export let icon: WeatherIconType
  let color: string = '#444'

  let iconData: string[]

  $: {
    color = getDarkLightColor(getWeatherIconColors(icon), $darkMode)
  }
  $: iconData = iconLookup[icon]
</script>

<svg
  viewBox="0 0 30 30"
  xmlns="http://www.w3.org/2000/svg"
  stroke-linejoin="round"
  stroke-linecap="round"
  fill="none"
  stroke-width="1.5"
  stroke={color}
>
  <defs>
    <path id="sun" d="M15 10.5a4.5 4.5 0 10.001 0" />
    <path
      id="sun-rays"
      d="M15 5v2m0 18v-2M5 15h2m18 0h-2M7.75 7.75l1.4 1.4m13.1 13.1l-1.4-1.4m1.4-13.1l-1.4 1.4m-13.1 13.1l1.4-1.4"
    />
    <path
      id="cloud-open"
      d="M7 20a4 4 0 110-8h1a4 4 0 1110-0h1.5a4 4 0 110 8"
    />
    <path id="cloud" d="M7 20a4 4 0 110-8h1a4 4 0 1110-0h1.5a4 4 0 110 8z" />
    <path id="sun-part" d="M18 7a3.8 3.8 0 116 4.5" />
    <path
      id="sun-part-rays"
      d="M21.5 1.2l0 1.5M27.5 8.8l1.5 0M25.8 4.6l1.1-1.1M17 4.6l-1.1-1.1M25.8 13l1.1 1.1"
    />

    <path
      id="cloud-part"
      d="M18.2 7.1a4 4 0 016.7 2.9h1a3.1 3 0 010 6.4h-0.2"
    />
    <path id="fog" d="M8 13h15M10 16h16M6 19h16" />
    <path id="wind" d="M8 13h13a2.5 2.5 0 10-2-4M6 16h17a2.5 2.5 0 11-2 4" />
    <path id="rain" d="M10 20l-1 5M13.3 20l-1.4 7M16.5 20l-.8 4.2" />
    <path
      id="sleet"
      d="M10 20l-.03.15m-.4 2l-.4 2M13.3 20l-.4 2m-.4 2l-.03.15m-.4 2l-.03.15M16.5 20l-.03.25m-.4 2l-.4 2"
    />
    <path
      id="snow"
      d="M10.5 21.5l0 0m0 3l0 0M13.3 20l0 0m0 3l0 0m0 3l0 0M16 21.5l0 0m0 3l0 0"
    />
    <path
      id="hail"
      d="M10 20l-.4 2m-.4 2l-.03.15M13.3 20l-.8 4m-.4 2l-.03.15M16.5 20l-.4 2m-.4 2l-.03.15"
    />
    <path
      id="thunderstorm"
      stroke-width="0.3"
      d="M12.6 17h3.5l-2.5 4h1.8l-5 6.9l2-5.3h-2.5z"
      fill={color}
    />
  </defs>

  <use href={'#' + iconData[0]} />
  <use href={'#' + iconData[1]} />
  <use href={'#' + iconData[2]} />
</svg>

<style global>
</style>
