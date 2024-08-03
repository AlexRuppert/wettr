<script lang="ts">
  import DayChart from '@/components/DayChart.svelte'
  import WeatherIcon from '@/components/icons/WeatherIcon.svelte'
  import { FORECAST_DAYS } from '@/logic/reloader'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { weatherData } from '@/stores/store.svelte'
  import { fade } from 'svelte/transition'
  import MoonPhase from './icons/MoonPhase.svelte'

  let weather: DayWeatherData[] = $derived(weatherData.value)
  let dummySkeletonDays = new Array(FORECAST_DAYS + 1)
  let formattedDay = $derived(
    weather.map(w => {
      const formatted = new Intl.DateTimeFormat('de-DE', {
        day: 'numeric',
        weekday: 'short',
      }).formatToParts(w.day)

      return {
        day: formatted.find(f => f.type === 'day').value,
        weekday: formatted
          .find(f => f.type === 'weekday')
          .value.replace(/\./g, ''),
        isWeekend: w.day.getDay() % 6 === 0,
      }
    }),
  )
</script>

<div class="grid select-none gap-1 tabular-nums">
  {#if weather?.length > 0}
    {#each weather as day, i (day)}
      <div
        transition:fade={{ duration: 200 }}
        class="relative flex h-32 overflow-hidden rounded-default bg-surface-500 shadow-md"
      >
        <div
          class="border-surface-50 absolute left-0 top-0 z-10 flex h-8 w-12 items-center rounded-br-md border-b border-r bg-surface-500 tracking-tighter shadow-md dark:border-surface-300"
          class:!border-highlight={formattedDay[i].isWeekend}
        >
          <div class="flex items-end">
            <div class="w-7 text-center text-xl">
              {formattedDay[i].day}
            </div>
            <div class="flex pb-0.5 text-start text-xs">
              {formattedDay[i].weekday}
            </div>
          </div>
        </div>
        <div class="relative grow overflow-hidden">
          <DayChart weather={day} />
          <div class="absolute bottom-[32px] right-1 z-10 size-2">
            <MoonPhase timestamp={day.day} />
          </div>
        </div>
      </div>
    {/each}
  {:else}
    {#each dummySkeletonDays as day, i}
      <div
        class="skeleton h-32 w-full overflow-hidden rounded-default bg-surface-500 shadow-md"
      ></div>
    {/each}
  {/if}
</div>

<style>
</style>
