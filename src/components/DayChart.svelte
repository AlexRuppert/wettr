<script lang="ts">
  import { onMount } from 'svelte'
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    TimeScale,
    Filler,
  } from 'chart.js'
  import annotationPlugin from 'chartjs-plugin-annotation'
  import 'chartjs-adapter-date-fns'

  Chart.register(
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
    TimeScale,
    annotationPlugin
  )

  let canvas: HTMLCanvasElement
  let mounted = false
  let chart: Chart

  const COLORS = {
    tick: '#aaa',
    grid: '#f0f0f0',
    night: '#444464' + '10',
    temperature: '#FF3B1D',
    precipitation: '#0066ED',
    sunniness: '#FFCE4C',
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
          color: COLORS.tick,
          font: {
            size: 10,
          },
        },
        grid,
      },
      y: {
        ticks: {
          display: false,
        },
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

  export let weather

  onMount(() => {
    mounted = true
  })
  console.dir(weather)
  $: {
    if (mounted) {
      const annotations: { sunset?: any; sunrise?: any } = {}
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

      const commonData = {
        tension: 0.3,
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
              borderDash: [1, 2],
              ...commonData,
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
              annotations: { ...annotations },
            },
          },
        },
      })
    }
  }
</script>

<canvas bind:this={canvas} height={75} />
