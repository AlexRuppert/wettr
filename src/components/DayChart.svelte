<svelte:options immutable />

<script lang="ts">
  import { darkMode } from '../stores/store'
  import { clamp } from '../logic/utils'
  import { getPathData } from '../logic/chart/path'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import type { DayWeatherDataType } from 'src/logic/weatherTypes'
  import { light, dark } from '../../themes'
  export let weather: DayWeatherDataType

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
  const hours = [...new Array(13)].map((_, i) => i * 2).slice(1)

  const hoursTotal = maxHour

  const PADDING_X = 7.5
  const PADDING_Y = 5

  let hourWidth: number
  let width: number
  let height: number
  let svg: SVGSVGElement

  let pathFillCloseSuffix

  let dayLengthsX = [0, 100]
  let nowLineX = -5

  let temperatureLabelPoints: TemperatureGraphPoint[] = []

  let sunninessPath = ''
  let precipitationPath = ''
  let temperaturePath = ''

  let windGustPoints = []
  let dayString = weather.day.toISOString()

  const clipPercent = tweened(0, {
    duration: 300,
    delay: 0,
    easing: cubicOut,
  })

  const updateColors = (darkMode: boolean) => {
    const theme = darkMode ? dark : light
    function hslOpacity(hsl: string, opacity = 1) {
      return hsl.replace(')', '/ ' + opacity + ')')
    }
    return {
      dataLabelBackgroundColor: hslOpacity(theme.surface[500], 0.5),
      pointBackgroundColor: hslOpacity(theme.surface[500], 1),
      currentTime: theme.warning,
      tick: hslOpacity(theme.text.soft, 0.9),
      night: hslOpacity(theme.surface[100], 0.1),
      temperature: theme.text.hard,
      temperatureGraph: hslOpacity(theme.text.soft, 0.5),
      precipitation: theme.rain,
      precipitationFill: hslOpacity(theme.rain, 0.2),
      sunniness: theme.sun,
      sunninessFill: hslOpacity(theme.sun, 0.1),
    }
  }

  let colors
  $: {
    colors = updateColors($darkMode)
  }
  clipPercent.set(0, { duration: 0 })
  $: {
    if (weather && svg) {
      clipPercent.set(0, { duration: 0 })
      setTimeout(() => {
        updateDimensions(svg.getBoundingClientRect())
        updateData(weather)
        clipPercent.set(1)
      }, 50)
    }
  }
  function updateData(weather: DayWeatherDataType) {
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

    weather.dayGraph.forEach(
      ({
        timestamp,
        temperature,
        sunninessPercent,
        temperaturePercent,
        precipitationPercent,
        windGust,
      }) => {
        const hourFraction = dateToHoursFraction(weather.day, timestamp)
        const x = getX(hourFraction)
        const flipY = temperaturePercent < 0.2
        const hour = timestamp.getHours()

        sunninessPoints.push({
          x,
          y: getGraphY(
            clamp((Math.tanh(4 * sunninessPercent - 2) + 0.9) / 1.8, 0, 1),
          ),
        })
        if (
          temperature >= weather.max.temperature ||
          temperature <= weather.min.temperature ||
          hour % 2 === 0
        )
          temperaturePoints.push({
            x,
            y: getGraphY(temperaturePercent),
            temperature,
            flipY,
          })
        precipitationPoints.push({ x, y: getGraphY(precipitationPercent) })

        if (windGust > 30 && hour % 2 === 0) {
          windGustPoints.push({
            x,
            y: 0,
          })
        }
      },
    )

    temperatureLabelPoints = temperaturePoints.filter((point, i, points) =>
      isCurrentValueDifferent(i, points),
    )
    ;[sunninessPath, temperaturePath, precipitationPath] = [
      sunninessPoints,
      temperaturePoints,
      precipitationPoints,
    ].map((points, i) =>
      getPathData(extendPoints(points, width), height, PADDING_Y / 2),
    )
  }

  function updateDimensions(rect: DOMRect) {
    width = rect.width
    height = rect.height - 13
    hourWidth = width / hoursTotal
    pathFillCloseSuffix = `V${height + 1}H${getX(-1)}z`
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
    return value < 0.01 ? height : getY(value)
  }

  function isCurrentValueDifferent(index: number, points: { y: number }[]) {
    const value = points[index].y
    const valuePrevious = points[index - 1]?.y ?? undefined
    return value !== valuePrevious
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
  font-size="12"
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

    <path
      fill={colors.night}
      d="M{getX(-1)} {height -
        1}v{20}H{dayLengthsX[0]}v-{20}zM{dayLengthsX[1]} {height -
        1}v{20}H{getX(maxHour + 1)}v-{20}z"
    />

    {#each hours as hour, i}
      <text fill={colors.tick} x={getX(hour)} y="97%">
        {hour >= maxHour ? 0 : hour}</text
      >
    {/each}
    {#each windGustPoints as windGust}
      <use
        href="#wind-indicator"
        x={windGust.x + 7}
        y={height - 1}
        stroke={colors.tick}
      />
    {/each}

    <g
      clip-path="url(#cut-off)"
      class="origin-bottom"
      transform="scale(1 {$clipPercent})"
    >
      <path
        clip-path="url(#precipitation-clip-{dayString})"
        fill={colors.sunninessFill}
        stroke={colors.sunniness}
        d={sunninessPath + pathFillCloseSuffix}
      />
      <path
        stroke-dasharray="4,5"
        fill={colors.precipitationFill}
        stroke={colors.precipitation}
        d={precipitationPath + pathFillCloseSuffix}
      />
      <path stroke={colors.temperatureGraph} d={temperaturePath} />

      <path
        d="M{nowLineX + 0.5} 0v8M{nowLineX + 0.5} {height}v-6"
        stroke={'#11111190'}
      />
      <path
        d="M{nowLineX} 0v7M{nowLineX} {height}v-7"
        stroke={colors.currentTime}
      />
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
              ? 9
              : point.temperature.toString().length > 1
                ? -9
                : -6)} {point.y + (point.flipY ? -3 : 8)})"
        >
          <text stroke={colors.dataLabelBackgroundColor} stroke-width="3"
            >{point.temperature}
          </text>
          <text fill={colors.temperature}>{point.temperature}</text>
        </g>
      {/each}
    </g>
  {/if}
</svg>
