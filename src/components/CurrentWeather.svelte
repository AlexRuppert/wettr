<script lang="ts">
  import WeatherIcon from './icons/WeatherIcon.svelte'
  import WindDirection from './icons/WindDirection.svelte'
  import { umbrellaClosed, umbrellaOpen } from './icons/icons'
  import SvgIcon from './icons/SvgIcon.svelte'
  import { currentWeatherData } from '../stores/store'

  function toLocalDecimal(num, precision = 0) {
    return Number.parseFloat(num).toFixed(precision).toLocaleString()
  }

  let weather
  $: weather = $currentWeatherData
</script>

<div
  class="flex flex-nowrap tabular-nums pt-3"
  class:opacity-0={Object.keys(weather).length <= 0}
>
  <div class="w-32 h-32 -mt-3">
    <WeatherIcon icon={weather.icon} />
  </div>

  <div class="ml-6 mt-5 flex flex-col">
    <div class="flex justify-between">
      <div class="w-7">
        <SvgIcon
          d={weather.precipitation > 2.5 ? umbrellaOpen : umbrellaClosed}
        />
      </div>
      <span class=" text-right text-lg flex-grow">
        {toLocalDecimal(weather.precipitation, 1)}
      </span>
      <span class="w-10 text-xs pt-2 text-right"> mm/h</span>
    </div>
    <div class="flex justify-between">
      <div class="w-7">
        <WindDirection direction={weather.windDirection} />
      </div>
      <span class=" text-right text-lg flex-grow">
        {toLocalDecimal(weather.windSpeed)} - {toLocalDecimal(
          weather.windGustSpeed
        )}
      </span>
      <span class="w-10 text-xs pt-2 text-right"> km/h</span>
    </div>
  </div>
  <div class="flex pt-2">
    <div class="w-30 font-thin text-7xl text-right">
      {weather.temperature}
    </div>
    <div class="mt-1 text-3xl">°</div>
  </div>
</div>
