<script lang="ts">
  import { FORECAST_DAYS } from '@/logic/reloader'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { weatherData } from '@/stores/store.svelte'

  import Day from './Day.svelte'
  let weatherDays: DayWeatherData[] = $derived(
    weatherData?.value?.length > 0
      ? weatherData?.value
      : new Array(FORECAST_DAYS + 1).fill(0).map((_, i) => i),
  )
</script>

<div class="grid gap-2 select-none">
  {#each weatherDays as weather, i (weather)}
    <div
      class={[
        'relative flex h-32 w-full gap-0.5 rounded-md',
        !weatherData?.value?.length ? 'skeleton bg-surface-500' : '',
      ]}
    >
      <Day {weather}></Day>
    </div>
  {/each}
</div>
