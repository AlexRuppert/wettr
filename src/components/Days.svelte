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

<div class="grid gap-1.5 select-none">
  {#each weatherDays as weather, i}
    <Day {weather}></Day>
  {/each}
</div>
