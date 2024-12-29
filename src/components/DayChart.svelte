<script lang="ts">
  import { getPathData } from '@/logic/chart/path'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { chunk, clamp, cn, getWeatherIconClass } from '@/logic/utils'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { darkMode } from '@/stores/store.svelte'
  import { cubicOut } from 'svelte/easing'
  import { Tween } from 'svelte/motion'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import { getMostRelevantIcon } from '@/logic/weather'
  import TimelineNumber from './icons/TimelineNumber.svelte'
  import { onDestroy, untrack } from 'svelte'
  interface Props extends CustomElement {
    weather: DayWeatherData
    animate: boolean
  }

  let { weather, animate, className = '', ...other }: Props = $props()

  type GraphPoint = {
    x: number
    y: number
  }
  type TemperatureGraphPoint = GraphPoint & {
    flipY: boolean
    temperature: number
    hour: number
    isExtremeTemperature: boolean
    isHighest: boolean
    isLowest: boolean
  }
  const [minHour, maxHour] = [0, 24]
  const hours = [...new Array(12)].map((_, i) => i * 2)
  const hoursTotal = maxHour
  const PADDING_X = 15
  const PADDING_Y = 5

  const HEIGHT_TIMELINE = 24
  const HEIGHT_SUMMARY_BLOCK = 24

  let hourWidth: number = $state(0)
  let width: number = $state(0)
  let height: number = $state(0)
  let totalHeight: number = $state(0)
  let svg: SVGSVGElement = $state(null)

  let pathFillCloseSuffix = $state('')

  let dayLengthsX = $state([0, 100])
  let now = $state(new Date())
  let isToday = $state(false)

  let temperatureLabelPoints: TemperatureGraphPoint[] = $state([])

  let sunninessPath = $state('')
  let precipitationPath = $state('')
  let temperaturePath = $state('')
  let summaryBlocks = $state([])

  let windGustPoints = $state([])
  let dayString = $derived(weather.day.toISOString())

  let nowLineX = $derived(
    isToday ? getX(now.getHours() + now.getMinutes() / 60) : -5,
  )

  const clipPercent = new Tween(0, {
    duration: 300,
    delay: 0,
    easing: cubicOut,
  })
  clipPercent.set(animate ? 0 : 1, {
    duration: 0,
  })

  $effect(() => {
    if (weather && svg) {
      clipPercent.set(untrack(() => animate) ? 0 : 1, { duration: 0 })
      setTimeout(() => {
        updateDimensions()
        updateData(weather)
        clipPercent.set(1)
      }, 50)
    }
  })

  let nowInterval = setInterval(() => updateNow(), 1 * 1000)
  onDestroy(() => {
    try {
      clearInterval(nowInterval)
    } catch (error) {}
  })

  function updateNow() {
    now = new Date()
  }

  function updateData(weather: DayWeatherData) {
    const { sunrise, sunset } = weather.dayLight

    dayLengthsX = [sunrise, sunset].map(t =>
      getX(dateToHoursFraction(weather.day, t)),
    )

    isToday = weather.dayGraph[0].timestamp.getDate() === now.getDate()

    const sunninessPoints = []
    const temperaturePoints = []
    const precipitationPoints = []
    windGustPoints = []
    let summaryIcons = []

    weather.dayGraph.forEach(
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
        const hourFraction = dateToHoursFraction(weather.day, timestamp)
        const x = getX(hourFraction)
        const flipY = temperatureFraction < 0.2
        const hour = timestamp.getHours()

        sunninessPoints.push({
          x,
          y: getGraphY(
            clamp((Math.tanh(4 * sunninessFraction - 2) + 0.9) / 1.8, 0, 1),
          ),
        })
        const isLowest = temperature <= weather.min.temperature
        const isHighest = temperature >= weather.max.temperature
        const isExtremeTemperature = isLowest || isHighest

        if (isExtremeTemperature || hour % 2 === 0)
          temperaturePoints.push({
            x,
            y: getGraphY(temperatureFraction),
            temperature,
            flipY,
            isExtremeTemperature,
            isLowest,
            isHighest,
          })
        precipitationPoints.push({ x, y: getGraphY(precipitationFraction) })

        if (windGust > 30 && hour % 2 === 0) {
          windGustPoints.push({
            x: x - 2,
            y: 0,
          })
        }

        summaryIcons.push({
          icon,
          iconClass,
          x,
          hours: {
            start: hour,
            end: hour + 1,
          },
        })
      },
    )

    temperatureLabelPoints = []
    let lastPushedTemperatureIndex = 0
    temperaturePoints.forEach(
      (
        current: {
          y: number
          temperature: number
          isExtremeTemperature: boolean
          isLowest: boolean
          isHighest: boolean
          hour: number
          x: number
          flipY: boolean
        },
        index: number,
        points: {
          y: number
          temperature: number
          isExtremeTemperature: boolean
          isLowest: boolean
          isHighest: boolean
        }[],
      ) => {
        const previous = points[index - 1] ?? current
        const next = points[index + 1] ?? null
        const lastPushedPoint = points[lastPushedTemperatureIndex] ?? previous
        const range = Math.abs(
          weather.max.temperature - weather.min.temperature,
        )
        if (
          index == 0 ||
          (current.isExtremeTemperature &&
            !lastPushedPoint.isExtremeTemperature)
        ) {
          temperatureLabelPoints.push(current)
          lastPushedTemperatureIndex = index
        } else if (
          (Math.abs(current.temperature - lastPushedPoint.temperature) >=
            Math.max(range / 4, 2) ||
            (Math.abs(current.temperature - lastPushedPoint.temperature) > 1 &&
              index - lastPushedTemperatureIndex > 4)) &&
          !next?.isExtremeTemperature
        ) {
          temperatureLabelPoints.push(current)
          lastPushedTemperatureIndex = index
        }
      },
    )
    ;[sunninessPath, temperaturePath, precipitationPath] = [
      sunninessPoints,
      temperaturePoints,
      precipitationPoints,
    ].map(points =>
      getPathData(extendPoints(points, width), height, PADDING_Y / 2),
    )

    const mergedSummaryBlocks = chunk(summaryIcons, 2).map(items => {
      const icon = getMostRelevantIcon(items.map(it => it.icon))
      const iconClass = getWeatherIconClass(icon)
      const x = items.at(0).x + (items.length - 1) * hourWidth
      return {
        icon,
        iconClass,
        x,
        hours: {
          start: items.at(0).hours.start,
          end: items.at(-1).hours.end,
        },
      }
    })
    summaryBlocks = mergedSummaryBlocks
  }

  function updateDimensions() {
    let rect = svg.getBoundingClientRect()
    width = rect.width
    height = rect.height - HEIGHT_TIMELINE - HEIGHT_SUMMARY_BLOCK
    totalHeight = rect.height
    hourWidth = (width - PADDING_X) / hoursTotal
    pathFillCloseSuffix = `V${height + 1}H${getX(-PADDING_X)}z`
  }
  function dateToHoursFraction(day: Date, date: Date) {
    if (date.getTime() > day.getTime() && day.getDate() !== date.getDate()) {
      return 24
    }
    return date.getHours() + date.getMinutes() / 60
  }
  function getX(hour: number) {
    return PADDING_X + hourWidth * (hour - minHour)
  }

  function getY(value: number) {
    return Math.max(
      PADDING_Y,
      Math.min((1 - value) * height, height - PADDING_Y / 2),
    )
  }

  function getGraphY(value: number) {
    return value < 0.01 ? height + 2 : getY(value)
  }

  function extendPoints(points: GraphPoint[], width: number) {
    return [
      { x: 0, y: points[0].y },
      ...points,
      {
        x: width + 10,
        y: points[points.length - 1].y,
      },
    ]
  }
</script>

<svg
  width="100%"
  height="100%"
  stroke-linecap="round"
  stroke-linejoin="round"
  fill="none"
  bind:this={svg}
  font-size="1rem"
  font-weight="400"
  text-anchor="middle"
>
  {#if weather && hourWidth}
    <defs>
      <clipPath id="cut-off">
        <rect width={'100%'} height={height - 1} />
      </clipPath>
      <clipPath id="precipitation-clip-{dayString}">
        <path d={precipitationPath + 'V0H0V100z'} />
      </clipPath>
    </defs>
    <g class="stroke-surface-50" stroke-width="3" stroke-linecap="round">
      {#if darkMode.value}
        <path
          d="M{dayLengthsX[0] + 1} {totalHeight -
            PADDING_Y +
            4}H{dayLengthsX[1] - 1}"
        />
      {:else}
        <path
          d="M{0} {totalHeight -
            PADDING_Y +
            4}H{dayLengthsX[0]}M{dayLengthsX[1]} {totalHeight -
            PADDING_Y +
            4}H{width}"
        />per
      {/if}
    </g>

    {#each hours as hour, i}
      <TimelineNumber
        x={getX(hour)}
        y={totalHeight - PADDING_Y - 16}
        number={hour}
        class={'text-' + summaryBlocks[i].iconClass}
      ></TimelineNumber>
    {/each}

    {#each summaryBlocks as block, i}
      {@const isDay =
        block.x > dayLengthsX[0] && block.x - hourWidth < dayLengthsX[1]}
      {@const scale = 0.65}
      <WeatherIcon
        icon={isDay ? block.icon : block.icon.replace('day', 'night')}
        stroke-width="1"
        standalone
        transform={{
          x: getX(i * 2) - PADDING_X * scale,
          y: totalHeight - PADDING_Y - 39,
          s: scale,
        }}
      ></WeatherIcon>
    {/each}

    <path
      class="stroke-text-soft/90"
      stroke-width="4"
      stroke-linecap="butt"
      stroke-dasharray="1 {2 * ((width - 4) / hoursTotal) - 2}"
      d="M{PADDING_X} {height + 0.5}h{width - 2 * hourWidth}"
    />
    <path
      class="stroke-text-soft/90"
      stroke-width="2"
      opacity="70%"
      stroke-linecap="butt"
      stroke-dasharray="1 {2 * ((width - 2) / hoursTotal) - 2}"
      d="M{PADDING_X + hourWidth - 1} {height - 0.5}h{width - hourWidth}"
    />
    {#each windGustPoints as windGust}
      <use
        href="#wind-indicator"
        x={windGust.x + 10}
        y={totalHeight - PADDING_Y - 18}
        class="stroke-text-hard/90"
      />
    {/each}
    <path
      class="stroke-highlight mix-blend-darken dark:mix-blend-lighten"
      d="M{nowLineX} 0v{totalHeight}"
      stroke-width="1"
    />

    <g
      clip-path="url(#cut-off)"
      class="origin-bottom"
      transform="scale(1 {clipPercent.current})"
    >
      <path
        class="fill-sun/10 stroke-sun"
        stroke-dasharray="1 3"
        stroke-width="2"
        stroke-linecap="butt"
        stroke-linejoin="round"
        d={sunninessPath + pathFillCloseSuffix}
        transform-origin="50% 50%"
        transform="translate(0, -{HEIGHT_TIMELINE +
          HEIGHT_SUMMARY_BLOCK +
          1}) scale(1, -1)"
      />
      <path
        stroke-dasharray="4,5"
        class="fill-rain/20 stroke-rain"
        d={precipitationPath + pathFillCloseSuffix}
      />
      <path stroke-width="1" class="stroke-text-soft/80" d={temperaturePath} />

      {#each temperatureLabelPoints as point, i}
        <use
          href={'#celsius-circle'}
          x={point.x + 2}
          y={Math.min(point.y, height - 2.7)}
          class="fill-surface-500 stroke-text-hard"
        />
        <g
          font-size={point.isExtremeTemperature ? '1.7em' : '0.9em'}
          fill-opacity={point.isExtremeTemperature ? '1' : '0.8'}
          transform="translate({point.x +
            (i === 0
              ? -7
              : point.temperature.toString().length > 1
                ? -9
                : -6)} {point.y +
            (point.flipY ? -3 : 8) +
            (point.isHighest ? 10 : 0) +
            (point.isLowest ? -2 : 0)})"
        >
          <text class="stroke-surface-500/90" stroke-width="3"
            >{point.temperature}
          </text>
          <text class={[point.temperature < 0 ? 'fill-rain' : 'fill-text-hard']}
            >{point.temperature}</text
          >
        </g>
      {/each}
    </g>
  {/if}
</svg>

<style>
</style>
