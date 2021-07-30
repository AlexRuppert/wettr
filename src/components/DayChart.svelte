<script lang="ts">
  import { onMount } from 'svelte'
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

  const COLORS = {
    tick: '#999',
    grid: '#f0f0f0',
    night: '#444464' + '10',
    temperature: '#444444',
    precipitation: '#0066ED',
    sunniness: '#FFB901',
  }
  const grid = {
    display: true,
    drawBorder: false,
    drawOnChartArea: true,
    drawTicks: false,
    color: COLORS.grid,
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
          color: COLORS.tick,
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
    backgroundColor: COLORS.night,
    borderColor: 'transparent',
  }
  const bottomAnnotation = {
    type: 'box',
    yMin: -0.1,
    yMax: 0,
    backgroundColor: '#444',
    borderColor: '#444',
    borderWidth: 2,
  }

  const currentTimeAnnotation = {
    type: 'line',
    borderColor: '#a00',
    borderWidth: 0.5,
  }

  export let weather

  onMount(() => {
    mounted = true
  })
  $: {
    if (mounted) {
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

      if (new Date(sunrise.xMin) < new Date(sunrise.xMax))
        annotations.sunrise = { ...dayLightAnnotation, ...sunrise }
      if (new Date(sunset.xMin) < new Date(sunset.xMax))
        annotations.sunset = { ...dayLightAnnotation, ...sunset }

      const now = new Date()
      if (now > new Date(sunrise.xMin) && now < new Date(sunset.xMax))
        annotations.current = { ...currentTimeAnnotation, xMin: now, xMax: now }

      const commonData = {
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 1,
      }
      chart?.destroy()
      chart = new Chart(canvas, {
        type: 'line',
        data: {
          datasets: [
            {
              data: weather.dayGraph.map(d => ({
                x: d.timestamp,
                y: d.temperature,
              })),
              borderColor: COLORS.temperature,
              ...commonData,
              borderDash: [1, 2],
              borderWidth: 1,
              pointRadius: function (context) {
                return ((context.dataIndex + 1) % 2) * 1.2
              },
              pointBackgroundColor: '#fff',
              pointBorderColor: '#505050',
              datalabels: {
                display: function (context) {
                  return context.dataIndex % 2 === 1 ? false : 'auto'
                },
                align: function (context) {
                  const index = context.dataIndex
                  const value = (context.dataset.data[index] as { y: number }).y
                  if (index === 0) return 290
                  return value < 0.5 ? 210 : 150
                },
                offset: 2,
                padding: 1,
                formatter: function (value) {
                  const l = weather.min.temperature
                  const r = weather.max.temperature
                  return l + value.y * (r - l)
                },
                backgroundColor: '#ffffff' + 'a0',
                borderRadius: 5,
                font: { size: 10, weight: 400 },
              },
            },
            {
              data: weather.dayGraph.map(d => ({
                x: d.timestamp,
                y: d.precipitation,
              })),
              borderColor: COLORS.precipitation,
              backgroundColor: COLORS.precipitation + '10',
              fill: true,
              borderDash: [6, 3],
              ...commonData,
            },
            {
              data: weather.dayGraph.map(d => ({
                x: d.timestamp,
                y: d.sunniness,
              })),
              borderColor: COLORS.sunniness,
              backgroundColor: COLORS.sunniness + '10',
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
