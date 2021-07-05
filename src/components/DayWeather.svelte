<script lang="ts">
  import type { WeatherDataType } from 'src/logic/weatherTypes'
  import { onMount } from 'svelte'
  import { weatherData } from '../stores/store'
  import SvgIcon from './icons/SvgIcon.svelte'
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import annotationPlugin from 'chartjs-plugin-annotation'
  import 'chartjs-adapter-date-fns'

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

  let mounted = false
  let canvases = []
  let charts = []
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
          color: '#aaa',
          font: {
            size: 12,
          },
        },
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: true,
          drawTicks: false,
          color: '#f0f0f0',
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: true,
          drawTicks: false,
          color: '#f0f0f0',
        },
      },
    },
  }
  const dayLightAnnotation = {
    type: 'box',
    yMin: 0,
    yMax: 1,
    backgroundColor: '#444464' + '10',
    borderColor: 'transparent',
  }

  let weather: {
    day: Date
    morning: any
    noon: any
    evening: any
    max: any
    min: any
    dayGraph: any
    dayLight: any
    data: WeatherDataType[]
  }[]
  $: weather = $weatherData

  onMount(() => {
    mounted = true
  })
  $: {
    if (mounted) {
      canvases.forEach((c, i) => {
        const annotations: { sunset?: any; sunrise?: any } = {}
        const sunrise = {
          xMin: weather[i].dayGraph[0].timestamp,
          xMax: weather[i].dayLight.sunrise,
        }
        const sunset = {
          xMin: weather[i].dayLight.sunset,
          xMax: weather[i].dayGraph[weather[i].dayGraph.length - 1].timestamp,
        }

        if (new Date(sunrise.xMin) < new Date(sunrise.xMax))
          annotations.sunrise = { ...dayLightAnnotation, ...sunrise }
        if (new Date(sunset.xMin) < new Date(sunset.xMax))
          annotations.sunset = { ...dayLightAnnotation, ...sunset }

        charts[i] = new Chart(canvases[i], {
          type: 'line',
          data: {
            datasets: [
              {
                data: weather[i].dayGraph.map(d => ({
                  x: d.timestamp,
                  y: d.temperature,
                })),
                borderColor: '#FF3B1D',
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 1,
                borderDash: [1, 2],
              },
              {
                data: weather[i].dayGraph.map(d => ({
                  x: d.timestamp,
                  y: d.precipitation,
                })),
                borderColor: '#0066ED',
                backgroundColor: '#0066ED' + '10',
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 1,
                borderDash: [6, 3],
              },
              {
                data: weather[i].dayGraph.map(d => ({
                  x: d.timestamp,
                  y: d.sunniness,
                })),
                borderColor: '#FFCE4C',
                backgroundColor: '#FFCE4C' + '10',
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 1,
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
      })
      console.dir(weather)
    }
  }

  let formattedDay
  $: formattedDay = weather.map(w => {
    const formatted = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      weekday: 'short',
    }).formatToParts(w.day)

    return {
      day: formatted.find(f => f.type === 'day').value,
      weekday: formatted
        .find(f => f.type === 'weekday')
        .value.replace(/\./g, ''),
    }
  })
</script>

<div class="flex flex-col flex-nowrap tabular-nums font-thin">
  {#each weather as { day, morning, noon, evening, max, min }, i (day)}
    <div class="border-b last:(border-b-0)">
      <div class="flex justify-between">
        <div class="text-3xl pl-2 w-28">
          <span>{formattedDay[i].day}</span>
          <span class="text-lg">{formattedDay[i].weekday}</span>
        </div>

        <div class="flex pt-1 children:w-7 space-x-3">
          <div><WeatherIcon icon={morning.icon} /></div>
          <div><WeatherIcon icon={noon.icon} /></div>
          <div><WeatherIcon icon={evening.icon} /></div>
        </div>
        <div class="text-3xl pl-2 w-28 text-right">
          <span class="text-lg">{min.temperature}°</span>
          <span class="font-normal">{max.temperature}°</span>
        </div>
      </div>

      <canvas bind:this={canvases[i]} height={50} class="mt-2" />
      {#if i < weather.length - 1}
        <div
          class="-mx-3 mt-3 mb-5 border-0 border-b border-solid border-gray-300"
        />
      {/if}
    </div>
  {/each}
</div>
