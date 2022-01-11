<svelte:options immutable />

<script lang="ts">
  import { onMount } from 'svelte'
  import { darkMode } from '../stores/store'
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Filler,
  } from 'chart.js'
  import annotationPlugin from 'chartjs-plugin-annotation'
  import chartDataLabels from 'chartjs-plugin-datalabels'
  import './../logic/adapterDateFormat'
  import { COLORS } from '../logic/utils'

  export let weather
  
  Chart.register(
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Filler,
    TimeScale,
    annotationPlugin,
    chartDataLabels
  )

  let canvas: HTMLCanvasElement
  let mounted = false
  let chart: Chart

  const updateColors = darkMode => {
    if (darkMode) {
      return {
        dataLabelBackgroundColor: '#000000' + '40',
        pointBackgroundColor: '#000',
        pointBorderColor: '#9ca3aa',
        currentTime: '#f66',
        bottomLine: COLORS.foreground.dark,
        tick: COLORS.foreground.dark + 'b0',
        grid: '#252525',
        night: '#000000' + '22',
        temperature: COLORS.foreground.dark,
        precipitation: COLORS.rain.dark,
        sunniness: COLORS.sun.dark,
      }
    } else {
      return {
        dataLabelBackgroundColor: '#ffffff' + 'a0',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#505050',
        currentTime: '#a00',
        bottomLine: COLORS.foreground.light,
        tick: COLORS.foreground.light + 'b0',
        grid: '#f0f0f0',
        night: '#444464' + '10',
        temperature: COLORS.foreground.light,
        precipitation: COLORS.rain.light,
        sunniness: COLORS.sun.light,
      }
    }
  }

  let colors = updateColors($darkMode)

  darkMode.subscribe(async value => {
    colors = updateColors(value)
  })

  function isCurrentValueDifferent(context) {
    const index = context.dataIndex
    const value = (context.dataset.data[index] as { y: number }).y
    const valuePrevious =
      (
        context.dataset.data[index - 1] as {
          y: number
        }
      )?.y ?? undefined
    return value !== valuePrevious
  }
  const grid = {
    display: true,
    drawBorder: false,
    drawOnChartArea: false,
    drawTicks: false,
    color: () => colors.grid,
  }

  const chartOptions = {
    layout: {
      padding: {
        top: 3,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            hour: 'HH',
          },
        },
        ticks: {
          autoSkip: true,
          autoSkipPadding: 10,
          color: () => colors.tick,
          font: {
            size: 10,
            weight: 400,
          },
        },
        grid,
      },
      y: {
        ticks: {
          display: false,
        },
        min: 0,
        grid,
      },
    },
  }

  const dayLightAnnotation = {
    type: 'box',
    yMin: 0,
    yMax: 1,
    backgroundColor: () => colors.night,
    borderColor: 'transparent',
  }
  const bottomAnnotation = {
    type: 'box',
    yMin: -0.1,
    yMax: 0,
    backgroundColor: () => colors.bottomLine,
    borderColor: () => colors.bottomLine,
    borderWidth: 2,
  }

  const currentTimeAnnotation = {
    type: 'line',
    borderColor: () => colors.currentTime,
    borderWidth: 0.5,
  }

  onMount(() => {
    mounted = true
  })
  $: {
    if (mounted && colors) {
      const annotations: {
        sunset?: any
        sunrise?: any
        current?: any
        bottom: any
      } = {
        bottom: bottomAnnotation,
      }
      const sunrise = {
        xMin: weather.dayGraph[0].timestamp,
        xMax: weather.dayLight.sunrise,
      }
      const sunset = {
        xMin: weather.dayLight.sunset,
        xMax: weather.dayGraph[weather.dayGraph.length - 1].timestamp,
      }
      ;[sunrise, sunset].forEach((sunX, i) => {
        if (new Date(sunX.xMin) < new Date(sunX.xMax))
          annotations['s' + i] = { ...dayLightAnnotation, ...sunX }
      })

      const now = new Date()
      if (now > new Date(sunrise.xMin) && now < new Date(sunset.xMax))
        annotations.current = { ...currentTimeAnnotation, xMin: now, xMax: now }

      const commonData = {
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 1,
      }

      chart?.destroy()
      chart = new Chart(canvas, {
        type: 'line',
        data: {
          datasets: [
            {
              data: weather.dayGraph
                .map(d => ({
                  x: d.timestamp,
                  y: d.temperature,
                }))
                .filter(d => new Date(d.x).getHours() % 2 === 0),
              borderColor: colors.temperature,
              ...commonData,
              borderDash: [1, 2],
              borderWidth: 1,
              pointRadius: function (context) {
                return isCurrentValueDifferent(context) ? 1.2 : 0
              },
              pointBackgroundColor: colors.pointBackgroundColor,
              pointBorderColor: colors.pointBorderColor,
              datalabels: {
                display: function (context) {
                  return isCurrentValueDifferent(context) ? 'auto' : false
                },
                align: function (context) {
                  const index = context.dataIndex
                  const value = (context.dataset.data[index] as { y: number }).y
                  if (index === 0) return 290
                  return value < 0.5 ? 210 : 150
                },
                offset: 2,
                padding: {
                  top: 0.5,
                  bottom: 0,
                  left: 2,
                  right: 2,
                },
                formatter: function (value) {
                  const l = weather.min.temperature
                  const r = weather.max.temperature
                  return l + value.y * (r - l)
                },
                backgroundColor: colors.dataLabelBackgroundColor,
                borderRadius: 5,
                font: { size: 10, weight: 400 },
                color: colors.temperature,
              },
            },
            {
              data: weather.dayGraph.map(d => ({
                x: d.timestamp,
                y: d.precipitation,
              })),
              borderColor: colors.precipitation,
              backgroundColor: colors.precipitation + '10',
              fill: true,
              borderDash: [6, 3],
              ...commonData,
            },
            {
              data: weather.dayGraph.map(d => ({
                x: d.timestamp,
                y: d.sunniness,
              })),
              borderColor: colors.sunniness,
              backgroundColor: colors.sunniness + '10',
              fill: true,
              ...commonData,
            },
          ],
        },
        //@ts-ignore
        options: {
          ...chartOptions,
          plugins: {
            annotation: {
              annotations: {
                ...annotations,
              },
            },
            datalabels: {
              display: false,
            },
          },
        },
      })
    }
  }
</script>

<canvas bind:this={canvas} height={75} />
