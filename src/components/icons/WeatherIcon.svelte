<svelte:options immutable />

<script lang="ts">
  import type { WeatherIconType } from '../../logic/weatherTypes'
  import { getWeatherIconClass } from '../../logic/utils'
  export let icon: WeatherIconType

  const iconLookup: { [key in WeatherIconType]: string } = {
    'clear-day': 'sun,sun-rays',
    'clear-night': 'sun',
    'partly-cloudy-day': 'cloud,sun-part,sun-part-rays',
    'partly-cloudy-night': 'cloud,sun-part',
    cloudy: 'cloud,cloud-part',
    fog: 'fog',
    hail: 'cloud-open,hail',
    rain: 'cloud-open,rain',
    sleet: 'cloud-open,sleet',
    snow: 'cloud-open,snow',
    thunderstorm: 'cloud-open,thunderstorm',
    wind: 'wind',
  }
  let colorClass: string = 'other'
  let iconData: string[]

  $: {
    colorClass = getWeatherIconClass(icon)
    iconData = iconLookup[icon].split(',').map(icon => '#' + icon)
  }
</script>

<svg
  stroke-linejoin="round"
  stroke-linecap="round"
  viewBox="0 0 30 30"
  fill="none"
  stroke="currentColor"
  class={$$props.class || ''}
  class:text-rain={colorClass === 'rain'}
  class:text-sun={colorClass === 'sun'}
>
  {#each iconData as href}
    <use {href} />
  {/each}
</svg>
