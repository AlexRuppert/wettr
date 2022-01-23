<svelte:options immutable />

<script lang="ts">
  import { darkMode } from '../stores/store'
  import { COLORS } from '../logic/utils'
  import { getPathData } from '../logic/chart/path'

  export let weather

  let hours = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
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

  const updateColors = darkMode => {
    if (darkMode) {
      return {
        dataLabelBackgroundColor: '#222222' + '40',
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

  function dateToHoursFraction(date: Date) {
    return (date.getHours() * 60 + date.getMinutes()) / 60
  }
  function getX(hour) {
    return hourWidth * (hour - minHour) + hourWidth / 2
  }

  function getY(value) {
    return Math.max(
      PADDING,
      Math.min((1 - value) * height, height - PADDING / 2)
    )
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

      hourWidth = width / hoursTotal
    }
  }

  $: {
    if (weather && hourWidth) {
      const { sunrise, sunset } = weather.dayLight
      dayLengthsX = [sunrise, sunset].map(t => getX(dateToHoursFraction(t)))

      const now = new Date()
      const today =
        new Date(weather.dayGraph[0].timestamp) < now &&
        new Date(weather.dayGraph[weather.dayGraph.length - 1].timestamp) > now

      if (today) {
        nowLineX = getX(dateToHoursFraction(now))
      }

      const sunninessPoints = weather.dayGraph.map(d => ({
        x: getX(dateToHoursFraction(new Date(d.timestamp))),
        y: getY(d.sunniness),
      }))
      const precipitationPoints = weather.dayGraph.map(d => ({
        x: getX(dateToHoursFraction(new Date(d.timestamp))),
        y: d.precipitation < 0.02 ? height : getY(d.precipitation),
      }))
      const temperaturePoints = weather.dayGraph
        .map(d => {
          const date = new Date(d.timestamp)
          return {
            x: getX(dateToHoursFraction(date)),
            y: getY(d.temperature),
            flipY: d.temperature < 0.2,
            temperature: getTotalTemperature(weather, d.temperature),
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
      sunninessPath = getPathData(sunninessPoints, height, PADDING / 2)
      temperaturePath = getPathData(temperaturePoints, height, PADDING / 2)
      precipitationPath = getPathData(precipitationPoints, height, PADDING / 2)
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
        <rect x="0" y={0} width="100%" height={height - 1} />
      </clipPath>
    </defs>
    <g fill={colors.night}>
      <path
        d={`M${getX(minHour)},${height - 1}a5 5 0 1 0 0 ${14}h${
          dayLengthsX[0] - getX(minHour)
        }v-${14}z`}
      />

      <path
        d={`M${dayLengthsX[1]},${height - 1}v${14}h${
          getX(maxHour) - dayLengthsX[1] + 2
        }a-5 5 0 1 0 0 -${14}z`}
      />
    </g>
    <g
      stroke-width="0"
      fill={colors.tick}
      text-anchor="middle"
      font-size="12"
      font-weight="300"
    >
      {#each hours as hour, i}
        <text x={getX(hour)} y="96%"> {hour}</text>
      {/each}
    </g>

    <path
      fill={colors.sunniness + '10'}
      d={sunninessPath + `V${height + 1}H${getX(4)}z`}
      clip-path="url(#cut-off-bottom)"
    />
    <path
      stroke={colors.sunniness}
      d={sunninessPath}
      clip-path="url(#cut-off-bottom)"
    />
    <path
      fill={colors.precipitation + '20'}
      d={precipitationPath + `V${height + 1}H${getX(4)}z`}
      clip-path="url(#cut-off-bottom)"
    />
    <path
      stroke={colors.precipitation}
      stroke-dasharray="4, 5"
      d={precipitationPath}
      clip-path="url(#cut-off-bottom)"
    />

    <path
      stroke={colors.temperature}
      stroke-dasharray=".1, 2.5"
      d={temperaturePath}
    />
    <g font-size="10" font-weight="400" text-anchor="middle">
      {#each temperatureLabelPoints as point, i}
        <circle
          stroke={colors.temperature}
          stroke-width="0.7"
          cx={point.x}
          cy={point.y}
          r="1.2"
          fill={colors.pointBackgroundColor}
        />
        <g
          transform={`translate(${point.x + (i === 0 ? 2 : -7)} ${
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
  {/if}
</svg>