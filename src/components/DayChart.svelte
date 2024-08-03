<script lang="ts">
  import { dark, light } from '@/../themes'
  import { getPathData } from '@/logic/chart/path'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { chunk, clamp, getWeatherIconClass } from '@/logic/utils'
  import { type DayWeatherData } from '@/logic/weatherTypes'
  import { darkMode } from '@/stores/store.svelte'
  import { cubicOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import { getMostRelevantIcon } from '@/logic/weather'
  interface Props extends CustomElement {
    weather: DayWeatherData
  }

  let { weather, className = '', ...other }: Props = $props()

  type GraphPoint = {
    x: number
    y: number
  }
  type TemperatureGraphPoint = GraphPoint & {
    flipY: boolean
    temperature: number
    hour: number
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
  let nowLineX = $state(-5)

  let temperatureLabelPoints: TemperatureGraphPoint[] = $state([])

  let sunninessPath = $state('')
  let precipitationPath = $state('')
  let temperaturePath = $state('')
  let summaryBlocks = $state([])

  let windGustPoints = $state([])
  let dayString = $derived(weather.day.toISOString())

  let colors = $derived(updateColors(darkMode.value))

  const clipPercent = tweened(0, {
    duration: 300,
    delay: 0,
    easing: cubicOut,
  })
  clipPercent.set(0, { duration: 0 })

  $effect(() => {
    if (weather && svg) {
      clipPercent.set(0, { duration: 0 })
      setTimeout(() => {
        updateDimensions(svg.getBoundingClientRect())
        updateData(weather)
        clipPercent.set(1)
      }, 50)
    }
  })
  function updateColors(darkMode: boolean) {
    const theme = darkMode ? dark : light
    function hslOpacity(hsl: string, opacity = 1) {
      return hsl.replace(')', '/ ' + opacity + ')')
    }
    return {
      dataLabelBackgroundColor: hslOpacity(theme.surface[500], 0.9),
      pointBackgroundColor: hslOpacity(theme.surface[500], 1),
      currentTime: theme.warning,
      tick: hslOpacity(theme.text.soft, 0.9),
      night: hslOpacity(theme.surface[100], 1),
      temperature: theme.text.hard,
      temperatureGraph: hslOpacity(theme.text.soft, 0.8),
      precipitation: theme.rain,
      precipitationFill: hslOpacity(theme.rain, 0.2),
      sunniness: theme.sun,
      sunninessFill: hslOpacity(theme.sun, 0.1),
    }
  }
  function updateData(weather: DayWeatherData) {
    const { sunrise, sunset } = weather.dayLight

    dayLengthsX = [sunrise, sunset].map(t =>
      getX(dateToHoursFraction(weather.day, t)),
    )

    const now = new Date()
    const today = weather.dayGraph[0].timestamp.getDate() === now.getDate()

    if (today) {
      nowLineX = getX(dateToHoursFraction(weather.day, now))
    }

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
        const isExtremeTemperature =
          temperature >= weather.max.temperature ||
          temperature <= weather.min.temperature
        if (isExtremeTemperature || hour % 2 === 0)
          temperaturePoints.push({
            x,
            y: getGraphY(temperatureFraction),
            temperature,
            flipY,
            isExtremeTemperature,
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
          hour: number
          x: number
          flipY: boolean
        },
        index: number,
        points: {
          y: number
          temperature: number
          isExtremeTemperature: boolean
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

  function updateDimensions(rect: DOMRect) {
    width = rect.width
    height = rect.height - HEIGHT_TIMELINE - HEIGHT_SUMMARY_BLOCK
    totalHeight = rect.height
    hourWidth = width / hoursTotal
    pathFillCloseSuffix = `V${height + 1}H${getX(-PADDING_X)}z`
  }
  function dateToHoursFraction(day: Date, date: Date) {
    if (date.getTime() > day.getTime() && day.getDate() !== date.getDate()) {
      return 24
    }
    return date.getHours() + date.getMinutes() / 60
  }
  function getX(hour: number) {
    return PADDING_X + hourWidth * (hour - minHour) * 0.96
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

    <!--path
      stroke={colors.sunniness}
      stroke-width="2"
      stroke-linecap="round"
      d="M{dayLengthsX[0]} {totalHeight -
        PADDING_Y +
        2}l-80 {height}M{dayLengthsX[1]} {totalHeight -
        PADDING_Y +
        2}l80 {height}"
    /-->
    <path
      stroke={colors.night}
      stroke-width="3"
      stroke-linecap="round"
      d="M{0} {totalHeight - PADDING_Y + 4}L{dayLengthsX[0]} {totalHeight -
        PADDING_Y +
        4}M{dayLengthsX[1]} {totalHeight - PADDING_Y + 4}L{width} {totalHeight -
        PADDING_Y +
        4}"
    />

    {#each hours as hour, i}
      <text
        fill={colors.tick}
        x={getX(hour)}
        y={totalHeight - PADDING_Y}
        class="font-light"
      >
        {hour >= maxHour ? 0 : hour}</text
      >
    {/each}

    <foreignObject
      x="0"
      y="{height - 1}px"
      width="100%"
      height={HEIGHT_SUMMARY_BLOCK + HEIGHT_TIMELINE + 1}
    >
      <div class=" relative h-full pt-1">
        {#each summaryBlocks as block, i}
          {@const isDay =
            block.x > dayLengthsX[0] && block.x - hourWidth < dayLengthsX[1]}
          <div
            class="absolute flex h-full items-start justify-start"
            style:left="{getX(block.hours.start) - hourWidth / 2}px"
            style:width={(block.hours.end - block.hours.start) * hourWidth -
              0.5 +
              'px'}
          >
            <WeatherIcon
              icon={isDay ? block.icon : block.icon.replace('day', 'night')}
              stroke-width="1.5"
              style="width:{hourWidth * 1.6}px; margin-left:-{hourWidth /
                (2 * 1.6) -
                1}px"
            ></WeatherIcon>
          </div>
        {/each}
      </div>
    </foreignObject>

    <path
      stroke={colors.tick}
      stroke-width="3"
      stroke-linecap="butt"
      stroke-dasharray="1 {hourWidth * 2 - 2}"
      d="M{PADDING_X - 1} {height + 0.5}h{width}"
    />
    <path
      stroke={colors.tick}
      stroke-width="1"
      opacity="70%"
      stroke-linecap="butt"
      stroke-dasharray="1 {hourWidth * 2 - 2}"
      d="M{PADDING_X + hourWidth - 1} {height - 0.5}h{width - hourWidth}"
    />
    {#each windGustPoints as windGust}
      <use
        href="#wind-indicator"
        x={windGust.x + 7}
        y={totalHeight - PADDING_Y - HEIGHT_TIMELINE}
        stroke={colors.temperature}
      />
    {/each}
    <path
      class="mix-blend-darken dark:mix-blend-color-dodge"
      opacity="50%"
      d="M{nowLineX} 0v{totalHeight}"
      stroke={colors.currentTime}
      stroke-width="2"
    />

    <g
      clip-path="url(#cut-off)"
      class="origin-bottom"
      transform="scale(1 {$clipPercent})"
    >
      <path
        fill={colors.sunninessFill}
        stroke={colors.sunniness}
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
        fill={colors.precipitationFill}
        stroke={colors.precipitation}
        d={precipitationPath + pathFillCloseSuffix}
      />
      <path stroke={colors.temperatureGraph} d={temperaturePath} />

      {#each temperatureLabelPoints as point, i}
        <use
          href={'#celsius-circle'}
          x={point.x}
          y={Math.min(point.y, height - 2.7)}
          stroke={colors.temperature}
          fill={colors.pointBackgroundColor}
        />
        <g
          transform="translate({point.x +
            (i === 0
              ? -7
              : point.temperature.toString().length > 1
                ? -9
                : -6)} {point.y + (point.flipY ? -3 : 8)})"
        >
          <text stroke={colors.dataLabelBackgroundColor} stroke-width="3"
            >{point.temperature}
          </text>
          <text
            fill={point.temperature < 0
              ? colors.precipitation
              : colors.temperature}>{point.temperature}</text
          >
        </g>
      {/each}
    </g>
  {/if}
</svg>

<style>
</style>
