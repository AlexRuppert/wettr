<script lang="ts">
  import DayChart from '@/components/DayChart.svelte'
  import { FORECAST_DAYS } from '@/logic/reloader'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { weatherData } from '@/stores/store.svelte'
  import { fade } from 'svelte/transition'
  import MoonPhase from './icons/MoonPhase.svelte'
  import debounce from 'lodash-debounce-tiny'

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
  let animate = $state(true)
  let lastWindowWidth = $state(window.innerWidth)
  const handleResize = debounce(ev => {
    animate = false
    lastWindowWidth = window.innerWidth
    setTimeout(() => {
      animate = true
    }, 100)
  }, 500)
</script>

<svelte:window on:resize={handleResize} />
<div class="grid select-none gap-1">
  {#if weather?.length > 0}
    {#key lastWindowWidth}
      {#each weather as day, i (day)}
        <div
          transition:fade={{ duration: 200 }}
          class="relative flex h-32 overflow-hidden rounded-default bg-surface-500 shadow-md"
        >
          <div
            class="absolute left-0 top-0 z-10 flex h-8 w-12 items-center rounded-br-md border-b border-r border-surface-50 bg-surface-500 tracking-tighter shadow-sm dark:border-surface-100"
            class:!border-highlight={formattedDay[i].isWeekend}
          >
            <div class="flex items-end tracking-tighter">
              <div class="w-7 text-center text-xl">
                {formattedDay[i].day}
              </div>
              <div class="flex self-center text-start text-xs">
                {formattedDay[i].weekday}
              </div>
            </div>
          </div>
          <div class="relative grow overflow-hidden">
            <DayChart weather={day} {animate} />
            <div class="absolute bottom-[32px] right-1 z-10 size-2 opacity-50">
              <MoonPhase timestamp={day.day} />
            </div>
          </div>
        </div>
      {/each}
    {/key}
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
