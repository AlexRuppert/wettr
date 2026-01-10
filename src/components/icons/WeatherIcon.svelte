<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { getStrokeFill, getWeatherIconClass } from '@/logic/utils'
  import type { WeatherIconType } from '@/logic/weatherTypes'
  import {
    weatherSun,
    weatherCloudOpen,
    weatherRain,
    weatherFog,
    weatherSunRays,
    weatherCloud,
    weatherHail,
    weatherSleet,
    weatherSnow,
    weatherSunPart,
    weatherSunPartRays,
    weatherThunderstorm,
    weatherWind,
  } from '../icons/icons'

  interface Props extends CustomElement {
    icon: WeatherIconType
    strokeWidth?: number
  }
  let { icon, strokeWidth = 1, class: className, ...other }: Props = $props()

  const iconLookup: { [key in WeatherIconType]: string[] } = {
    'clear-day': [weatherSun, weatherSunRays],
    'clear-night': [weatherSun],
    'partly-cloudy-day': [weatherCloudOpen, weatherSunPart, weatherSunPartRays],
    'partly-cloudy-night': [weatherCloudOpen, weatherSunPart],
    cloudy: [weatherCloud],
    fog: [weatherFog],
    hail: [weatherCloudOpen, weatherHail],
    rain: [weatherCloudOpen, weatherRain],
    sleet: [weatherCloudOpen, weatherSleet],
    snow: [weatherCloudOpen, weatherSnow],
    thunderstorm: [weatherCloudOpen, weatherThunderstorm],
    wind: [weatherWind],
  }
  let colorClass = $derived(getWeatherIconClass(icon))
  let iconData = $derived(iconLookup[icon])
</script>

<svg
  stroke-linejoin="round"
  stroke-linecap="round"
  viewBox="0 0 30 30"
  stroke-width={strokeWidth}
  stroke="currentColor"
  fill="none"
  class={[
    className,
    {
      'stroke-rain': colorClass === 'rain',
      'stroke-sun': colorClass === 'sun',
    },
  ]}
  {...other}
>
  {#each iconData as d}
    <path {d} />
  {/each}
</svg>
