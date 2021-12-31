<script lang="ts">
  import { radarOpen, cloudData, locationCoordinates } from '../../stores/store'

  import { onMount, tick } from 'svelte'
  import { reloadClouds } from '../../logic/reloader'
  import { filterClouds } from '../../logic/radar/clouds'
  import ModalBackground from '../ModalBackground.svelte'
  import { isLocationSet } from '../../logic/locations'

  import IconButton from '../common/IconButton.svelte'
  import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'
  import { fly } from 'svelte/transition'
  import { swipe } from 'svelte-gestures'
  import SatelliteComposite from './SatelliteComposite.svelte'
  import TimeSlider from './TimeSlider.svelte'
  const YEAR = 2019
  const QUELLENVERMERK = `© Europäische Union, enthält Copernicus Sentinel-2 Daten ${YEAR}, verarbeitet durch das
Bundesamt für Kartographie und Geodäsie (BKG)`

  let times = []
  let clouds = []
  let cloudsToShow = []
  let viewBounds

  $: if ($radarOpen && isLocationSet($locationCoordinates)) reloadClouds()
  $: {
    if ($cloudData?.viewBounds?.lb) {
      update($cloudData)
    }
  }

  function update(cloudData) {
    viewBounds = cloudData.viewBounds
    times = cloudData.times
    clouds = cloudData.clouds
  }

  function filterCloudsByTime(time) {
    cloudsToShow = filterClouds(clouds, time)
  }

  onMount(async () => {
    await tick()
  })

  function close() {
    $radarOpen = false
  }
</script>

<ModalBackground show={$radarOpen} on:close={close} />

{#if $radarOpen}
  <div
    class="absolute space-y-2 flex flex-col children:(shadow-md rounded-md max-w-sm p-2 bg-white mx-5 z-20) left-0 right-0 top-0 z-20 select-none"
    transition:fly={{ y: -300 }}
    use:swipe={{ timeframe: 500, minSwipeDistance: 35, touchAction: 'none' }}
    on:swipe={({ detail }) => (detail.direction === 'top' ? close() : null)}
  >
    <div class="flex-col mt-2 dark:bg-dark-600">
      <div class="text-size-xl pt-2 pb-4 text-center" on:click={close}>
        <span>Regenradar</span>
        <span
          class="absolute right-5 text-lg font-extralight px-3 cursor-pointer"
          role="button"
          on:click={close}>×</span
        >
      </div>
      <SatelliteComposite clouds={cloudsToShow} {viewBounds} />
      <div>
        <TimeSlider
          {times}
          on:timeSelected={event => filterCloudsByTime(event.detail)}
        />
      </div>
    </div>
    <div class="source text-center dark:bg-dark-600">
      <a href="https://www.bkg.bund.de">{QUELLENVERMERK}</a>
    </div>
  </div>
{/if}

<style>
  .source a {
    @apply text-xs no-underline font-normal text-gray-700 hover:underline;
    letter-spacing: -0.07em;
  }
  .dark .source a {
    @apply text-gray-600;
  }

  div {
    --thumb-bg: #2784ff;
    --progress-bg: #2784ff;
    --track-bg: #444444;
  }

  :global(.thumb-content .thumb) {
    @apply w-7 h-7;
  }
</style>
