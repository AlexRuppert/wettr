<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn, getWeatherIconClass } from '@/logic/utils'
  import type { WeatherIconType } from '@/logic/weatherTypes'

  interface Props extends CustomElement {
    icon: WeatherIconType
    standalone?: boolean
    transform?: { x: number; y: number; s: number }
    monochrome?: boolean
    strokeWidth?: number
  }
  let {
    icon,
    monochrome = false,
    standalone = false,
    transform = { x: 0, y: 0, s: 1 },
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
    class={cn({
      'text-rain': colorClass === 'rain' && !monochrome,
      'text-sun': colorClass === 'sun' && !monochrome,
    })}
    stroke="currentColor"
    fill="none"
    stroke-linejoin="round"
    stroke-linecap="round"
    vector-effect="non-scaling-stroke"
    transform={`translate(${transform.x}, ${transform.y}) scale(${transform.s})`}
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
    viewBox="0 0 30 30"
    stroke-width={strokeWidth}
    class={cn(className)}
    {...other}
  >
    {@render iconBody()}
  </svg>
{/if}
