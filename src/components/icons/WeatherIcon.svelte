<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { weatherIconList } from '@/logic/weather'
  import type { WeatherIconType } from '@/logic/weatherTypes'

  interface Props extends CustomElement {
    icon: WeatherIconType
    strokeWidth?: number
  }
  let { icon, strokeWidth = 1, class: className, ...other }: Props = $props()
  let iconData = $derived(weatherIconList[icon])
</script>

<svg
  stroke-linejoin="round"
  stroke-linecap="round"
  viewBox="0 0 30 30"
  stroke-width={strokeWidth}
  stroke="currentColor"
  fill="none"
  class={[className]}
  {...other}
>
  {#each iconData.parts as { path, type }}
    <path
      d={path}
      class={[
        {
          'stroke-rain': type === 'rain',
          'stroke-sun': type === 'sun',
          'stroke-ice': type === 'ice',
        },
      ]}
    />
  {/each}
</svg>
