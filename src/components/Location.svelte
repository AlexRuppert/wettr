<script lang="ts">
  import {
    filterLocations,
    getLocationCoordinates,
    getGeolocationCoordinates,
    getClosestCity,
    serializeCoordinates,
    getCoordinatesFromUrl,
  } from '../logic/locations'
  import type { Coordinates } from '../logic/locations'
  import { locationCoordinates } from '../stores/store'
  import { getHistory, pushHistory } from '../logic/history'
  import ModalBackground from './ModalBackground.svelte'
  import IconButton from './common/IconButton.svelte'
  import { fade, fly } from 'svelte/transition'
  import { gps } from './icons/icons'

  const TRANSITION_TIME = 250
  const FALLBACK_SUGGESTION = {
    location: '',
    coordinates: { lon: 0, lat: 0 },
  }
  let inputElement

  let place = ''

  let suggestions: { name: string; lon: number; lat: number }[] = []
  const setFilterLocations = place =>
    filterLocations(place).then(s => (suggestions = s))

  let openedSuggestions = false
  let selectedSuggestion = 0
  $: {
    if (openedSuggestions) {
      if (place.length <= 0) {
        const history = getHistory()
        if (history.length > 0)
          suggestions = history.map(h => ({
            name: h.location,
            lon: h.coordinates.lon,
            lat: h.coordinates.lat,
          }))
        else setFilterLocations(place)
      } else setFilterLocations(place)
      selectedSuggestion = 0
    }
  }

  function handleInputKeys(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
        selectedSuggestion = Math.max(0, selectedSuggestion - 1)
        event.preventDefault()
        break
      case 'ArrowDown':
        selectedSuggestion = Math.min(
          suggestions.length - 1,
          selectedSuggestion + 1,
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
    if (!place && $locationCoordinates) {
      getClosestCity($locationCoordinates).then(city => (place = city))
    }
    openedSuggestions = false
    inputElement?.blur()
  }

  function updateCoordinates(place: string, coordinates: Coordinates) {
    $locationCoordinates = coordinates
    pushHistory(place, coordinates)
    const urlSearchParams = new URLSearchParams(window.location.search)
    urlSearchParams.set('location', place)
    urlSearchParams.set('coordinates', serializeCoordinates(coordinates))
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
  async function selectSuggestion(suggestion: {
    name: string
    lon: number
    lat: number
  }) {
    place = suggestion.name
    updateCoordinates(place, { ...suggestion })
    closeSuggestions()
  }
  function openSuggestions() {
    openedSuggestions = true
    selectedSuggestion = 0
    place = ''
  }
  async function getGeoLocation() {
    try {
      await getGeolocationCoordinates(({ closestCity, coordinates }) => {
        place = closestCity
        updateCoordinates(closestCity, coordinates)
      })
      closeSuggestions()
    } catch (ex) {}
  }
  async function init() {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    let coordinates = getCoordinatesFromUrl()
    let name = ''

    if (params.location != 'undefined') {
      name = params.location
    }

    if (!name && coordinates.lat > -500) {
      name = await getClosestCity(coordinates)
    } else if (name && coordinates.lat <= -500) {
      coordinates = await getLocationCoordinates(name)
    } else {
      const fallback = getHistory()?.[0]
      if (fallback.location && fallback.coordinates) {
        name = fallback.location
        coordinates = fallback.coordinates
      } else {
        name = FALLBACK_SUGGESTION.location
        coordinates = FALLBACK_SUGGESTION.coordinates
      }
    }
    selectSuggestion({ name, ...coordinates })
  }
  init()
</script>

<ModalBackground show={openedSuggestions} on:close={closeSuggestions} />

<div
  class="relative rounded-default bg-surface-500 leading-10 shadow-md"
  class:z-50={openedSuggestions}
  class:!bg-surface-400={openedSuggestions}
>
  <label>
    <span class="hidden">Ort</span>
    <input
      id="location"
      type="text"
      class="w-full bg-transparent text-center text-xl outline-none"
      placeholder="Ort"
      autocomplete="off"
      bind:this={inputElement}
      bind:value={place}
      on:keydown={handleInputKeys}
      on:focus={openSuggestions}
      on:click={openSuggestions}
    />
  </label>

  {#if openedSuggestions}
    <div class="absolute left-0 top-0">
      <IconButton
        label="Get Current Location"
        icon={gps}
        outline
        on:click={getGeoLocation}
      />
    </div>
    <div
      class="absolute left-0 mt-px w-full overflow-hidden rounded-default bg-surface-500 shadow-lg"
      transition:fly={{ duration: TRANSITION_TIME, y: -5 }}
    >
      {#each suggestions as entry, i}
        <a
          href={'#'}
          class="block cursor-pointer px-3 py-2 text-lg no-underline"
          class:selected={i === selectedSuggestion}
          on:click={() => selectSuggestion(entry)}
          on:mouseenter={() => (selectedSuggestion = i)}>{entry.name}</a
        >
      {/each}
    </div>
  {/if}
</div>
