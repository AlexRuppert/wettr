<script lang="ts">
  import { mdiCrosshairsGps } from '@mdi/js'
  import SvgIcon from './icons/SvgIcon.svelte'
  import locationList from '../assets/locations'
  import { locationCoordinates } from '../stores/store'

  const location = locationList.map(l => {
    const split = l.split('|')
    return {
      name: split[0],
      lat: split[1],
      lon: split[2],
      search: split[0]
        .split(/,|( bei )|( am )|( in )/)[0]
        .trim()
        .toLowerCase(),
    }
  })

  let inputElement
  let city = ''
  let suggestions: { name: string; lat: string; lon: string; search: string }[]
  $: {
    suggestions = location
      .filter(l => l.search.includes(city.toLowerCase()))
      .slice(0, 5)
    selectedSuggestion = 0
  }

  $: {
    if (city !== '') {
      const result = location.find(l => l.name === city)
      if (result) {
        $locationCoordinates = { lat: +result.lat, lon: +result.lon }
      }
    }
  }

  let openSuggestions = false
  let selectedSuggestion = 0

  function handleInputKeys(event) {
    if (event.keyCode == '38') {
      // up arrow
      selectedSuggestion = Math.max(0, selectedSuggestion - 1)
    } else if (event.keyCode == '40') {
      // down arrow
      selectedSuggestion = Math.min(
        suggestions.length - 1,
        selectedSuggestion + 1
      )
    } else if (event.keyCode == '13') {
      city = suggestions[selectedSuggestion].name
      openSuggestions = false
      inputElement.blur()
    }
  }

  function getGeoLocation() {
    navigator.geolocation.getCurrentPosition(
      getGeoLocationSuccess,
      getGeoLocationError
    )
  }
  function getGeoLocationSuccess(position) {
    const { latitude, longitude } = position.coords

    const lat = +Number.parseFloat(latitude).toFixed(3)
    const lon = +Number.parseFloat(longitude).toFixed(3)

    city = `Hier: ${lat}, ${lon}`
    $locationCoordinates = { lat, lon }
  }
  function getGeoLocationError() {
    alert('Ort konte nicht ermittelt werden')
  }
</script>

<div class="relative">
  <div class="flex space-x-3 flex-row">
    <button
      class="bg-transparent hover:bg-blue-gray-100 rounded border-none w-10 h-10 cursor-pointer"
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
        placeholder="Stadt"
        autocomplete="off"
        bind:this={inputElement}
        bind:value={city}
        on:keydown={handleInputKeys}
        on:focus={() => {
          ;(city = ''), (openSuggestions = true), (selectedSuggestion = 0)
        }}
        on:blur={() => {
          city = suggestions[selectedSuggestion].name
          openSuggestions = false
        }}
      />
      <label for="location" class="hidden">Stadt</label>
      <div class="md-input-underline" />
    </div>
  </div>

  <div
    class="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-gray-100 outline-none z-20"
    class:hidden={!openSuggestions}
    role="menu"
    aria-orientation="vertical"
    aria-labelledby="menu-button"
    tabindex="-1"
  >
    <div class="py-1 shadow-lg" role="none">
      {#each suggestions as suggestion, i}
        <a
          href={'#'}
          class="text-gray-700 block px-4 py-2 text-sm no-underline text-lg font-semibold"
          class:bg-gray-200={i === selectedSuggestion}
          role="menuitem"
          tabindex="-1"
          on:click={() => (city = suggestion.name)}
          on:mouseenter={() => (selectedSuggestion = i)}>{suggestion.name}</a
        >
      {/each}
    </div>
  </div>
</div>

<style>
  .md-input-underline:after {
    @apply absolute left-0 right-0  pointer-events-none;
    content: '';
    transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    transform: scaleX(0);
    border-bottom: 2px solid #666;
  }
  .md-input:focus ~ .md-input-underline:after {
    transform: scaleX(1);
  }
</style>
