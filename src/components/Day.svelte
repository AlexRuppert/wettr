<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import {
    chunk,
    clamp,
    getGermanDate,
    getGermanHour,
    getGermanTimeString,
    getWeatherIconClass,
    minThreshold,
  } from '@/logic/utils'
  import { getMostRelevantIcon } from '@/logic/weather'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { onDestroy } from 'svelte'
  import CustomDigits from './icons/CustomDigits.svelte'
  import MoonPhase from './icons/MoonPhase.svelte'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import Button from './common/Button.svelte'
  import SvgCorner from './icons/SvgCorner.svelte'
  import { slide } from 'svelte/transition'

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

  let infoOverlayOpened = $state(false)

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
        0.95,
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

  function clickOutside(node: HTMLDivElement) {
    // the node has been mounted in the DOM
    const delayTimer = setTimeout(
      () => window.addEventListener('click', handleClick),
      50,
    )

    function handleClick(e) {
      if (!node.contains(e.target)) {
        node.dispatchEvent(new CustomEvent('outsideclick'))
      }
    }

    return {
      destroy() {
        clearInterval(delayTimer)
        // the node has been removed from the DOM
        window.removeEventListener('click', handleClick)
      },
    }
  }
</script>

{#snippet temperatureValue(
  temperature: number,
  isLowestTemperature: boolean,
  isHighestTemperature: boolean,
)}
  <div
    class={[
      'celsius inline-block h-5 font-light',
      { negative: temperature < 0 },
      { 'is-lowest': isLowestTemperature },
      { 'is-highest': isHighestTemperature },
      {
        '-translate-y-0.5 text-lg font-medium!':
          isLowestTemperature || isHighestTemperature,
      },
    ]}
  >
    {Math.abs(temperature)}
  </div>
{/snippet}

<Button
  class={[
    'bg-surface-500 relative flex h-full w-1/13 flex-col items-center justify-center gap-1 overflow-hidden rounded-md shadow-md ring-inset',
  ]}
  onclick={() => (infoOverlayOpened = !infoOverlayOpened)}
>
  <SvgCorner></SvgCorner>
  <div>{formattedDay?.day}</div>
  <div class="text-sm" class:text-highlight={formattedDay?.isWeekend}>
    {formattedDay?.weekday}
  </div>
</Button>
{#if infoOverlayOpened && weather?.dayLight}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    transition:slide={{ axis: 'x', duration: 150 }}
    class="bg-surface-400 absolute left-1/13 z-2 h-full w-8/13 rounded-md text-sm shadow-lg"
    onclick={() => (infoOverlayOpened = false)}
    use:clickOutside
    onoutsideclick={() => (infoOverlayOpened = false)}
  >
    <div class="flex size-full place-content-center place-items-center">
      <table class="">
        <tbody>
          <tr>
            <td class="text-text-soft pr-2 text-right">Sonnenaufgang</td>
            <td>⇡ {getGermanTimeString(weather.dayLight.sunrise)} </td>
          </tr>
          <tr>
            <td class="text-text-soft pr-2 text-right">Sonnenuntergang</td>
            <td>⇣ {getGermanTimeString(weather.dayLight.sunset)} </td>
          </tr>
          <tr>
            <td class="text-text-soft pr-2 text-right">Mondphase</td>
            <td
              ><MoonPhase
                class="text-text-soft -mb-1 size-4"
                timestamp={weather.day}
              /></td
            >
          </tr>
        </tbody>
      </table>
    </div>
  </div>
{/if}

{#each mergedHours as data, h}
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
          'dark:bg-sun/15 bg-sun/20 ring-sun/20 ring-offset-sun/30 absolute top-0 flex w-full items-start justify-center rounded-b-sm ring-1 ring-offset-1 transition-all',
          {
            'ring-0! ring-offset-0!':
              data.sunninessFraction > 0.95 || data.sunninessFraction < 0.05,
            'rounded-none!': data.sunninessFraction > 0.95,
          },
        ]}
        style:height={data.sunninessFraction * 100 + '%'}
        style:transition-delay={h * 10 + 'ms'}
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
        class={[
          ' ease-spring absolute bottom-0 flex w-full justify-end transition-all duration-700',
        ]}
        style:height={data.temperatureFraction * 100 + '%'}
        style:transition-delay={h * 10 + 'ms'}
      >
        <div
          class="bg-text-hard/50 ring-surface-500 z-1 mx-auto -mt-px size-1.5 rounded-full opacity-50 ring-2"
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
        class="bg-rain/50 border-rain absolute bottom-0 w-full rounded-t-sm transition-all"
        style:height={data.precipitationFraction * 100 + '%'}
        style:transition-delay={h * 10 + 'ms'}
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
        <div class="contents">
          <WeatherIcon icon={data.icon} class="w-5"></WeatherIcon>
        </div>
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
