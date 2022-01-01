<script lang="ts">
  import { mdiCrosshairsGps } from '@mdi/js'
  import {
    filterLocations,
    getLocationCoordinates,
    getGeolocationCoordinates,
  } from '../logic/locations'
  import { locationCoordinates } from '../stores/store'
  import { getHistory, pushHistory } from '../logic/history'
  import { onMount } from 'svelte'
  import ModalBackground from './ModalBackground.svelte'
  import IconButton from './common/IconButton.svelte'
  import { fade, fly } from 'svelte/transition'

  const TRANSITION_TIME = 250
  let inputElement

  let place = ''
  let coordinateString = ''
  let suggestions: string[] = []
  const setFilterLocations = place =>
    filterLocations(place).then(s => (suggestions = s))
  $: {
    if (place.length <= 0) {
      const history = getHistory()
      if (history.length > 0) suggestions = history
      else setFilterLocations(place)
    } else setFilterLocations(place)
    selectedSuggestion = 0
  }

  let openedSuggestions = false
  let selectedSuggestion = 0

  function handleInputKeys(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
        selectedSuggestion = Math.max(0, selectedSuggestion - 1)
        event.preventDefault()
        break
      case 'ArrowDown':
        selectedSuggestion = Math.min(
          suggestions.length - 1,
          selectedSuggestion + 1
        )
        event.preventDefault()
        break
      case 'Enter':
        selectSuggestion(suggestions[selectedSuggestion])
        break
      case 'Escape':
        closeSuggestions()
        break
    }
  }
  function closeSuggestions() {
    openedSuggestions = false
  }

  function updateCoordinates(place, coordinates) {
    $locationCoordinates = coordinates
    pushHistory(place)
    const urlSearchParams = new URLSearchParams(window.location.search)
    urlSearchParams.set('location', place)
    const newUrl =
      window.location.origin +
      window.location.pathname +
      '?' +
      urlSearchParams.toString() +
      '#' +
      window.location.hash

    if (newUrl !== window.location.toString())
      window.history.pushState({}, '', newUrl)
  }
  async function selectSuggestion(suggestion) {
    place = suggestion
    closeSuggestions()
    inputElement.blur()
    const coordinates = await getLocationCoordinates(suggestion)
    if (!!coordinates) {
      updateCoordinates(place, coordinates)
    }
  }
  function openSuggestions() {
    openedSuggestions = true
    selectedSuggestion = 0
    place = ''
    coordinateString = ''
  }
  function getGeoLocation() {
    closeSuggestions()
    getGeolocationCoordinates(({ closestCity, coordinates }) => {
      place = `Nahe ${closestCity}`
      //coordinateString = `${coordinates.lat}, ${coordinates.lon}`
      updateCoordinates(closestCity, coordinates)
    })
  }

  onMount(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    if (params.location) {
      selectSuggestion(params.location)
    } else {
      selectSuggestion(getHistory()?.[0] ?? '')
    }
  })
</script>

<ModalBackground show={openedSuggestions} on:close={closeSuggestions} />

<div
  class="relative shadow-md rounded-md mt-1 bg-white dark:bg-dark-600 mx-1"
  class:z-50={openedSuggestions}
>
  <div>
    {#if openedSuggestions}
      <div
        class="absolute z-20"
        transition:fade={{ duration: TRANSITION_TIME }}
      >
        <IconButton
          label="Get Current Location"
          icon={mdiCrosshairsGps}
          on:click={getGeoLocation}
        />
      </div>
    {/if}
    <div class="relative">
      <input
        id="location"
        type="text"
        class="md-input border-none flex-1 w-full bg-transparent text-center outline-none h-8 text-xl text-gray-800 dark:text-gray-400 mt-1"
        placeholder="Ort"
        autocomplete="off"
        bind:this={inputElement}
        bind:value={place}
        on:keydown={handleInputKeys}
        on:focus={openSuggestions}
        on:click={openSuggestions}
      />
      <div
        class="absolute text-gray-500 left-0 right-0 text-center -bottom-1 pointer-events-none text-xs"
      >
        {coordinateString}
      </div>
      <label for="location" class="hidden">Ort</label>
    </div>
  </div>

  {#if openedSuggestions}
    <div
      class="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-gray-100 dark:bg-dark-800 outline-none z-20 transform origin-top transition-transform"
      transition:fly={{ duration: TRANSITION_TIME, y: -50 }}
    >
      <div class="py-1 shadow-lg">
        {#each suggestions as entry, i}
          <a
            href={'#'}
            class="text-gray-700 dark:(text-gray-400) block px-4 py-2 text-sm no-underline text-lg font-semibold"
            class:selected={i === selectedSuggestion}
            on:click={() => selectSuggestion(entry)}
            on:mouseenter={() => (selectedSuggestion = i)}>{entry}</a
          >
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  input {
    -webkit-tap-highlight-color: transparent;
  }
  .selected {
    @apply bg-gray-200 dark:bg-dark-400;
  }
</style>
