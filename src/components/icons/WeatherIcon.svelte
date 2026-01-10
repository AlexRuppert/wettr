<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { getStrokeFill, getWeatherIconClass } from '@/logic/utils'
  import type { WeatherIconType } from '@/logic/weatherTypes'

  interface Props extends CustomElement {
    icon: WeatherIconType
    standalone?: boolean
    strokeWidth?: number
  }
  let {
    icon,
    standalone = false,
    strokeWidth = 1,
    class: className,
    ...other
  }: Props = $props()

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
  let colorClass = $derived(getWeatherIconClass(icon))
  let iconData = $derived(iconLookup[icon].split(',').map(icon => '#' + icon))
</script>

{#snippet iconBody()}
  <g
    class={[
      {
        'stroke-rain': colorClass === 'rain',
        'stroke-sun': colorClass === 'sun',
      },
    ]}
    {...getStrokeFill(true)}
  >
    {#each iconData as href}
      <use {href} />
    {/each}
  </g>
{/snippet}

{#if standalone}
  {@render iconBody()}
{:else}
  <svg
    stroke-linejoin="round"
    stroke-linecap="round"
    viewBox="0 0 30 30"
    stroke-width={strokeWidth}
    class={[className]}
    {...other}
  >
    {@render iconBody()}
  </svg>
{/if}
