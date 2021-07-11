<script lang="ts">
  import { mdiCrosshairsGps, mdiReload } from '@mdi/js'
  import SvgIcon from './icons/SvgIcon.svelte'
  import {
    filterLocations,
    getLocationCoordinates,
    getGeolocationCoordinates,
  } from '../logic/locations'
  import { locationCoordinates } from '../stores/store'
  import { getHistory, pushHistory } from '../logic/history'
  import { onMount } from 'svelte'
  let inputElement

  let place = ''
  let coordinateString = ''
  let suggestions: string[]
  $: {
    suggestions = filterLocations(place)
    if (suggestions.length <= 0) suggestions = getHistory()
    selectedSuggestion = 0
  }

  let openedSuggestions = false
  let selectedSuggestion = 0

  function handleInputKeys(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
        // up arrow
        selectedSuggestion = Math.max(0, selectedSuggestion - 1)
        event.preventDefault()
        break
      case 'ArrowDown':
        // down arrow
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
  function selectSuggestion(suggestion) {
    place = suggestion
    closeSuggestions()
    inputElement.blur()
    const coordinates = getLocationCoordinates(place)
    if (coordinates) {
      pushHistory(place)
      $locationCoordinates = coordinates
    }
    console.log('load for ' + place)
  }
  function openSuggestions() {
    openedSuggestions = true
    selectedSuggestion = 0
    place = ''
    coordinateString = ''
  }
  function getGeoLocation() {
    getGeolocationCoordinates(({ closestCity, coordinates }) => {
      place = `Nahe ${closestCity}`
      coordinateString = `${coordinates.lat}, ${coordinates.lon}`
      $locationCoordinates = coordinates
    })
  }

  onMount(() => {
    selectSuggestion(getHistory()?.[0] ?? '')
  })

  function reload() {}
</script>

<div class="relative">
  <div class="flex space-x-3 flex-row">
    <button
      class="button"
      class:hidden={!navigator.geolocation}
      on:click={getGeoLocation}
    >
      <SvgIcon d={mdiCrosshairsGps} dim={{ w: 24, h: 24 }} />
    </button>
    <div class="relative flex-1">
      <input
        id="location"
        type="text"
        class="md-input border-none flex-1 w-full bg-transparent text-center outline-none h-8 text-xl text-gray-800 mt-1"
        placeholder="Ort"
        autocomplete="off"
        bind:this={inputElement}
        bind:value={place}
        on:keydown={handleInputKeys}
        on:focus={openSuggestions}
        on:click={openSuggestions}
      />
      <div
        class="absolute text-gray-500 left-0 right-0 text-center -bottom-2 pointer-events-none text-xs"
      >
        {coordinateString}
      </div>
      <label for="location" class="hidden">Ort</label>
    </div>
    <button class="button" on:click={reload}>
      <SvgIcon d={mdiReload} dim={{ w: 24, h: 24 }} />
    </button>
  </div>
  <div
    class="opacity-0 fixed inset-0"
    class:hidden={!openedSuggestions}
    on:click={() => closeSuggestions()}
  />
  <div
    class="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-gray-100 outline-none z-20"
    class:hidden={!openedSuggestions}
    role="menu"
    aria-orientation="vertical"
  >
    <div class="py-1 shadow-lg">
      {#each suggestions as entry, i}
        <a
          href={'#'}
          class="menu-item"
          class:bg-gray-200={i === selectedSuggestion}
          on:click={() => selectSuggestion(entry)}
          on:mouseenter={() => (selectedSuggestion = i)}>{entry}</a
        >
      {/each}
    </div>
  </div>
</div>

<style>
  .button {
    @apply bg-transparent hover:bg-blue-gray-100 rounded border-none w-10 h-10 cursor-pointer flex items-center;
  }

  .menu-item {
    @apply text-gray-700 block px-4 py-2 text-sm no-underline text-lg font-semibold;
  }
</style>
