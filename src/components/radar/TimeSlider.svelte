<svelte:options immutable />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import IconButton from '../common/IconButton.svelte'
  import { getNowestTime } from '../../logic/radar/utils'
  import { skipNext, skipPrevious } from '../icons/icons'

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
  function updateSliderValue(value) {
    sliderValue = value
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
  <span>
    <IconButton
      label="Go Back"
      icon={skipPrevious}
      outline
      on:click={() => (sliderValue = Math.max(0, sliderValue - 1))}
    />
  </span>

  <span class="flex-grow mx-3 mt-1 w-full">
    <input
      type="range"
      bind:this={rangeElement}
      bind:value={sliderValue}
      {min}
      {max}
    />
  </span>
  <span>
    <IconButton
      label="Go Forward"
      icon={skipNext}
      outline
      on:click={() => (sliderValue = Math.min(max, sliderValue + 1))}
    />
  </span>
  <div class="-top-10 left-0 z-20 absolute">
    <div
      bind:this={labelElement}
      class="rounded-md bg-blue-600 text-center text-xl text-white w-full px-1 time-label relative tabular-nums"
      style={`transform: translateX(${labelOffset}px)`}
    >
      {displayTime(times[sliderValue])}
      <div class="-mt-0.5 absolute" style={`left:${labelWidth / 2 - 10}px`}>
        <svg
          width="100%"
          class="h-6 w-[20px] "
          viewBox="0 0 24 24"
          fill="#2663eb"
          stroke="none"
          preserveAspectRatio="none"
        >
          <path d="m0 0h24c-12 6-12 18 0 24h-24c12-6 12-18 0-24z" />
        </svg>
      </div>
    </div>
  </div>
</div>

<style global>
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
    background: #aaaaaa20;
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
    background: #aaaaaa20;
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
