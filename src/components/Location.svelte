<script lang="ts">
  import IconButton from '@/components/common/IconButton.svelte'
  import ModalBackground from '@/components/common/ModalBackground.svelte'
  import { gps } from '@/components/icons/icons'
  import { getHistory, pushHistory } from '@/logic/history'
  import {
    filterLocations,
    getClosestCity,
    getCoordinatesFromUrl,
    getGeolocationCoordinates,
    getLocationCoordinates,
    isLocationSet,
    serializeCoordinates,
    type Coordinates,
  } from '@/logic/locations'
  import { locationCoordinates } from '@/stores/store.svelte'
  import { fly } from 'svelte/transition'

  import { stageReload } from '@/logic/reloader'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import SvgCorner from './icons/SvgCorner.svelte'

  interface Props extends CustomElement {}
  let { ...other }: Props = $props()

  const TRANSITION_TIME = 250
  const FALLBACK_SUGGESTION = {
    location: '',
    coordinates: { lon: 0, lat: -500 },
  }
  let inputElement = $state(null)
  let place = $state('')
  let openedSuggestions = $state(false)

  let suggestions: { name: string; lon: number; lat: number }[] = $state([])
  let selectedSuggestion = $state(0)

  let noLocation = $derived(!isLocationSet(locationCoordinates.value))

  let coordinates: Coordinates

  $effect(() => {
    if (
      isLocationSet(locationCoordinates.value) &&
      (!coordinates ||
        serializeCoordinates(coordinates) !==
          serializeCoordinates(locationCoordinates.value))
    ) {
      coordinates = locationCoordinates.value

      stageReload(true)
    }
  })

  locationCoordinates.value = getCoordinatesFromUrl()

  $effect.pre(() => {
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
  })

  const setFilterLocations = place =>
    filterLocations(place).then(s => (suggestions = s))

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
    if (!place && isLocationSet(locationCoordinates.value)) {
      getClosestCity(locationCoordinates.value).then(city => (place = city))
    }
    openedSuggestions = false
    inputElement?.blur()
  }

  function updateCoordinates(place: string, coordinates: Coordinates) {
    locationCoordinates.value = coordinates
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

    if (params?.location) {
      name = params.location
    }

    if (!name && isLocationSet(coordinates)) {
      name = await getClosestCity(coordinates)
    } else if (name && !isLocationSet(coordinates)) {
      coordinates = await getLocationCoordinates(name)
    } else if (!name && !isLocationSet(coordinates)) {
      const fallback = getHistory()?.[0]

      if (fallback?.location && fallback?.coordinates) {
        name = fallback.location
        coordinates = fallback.coordinates
      } else {
        coordinates = FALLBACK_SUGGESTION.coordinates
      }
    }

    if (isLocationSet(coordinates)) {
      selectSuggestion({ name, ...coordinates })
    }
  }

  init()
</script>

<ModalBackground show={openedSuggestions} onclose={closeSuggestions} />

<div class={['flex items-center', { 'h-dvh': noLocation }]}>
  <div
    class={[
      'relative h-10 w-full rounded-md shadow-md',
      openedSuggestions ? 'bg-surface-400 z-50' : 'bg-surface-500',
    ]}
  >
    <SvgCorner></SvgCorner>
    <label
      class={[
        'ring-primary flex size-full items-center justify-center overflow-hidden rounded-md ring-inset',
        {
          'dark:bg-surface-100 ring-2': noLocation,
        },
      ]}
    >
      <span class="hidden">O-r-t</span
      ><!--prevent stupid browsers to show autocomplete despite off-flag-->
      <input
        id="location"
        type="text"
        class="w-full bg-transparent text-center text-xl leading-10 placeholder-current outline-hidden"
        placeholder="Ort"
        autocomplete="off"
        spellcheck="false"
        bind:this={inputElement}
        bind:value={place}
        onkeydown={handleInputKeys}
        onfocus={openSuggestions}
        onclick={openSuggestions}
      />
    </label>

    <IconButton
      label="Get Current Location"
      class="absolute top-0 left-0 opacity-30"
      icon={gps}
      onclick={getGeoLocation}
    >
      <SvgCorner></SvgCorner>
    </IconButton>

    {#if openedSuggestions}
      <div
        class="bg-surface-500 absolute left-0 mt-px w-full overflow-hidden rounded-md shadow-lg"
        in:fly={{ duration: TRANSITION_TIME, y: -5 }}
      >
        {#each suggestions as entry, i}
          <a
            href={'#'}
            class={[
              'block cursor-pointer px-3 py-2 text-lg no-underline',
              {
                'bg-primary text-text-primary': i === selectedSuggestion,
              },
            ]}
            onclick={() => selectSuggestion(entry)}
            onmouseenter={() => (selectedSuggestion = i)}>{entry.name}</a
          >
        {/each}
      </div>
    {/if}
  </div>
</div>
