<script lang="ts">
  import { radarOpen, cloudData, locationCoordinates } from '../../stores/store'

  import { reloadClouds } from '../../logic/reloader'
  import { filterClouds } from '../../logic/radar/clouds'
  import ModalBackground from '../ModalBackground.svelte'
  import { isLocationSet } from '../../logic/locations'
  import { fly } from 'svelte/transition'
  import { swipe } from 'svelte-gestures'
  import SatelliteComposite from './SatelliteComposite.svelte'
  import TimeSlider from './TimeSlider.svelte'
  const YEAR = 2021
  const QUELLENVERMERK1 = `Kartendarstellung: © Bundesamt für Kartographie und Geodäsie (${YEAR})`
  const QUELLEN_LINK1 = `http://www.bkg.bund.de/`
  const QUELLENVERMERK2 = `Datenquellen`
  const QUELLEN_LINK2 = `https://sg.geodatenzentrum.de/web_public/Datenquellen_TopPlus_Open.pdf`

  let times = []
  let clouds = []
  let cloudsToShow = []
  let viewBounds

  let filteredCache = new Map()

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

    times.forEach(time => {
      filteredCache.set(time, filterClouds(clouds, time))
    })
  }

  function filterCloudsByTime(time) {
    cloudsToShow = filteredCache.get(time)
  }

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
      <a href={QUELLEN_LINK1}>{QUELLENVERMERK1}</a><span>, </span>
      <a href={QUELLEN_LINK2}>{QUELLENVERMERK2}</a>
    </div>
  </div>
{/if}

<style>
  .source a {
    @apply text-xs no-underline font-normal text-gray-800 hover:underline;
    letter-spacing: -0.07em;
  }
  .dark .source span, .dark .source a {
    @apply text-gray-500;
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
