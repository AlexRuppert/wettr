<svelte:options immutable />

<script lang="ts">
  import { darkMode } from '../stores/store'
  import { COLORS } from '../logic/utils'
  import { getPathData } from '../logic/chart/path'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  export let weather

  let hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
  let minHour = hours[0]
  let maxHour = hours[hours.length - 1]
  let hoursTotal = maxHour - minHour + 1

  let hourWidth
  let width
  let height
  let svg: SVGSVGElement

  let dayLengthsX = [0, 100]
  let nowLineX = -5

  let temperatureLabelPoints = []
  let sunninessPath = ''
  let temperaturePath = ''
  let precipitationPath = ''

  let dayString = weather.day.toISOString().slice(0, 10)

  const clipPercent = tweened(0, {
    duration: 500,
    easing: cubicOut,
  })

  const updateColors = darkMode => {
    if (darkMode) {
      return {
        dataLabelBackgroundColor: '#222222' + '70',
        pointBackgroundColor: '#222',
        currentTime: '#f66',
        tick: COLORS.foreground.dark + 'f0',
        night: '#000000' + '32',
        temperature: COLORS.foreground.dark,
        precipitation: COLORS.rain.dark,
        sunniness: COLORS.sun.dark,
      }
    } else {
      return {
        dataLabelBackgroundColor: '#ffffff' + 'a0',
        pointBackgroundColor: '#fff',
        currentTime: '#a00',
        tick: COLORS.foreground.light + 'c0',
        night: '#444464' + '10',
        temperature: COLORS.foreground.light,
        precipitation: COLORS.rain.light,
        sunniness: COLORS.sun.light,
      }
    }
  }

  let colors = updateColors($darkMode)
  const PADDING = 5
  darkMode.subscribe(async value => {
    colors = updateColors(value)
  })

  function dateToHoursFraction(day: Date, date: Date) {
    if (date.getTime() > day.getTime() && day.getDate() !== date.getDate()) {
      return 24
    }
    return (date.getHours() * 60 + date.getMinutes()) / 60
  }
  function getX(hour) {
    const padding = hourWidth * 24 * 0.02
    return padding + hourWidth * (hour - minHour) * 0.96
  }

  function getY(value) {
    return Math.max(
      PADDING,
      Math.min((1 - value) * height, height - PADDING / 2)
    )
  }

  function getGraphY(value) {
    return value < 0.01 ? height : getY(value)
  }

  function isCurrentValueDifferent(index, points) {
    const value = points[index].y
    const valuePrevious = points[index - 1]?.y ?? undefined
    return value !== valuePrevious
  }

  function getTotalTemperature(weather, value) {
    const l = weather.min.temperature
    const r = weather.max.temperature
    return l + value * (r - l)
  }
  $: {
    if (svg) {
      const rect = svg.getBoundingClientRect()
      width = rect.width
      height = rect.height - 13

      hourWidth = width / (hoursTotal - 1)
    }
  }
  const XSHIFT = 10
  function extendPoints(points) {
    const first = { x: 0, y: points[0].y }
    let shiftedPoints = points.map(({ x, y }) => ({ x: x + XSHIFT, y }))
    const last = {
      x: points[points.length - 1].x + 50,
      y: points[points.length - 1].y,
    }
    return [first, ...shiftedPoints, last]
  }
  $: {
    if (weather && hourWidth) {
      clipPercent.set(0, { duration: 0 })
      const { sunrise, sunset } = weather.dayLight

      dayLengthsX = [sunrise, sunset].map(t =>
        getX(dateToHoursFraction(weather.day, t))
      )

      const now = new Date()
      const today =
        new Date(weather.dayGraph[0].timestamp) < now &&
        new Date(weather.dayGraph[weather.dayGraph.length - 1].timestamp) > now

      if (today) {
        nowLineX = getX(dateToHoursFraction(weather.day, now))
      }

      const sunninessPoints = weather.dayGraph.map(d => ({
        x: getX(dateToHoursFraction(weather.day, new Date(d.timestamp))),
        y: getGraphY(d.sunninessPercent),
      }))
      const precipitationPoints = weather.dayGraph.map(d => ({
        x: getX(dateToHoursFraction(weather.day, new Date(d.timestamp))),
        y: getGraphY(d.precipitationPercent),
      }))
      const temperaturePoints = weather.dayGraph
        .map(d => {
          const date = new Date(d.timestamp)
          return {
            x: getX(dateToHoursFraction(weather.day, date)),
            y: getGraphY(d.temperaturePercent),
            flipY: d.temperaturePercent < 0.2,
            temperature: getTotalTemperature(weather, d.temperaturePercent),
            hour: date.getHours(),
          }
        })
        .filter(
          ({ hour, temperature }) =>
            temperature >= weather.max.temperature ||
            temperature <= weather.min.temperature ||
            hour % 2 === 0
        )

      temperatureLabelPoints = temperaturePoints.filter((point, i, points) =>
        isCurrentValueDifferent(i, points)
      )
      sunninessPath = getPathData(
        extendPoints(sunninessPoints),
        height,
        PADDING / 2
      )
      temperaturePath = getPathData(
        extendPoints(temperaturePoints),
        height,
        PADDING / 2
      )
      precipitationPath = getPathData(
        extendPoints(precipitationPoints),
        height,
        PADDING / 2
      )

      clipPercent.set(100)
    }
  }
</script>

<svg
  width="100%"
  height="100%"
  bind:this={svg}
  fill="none"
  stroke="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#if weather && hourWidth}
    <defs>
      <clipPath id="cut-off-bottom">
        <rect x="0" y="0" width="120%" height={height - 1} />
      </clipPath>
      <clipPath id="swipe-in">
        <rect x="0" y="0" width={$clipPercent + '%'} height="100%" />
      </clipPath>
    </defs>

    <g fill={colors.night}>
      <path
        d={`M${getX(minHour) - 10},${height - 1}v${15 - 1} h${
          dayLengthsX[0] - getX(minHour)
        }v-${15 - 1}z`}
      />

      <path
        d={`M${dayLengthsX[1] + 5},${height - 1}v${15 - 1} h${
          getX(maxHour) - dayLengthsX[1] + 2
        } v-${15 - 1}z`}
      />
    </g>
    <g
      stroke-width="0"
      fill={colors.tick}
      text-anchor="middle"
      font-size="10"
      font-weight="400"
    >
      {#each hours as hour, i}
        <text x={getX(hour)} y="96%">
          {hour.toString().replace('0', '').replace('24', '0')}</text
        >
      {/each}
    </g>
    <g clip-path="url(#swipe-in)">
      <g clip-path="url(#cut-off-bottom)" transform={`translate(-${XSHIFT} 0)`}>
        <clipPath id={`precipitation-clip-${dayString}`}>
          <path d={precipitationPath + 'V0H0V100z'} />
        </clipPath>
        <path
          clip-path={`url(#precipitation-clip-${dayString})`}
          fill={colors.sunniness + '10'}
          d={sunninessPath + `V${height + 1}H${getX(0)}z`}
        />
        <path
          clip-path={`url(#precipitation-clip-${dayString})`}
          stroke={colors.sunniness}
          d={sunninessPath}
        />
        <path
          fill={colors.precipitation + '20'}
          d={precipitationPath + `V${height + 1}H${getX(0)}z`}
        />
        <path
          stroke={colors.precipitation}
          stroke-dasharray="4, 5"
          d={precipitationPath}
        />
        <path stroke={colors.temperature + '50'} d={temperaturePath} />
      </g>

      <g font-size="10" font-weight="400" text-anchor="middle">
        {#each temperatureLabelPoints as point, i}
          <circle
            stroke={colors.temperature}
            stroke-width="0.7"
            cx={point.x}
            cy={Math.min(point.y, height - 2)}
            r="1.2"
            fill={colors.pointBackgroundColor}
          />
          <g
            transform={`translate(${point.x + (i === 0 ? 5 : -7)} ${
              point.y + (point.flipY ? -3 : 8)
            })`}
          >
            <text
              fill={colors.dataLabelBackgroundColor}
              stroke={colors.dataLabelBackgroundColor}
              stroke-width="3"
              >{point.temperature}
            </text>
            <text fill={colors.temperature}>{point.temperature} </text>
          </g>
        {/each}
      </g>
      {#if nowLineX > 0}
        <line
          x1={nowLineX}
          x2={nowLineX}
          y2={height}
          stroke={colors.currentTime}
          stroke-width="0.5"
        />
      {/if}
    </g>
  {/if}
</svg>

<style global>
</style>
