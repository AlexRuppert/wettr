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
  class="bg-white rounded-md shadow-md mx-1 mt-1 relative dark:bg-dark-600"
  class:z-50={openedSuggestions}
>
  <div>
    {#if openedSuggestions}
      <div
        class="z-20 absolute"
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
        class="bg-transparent border-none outline-none flex-1 h-9 mt-1 text-center text-xl w-full text-gray-800 md-input dark:text-gray-400"
        placeholder="Ort"
        autocomplete="off"
        bind:this={inputElement}
        bind:value={place}
        on:keydown={handleInputKeys}
        on:focus={openSuggestions}
        on:click={openSuggestions}
      />
      <div
        class="text-center text-xs right-0 -bottom-1 left-0 text-gray-500 absolute pointer-events-none"
      >
        {coordinateString}
      </div>
      <label for="location" class="hidden">Ort</label>
    </div>
  </div>

  {#if openedSuggestions}
    <div
      class="rounded-md outline-none bg-gray-100 shadow-lg mt-2 w-full transform origin-top-right origin-top transition-transform left-0 z-20 absolute dark:bg-dark-800"
      transition:fly={{ duration: TRANSITION_TIME, y: -50 }}
    >
      <div class="shadow-lg py-1">
        {#each suggestions as entry, i}
          <a
            href={'#'}
            class="font-semibold text-sm text-lg py-2 px-4 text-gray-700 block no-underline dark:(text-gray-400)"
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
