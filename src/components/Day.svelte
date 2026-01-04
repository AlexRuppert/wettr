<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import CustomDigits from './icons/CustomDigits.svelte'
  import {
    type WeatherIconType,
    type DayWeatherData,
  } from '@/logic/weatherTypes'
  import {
    chunk,
    clamp,
    getGermanDate,
    getGermanHour,
    getWeatherIconClass,
    minThreshold,
  } from '@/logic/utils'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import { getMostRelevantIcon } from '@/logic/weather'
  import { onDestroy, untrack } from 'svelte'
  import MoonPhase from './icons/MoonPhase.svelte'

  interface Props extends CustomElement {
    weather: DayWeatherData
  }
  let { weather, class: className, ...other }: Props = $props()

  let mergedHours: any[] = $state([])
  let now = $state(new Date())
  let currentHour = $derived(getGermanHour(now))
  let isToday = $derived(
    getGermanDate(weather?.dayGraph?.[0]?.timestamp) === getGermanDate(now),
  )

  let formattedDay = $derived.by(() => {
    const formatted = new Intl.DateTimeFormat('de-DE', {
      day: 'numeric',
      weekday: 'short',
    }).formatToParts(weather.day)

    return {
      day: formatted.find(f => f.type === 'day').value,
      weekday: formatted
        .find(f => f.type === 'weekday')
        .value.replace(/\./g, ''),
      isWeekend: (weather?.day?.getDay() ?? 1) % 6 === 0,
    }
  })

  function getTemperature(
    first: { temperature: number },
    second: { temperature: number },
    minTemp: number,
    maxTemp: number,
  ) {
    const isFirstMin = first.temperature === minTemp
    const isFirstMax = first.temperature === maxTemp
    const isSecondMin = second.temperature === minTemp
    const isSecondMax = second.temperature === maxTemp
    if (isFirstMin || isSecondMin)
      return Math.min(first.temperature, second.temperature)
    if (isFirstMax || isSecondMax)
      return Math.max(first.temperature, second.temperature)

    return Math.max(first.temperature, second.temperature) > 30
      ? Math.max(first.temperature, second.temperature)
      : Math.min(first.temperature, second.temperature)
  }

  function updateData(weather: DayWeatherData) {
    if (!weather?.dayGraph) {
      return
    }
    const hourData = weather.dayGraph.map(
      ({
        timestamp,
        temperature,
        sunninessFraction,
        temperatureFraction,
        precipitationFraction,
        windGust,
        icon,
        iconClass,
      }) => {
        const hour = getGermanHour(timestamp)
        return {
          hour,
          icon,
          temperature,
          sunninessFraction,
          precipitationFraction,
          temperatureFraction,
          windGust,
        }
      },
    )

    let streakData = chunk(hourData, 2).map(([first, second]) => {
      const icon = getMostRelevantIcon([first.icon, second.icon])

      const temperature = getTemperature(
        first,
        second,
        weather.min.temperature,
        weather.max.temperature,
      )
      const isLowestTemperature = temperature == weather.min.temperature
      const isHighestTemperature = temperature == weather.max.temperature

      const sunninessFraction =
        (first.sunninessFraction + second.sunninessFraction) / 2
      const temperatureFraction = clamp(
        (first.temperatureFraction + second.temperatureFraction) / 2,
        0.1,
        0.9,
      )
      const windGust = Math.max(first.windGust, second.windGust)
      const isWindy = windGust >= 30
      return {
        hour: first.hour,
        temperature,
        sunninessFraction: minThreshold(0.09, sunninessFraction),
        precipitationFraction: minThreshold(
          0.02,
          (first.precipitationFraction + second.precipitationFraction) / 2,
        ),
        temperatureFraction,
        windGust,
        isWindy,
        isLowestTemperature,
        isHighestTemperature,
        icon,
        iconClass: getWeatherIconClass(icon),
        sameTemperatureStreak: 0,
        sameIconStreak: 0,
      }
    })
    streakData.forEach((item, i) => {
      if (i <= 0) return

      const lastItem = streakData[i - 1]

      if (item.temperature == lastItem.temperature) {
        item.sameTemperatureStreak = lastItem.sameTemperatureStreak + 1
      }

      if (item.icon == lastItem.icon) {
        item.sameIconStreak = lastItem.sameIconStreak + 1
      }
    })

    mergedHours = streakData
  }
  let nowInterval = setInterval(() => updateNow(), 1 * 1000)
  onDestroy(() => {
    try {
      clearInterval(nowInterval)
    } catch (error) {}
  })
  function updateNow() {
    now = new Date()
  }

  function isCurrentHour(hour: number): boolean {
    return isToday && (+hour === currentHour || +hour + 1 === currentHour)
  }
  $effect(() => {
    if (weather) {
      updateData(weather)
    }
  })
</script>

{#snippet temperatureValue(
  temperature: number,
  isLowestTemperature: boolean,
  isHighestTemperature: boolean,
)}
  <div
    class={[
      'celsius inline-block h-5',
      { negative: temperature < 0 },
      {
        'translate-y-0.5 scale-80 underline decoration-1': isLowestTemperature,
        'dark:drop-shadow-highlight/80 drop-shadow-warning/40 drop-shadow-glow -translate-y-1 scale-130':
          isHighestTemperature,
      },
    ]}
  >
    {Math.abs(temperature)}
  </div>
{/snippet}

<div
  class="bg-surface-500 flex h-full w-1/13 flex-col items-center justify-center gap-1 overflow-hidden rounded-md shadow-md ring-inset"
>
  <div>{formattedDay?.day}</div>
  <div class="text-sm" class:text-highlight={formattedDay?.isWeekend}>
    {formattedDay?.weekday}
  </div>
  <MoonPhase
    class="text-text-soft absolute bottom-1 size-2"
    timestamp={weather.day}
  />
</div>
{#each mergedHours as data, h (data)}
  <div
    class={[
      'divide-surface-100/30 flex h-full w-1/13 flex-col items-center divide-y rounded-md shadow-md dark:divide-gray-950',
      {
        ' drop-shadow-glow drop-shadow-highlight z-1 scale-110': isCurrentHour(
          data.hour,
        ),
      },
    ]}
  >
    <div
      class={[
        'bg-surface-500 relative flex w-full grow flex-col overflow-hidden rounded-t-md',
      ]}
    >
      <div
        class={[
          'dark:bg-sun/15 bg-sun/20 ring-sun/20 ring-offset-sun/30 absolute top-0 flex w-full items-start justify-center rounded-b-sm ring-1 ring-offset-1',
          {
            'ring-0! ring-offset-0!':
              data.sunninessFraction > 0.95 || data.sunninessFraction < 0.05,
            'rounded-none!': data.sunninessFraction > 0.95,
          },
        ]}
        style:height={data.sunninessFraction * 100 + '%'}
      >
        <WeatherIcon
          icon={'clear-day'}
          class={[
            'w-5 -translate-y-1/2 opacity-40 dark:opacity-20 ',
            {
              'opacity-0!': data.sunninessFraction < 0.15,
            },
          ]}
        ></WeatherIcon>
      </div>
      <div
        class={[' absolute bottom-0 flex w-full justify-end']}
        style:height={data.temperatureFraction * 100 + '%'}
      >
        <div
          class="dark:border-sun dark:ring-rain border-text-hard ring-text-hard -mt-px mr-px size-1.5 rounded-full border opacity-60 ring-1 ring-inset"
        ></div>
      </div>
      <div
        class={[
          'absolute top-1/2 flex h-5 w-full justify-center self-center',
          { hidden: !data.isWindy },
        ]}
      >
        <WeatherIcon
          icon={'wind'}
          class={[
            'text-text-soft w-5 -translate-y-1/2',
            {
              'text-warning/70! scale-120': data.windGust >= 40,
            },
          ]}
        ></WeatherIcon>
      </div>
      <div
        class="bg-rain/50 border-rain absolute bottom-0 w-full rounded-t-sm"
        style:height={data.precipitationFraction * 100 + '%'}
      ></div>
    </div>
    <div
      class={[
        'bg-surface-500 relative flex h-1/2 w-full flex-col items-center  gap-0.5 rounded-b-md pt-1 pb-0.5 ring-inset',
      ]}
    >
      {#if data.sameTemperatureStreak > 0 && data.sameTemperatureStreak != 5 && !isCurrentHour(data.hour)}
        <div
          class={[
            'h-5 tracking-widest opacity-40',
            { 'text-rain': data.temperature < 0 },
          ]}
        >
          <sup>•</sup>
        </div>
      {:else}
        {@render temperatureValue(
          data.temperature,
          data.isLowestTemperature,
          data.isHighestTemperature,
        )}
      {/if}
      {#if data.sameIconStreak > 0 && data.sameIconStreak != 5 && !isCurrentHour(data.hour)}
        <div
          class={[
            'h-5 tracking-widest opacity-40',
            'text-' + getWeatherIconClass(data.icon),
          ]}
        >
          <sup>•</sup>
        </div>
      {:else}
        <WeatherIcon icon={data.icon} class="w-5"></WeatherIcon>
      {/if}

      <CustomDigits
        number={data.hour}
        class={{
          'text-rain': data.iconClass === 'rain',
          'text-sun': data.iconClass === 'sun',
        }}
      ></CustomDigits>
    </div>
  </div>
{/each}
