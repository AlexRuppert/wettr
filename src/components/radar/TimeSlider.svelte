<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'
  import IconButton from '../common/IconButton.svelte'
  import { getNowestTime } from '../../logic/radar/utils'

  export let sliderValue = 0
  export let times = []
  let min = 0
  let max: number = 100
  const dispatch = createEventDispatcher()
  let rangeElement
  let labelElement
  let rangeWidth = 1
  let labelWidth = 1
  let offsetLeft = 0
  let labelOffset = 0

  $: {
    max = times.length - 1
    updateSliderValue(getNowestTime(times)?.index ?? 0)
  }

  function updateSliderValue(value) {
    sliderValue = value
  }

  $: {
    const selectedTime = times[sliderValue]
    if (selectedTime) {
      dispatch('timeSelected', selectedTime)
    }
    labelOffset =
      offsetLeft +
      16 -
      labelWidth / 2 +
      sliderValue * ((rangeWidth - 16 * 2) / max)
  }
  $: {
    if (rangeElement) {
      rangeWidth = rangeElement.offsetWidth
      offsetLeft = rangeElement.offsetLeft
    }
    if (labelElement) {
      labelWidth = labelElement.offsetWidth
    }
  }

  function displayTime(time) {
    return new Intl.DateTimeFormat('default', {
      hourCycle: 'h23',
      hour: 'numeric',
      minute: 'numeric',
    }).format(time)
  }
</script>

<div class="flex my-2 relative">
  <IconButton
    label="Go Back"
    icon={mdiSkipPrevious}
    on:click={() => (sliderValue = Math.max(0, sliderValue - 1))}
  />

  <span class="w-full flex-grow mx-5 mt-1">
    <input
      type="range"
      bind:this={rangeElement}
      bind:value={sliderValue}
      {min}
      {max}
    />
  </span>
  <IconButton
    label="Go Forward"
    icon={mdiSkipNext}
    on:click={() => (sliderValue = Math.min(max, sliderValue + 1))}
  />
  <div class="absolute left-0 -top-10 z-20">
    <div
      bind:this={labelElement}
      class="time-label relative text-center w-full text-xl px-1 rounded-md tabular-nums bg-blue-600 text-light-50"
      style={`transform: translateX(${labelOffset}px)`}
    >
      {displayTime(times[sliderValue])}
      <div class="absolute -mt-0.5" style={`left:${labelWidth / 2 - 10}px`}>
        <svg
          width="100%"
          class="h-6 w-[20px] "
          viewBox="0 0 24 24"
          fill="#2663eb"
          stroke="none"
          preserveAspectRatio="none"
        >
          <path d="m0 0h24c-12 6-12 18 0 24h-24c12 -6 12-18 0-24z" />
        </svg>
      </div>
    </div>
  </div>
</div>

<style>
  .time-label {
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1), 0 -3px 10px rgba(0, 0, 0, 0.3);
  }
  input[type='range'] {
    width: 100%;
    margin: 0;
    background-color: transparent;
    -webkit-appearance: none;
  }

  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    background: #aaaaaa10;
    border-radius: 25px;
    width: 100%;
    cursor: pointer;
    height: 32px;
  }

  input[type='range']::-webkit-slider-thumb {
    border-radius: 100%;
    @apply bg-blue-600;
    height: 32.2px;
    width: 32.2px;
    -webkit-appearance: none;
  }

  input[type='range']::-moz-range-track {
    background: #aaaaaa10;
    border-radius: 25px;
    width: 100%;
    cursor: pointer;
    height: 32px;
  }

  input[type='range']::-moz-range-thumb {
    border-radius: 100%;
    @apply bg-blue-600;
    height: 32.2px;
    width: 32.2px;
    -moz-appearance: none;
  }
</style>
