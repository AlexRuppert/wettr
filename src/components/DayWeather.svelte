<script lang="ts">
  import DayChart from '@/components/DayChart.svelte'
  import { FORECAST_DAYS } from '@/logic/reloader'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { weatherData } from '@/stores/store.svelte'
  import { fade } from 'svelte/transition'
  import MoonPhase from './icons/MoonPhase.svelte'
  import debounce from 'lodash-debounce-tiny'
  import { cn } from '@/logic/utils'

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
<div class="grid gap-1 select-none">
  {#if weather?.length > 0}
    {#key lastWindowWidth}
      {#each weather as day, i (day)}
        <div
          transition:fade={{ duration: 200 }}
          class="bg-surface-500 relative flex h-32 overflow-hidden rounded-md shadow-md"
        >
          <div
            class={[
              'border-surface-300 absolute top-0 left-0 z-10 flex h-8 w-12 items-center rounded-br-md border-r border-b tracking-tighter shadow-xs backdrop-blur-[3px]',
              {
                'bg-highlight/20': formattedDay[i].isWeekend,
              },
            ]}
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
            <div class="absolute right-1 bottom-[32px] z-10 size-2 opacity-50">
              <MoonPhase timestamp={day.day} />
            </div>
          </div>
        </div>
      {/each}
    {/key}
  {:else}
    {#each dummySkeletonDays as day, i}
      <div
        class="skeleton bg-surface-500 h-32 w-full overflow-hidden rounded-md shadow-md"
      ></div>
    {/each}
  {/if}
</div>

<style>
</style>
