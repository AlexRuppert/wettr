import locationsUrl from '@/assets/locations.bin.json?url'
import { getCachedRequest } from '@/logic/cache'
import { trimCoordinates } from '@/logic/utils'
import { encoder } from 'tinybuf'

export interface Coordinates {
  lat: number
  lon: number
}

const UMLAUT_REPLACEMENTS = [
  { regex: /ä/g, replacement: 'a' },
  { regex: /ö/g, replacement: 'o' },
  { regex: /ü/g, replacement: 'u' },
  { regex: /ß/g, replacement: 'ss' },
]

export const loadLocations = async () => {
  const locationDecoder = encoder({
    //@ts-ignore
    minLat: 'uint32',
    //@ts-ignore
    minLon: 'uint32',
    //@ts-ignore
    lons: ['uint16'],
    //@ts-ignore
    lats: ['uint16'],
    //@ts-ignore
    names: 'str',
  })
  const locationList = await (
    await getCachedRequest(locationsUrl, 7 * 60 * 24)
  ).arrayBuffer()

  const decodedLcoations = locationDecoder.decode(locationList)
  const loadedLocations = []
  //@ts-ignore
  const locationNames = decodedLcoations.names.split('%')
  //@ts-ignore
  for (let i = 0; i < decodedLcoations.lons.length; i++) {
    let lon = (decodedLcoations.lons[i] + decodedLcoations.minLon) / 1000
    let lat = (decodedLcoations.lats[i] + decodedLcoations.minLat) / 1000
    let name = locationNames[i]
    loadedLocations.push({ name, lat, lon })
  }
  const locations = loadedLocations.map((location: { name: string }) => {
    let normalizedName = location.name
      .toLowerCase()
      .split(/,|(\s(bei|am|in)\s)/)[0]
      .trim()

    let normalizedName2 = UMLAUT_REPLACEMENTS.reduce(
      (acc, val) => acc.replaceAll(val.regex, val.replacement),
      normalizedName,
    )
    let search = [normalizedName, normalizedName2].join(' ')
    return {
      ...location,
      search,
    }
  })
  return locations
}
let locations = []

const getLocations = async () => {
  return locations.length < 1 ? await loadLocations() : locations
}

export async function filterLocations(search: string, maxResults = 8) {
  search = search.trim().toLowerCase()
  return (await getLocations())
    .filter(l => l.search.includes(search))
    .slice(0, maxResults)
}

export async function getLocationCoordinates(place: string) {
  if (place.trim().length === 0) return null
  const result = (await getLocations()).find(l => l.name === place)
  if (result) {
    return { lat: +result.lat, lon: +result.lon } as Coordinates
  }
  return null
}

function distance(
  sourceLat: number,
  sourceLon: number,
  targetLan: number,
  targetLon: number,
) {
  return Math.pow(sourceLat - targetLan, 2) + Math.pow(sourceLon - targetLon, 2)
}

export async function getGeolocationCoordinates(successCallback) {
  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords
      const lat = +latitude.toFixed(3)
      const lon = +longitude.toFixed(3)

      let closestCity = await getClosestCity({ lat, lon })

      successCallback({ closestCity, coordinates: { lat, lon } })
    },
    () => alert('Ort konte nicht ermittelt werden'),
  )
}

export async function getClosestCity(coordinates: Coordinates) {
  let closestCity = ''
  let closestDistance = Infinity

  for (let location of await getLocations()) {
    const dist = distance(
      coordinates.lat,
      coordinates.lon,
      +location.lat,
      +location.lon,
    )
    if (dist < closestDistance) {
      closestDistance = dist
      closestCity = location.name
    }
  }
  return closestCity
}

export function isLocationSet({ lat, lon }: Coordinates) {
  return (
    lat !== undefined &&
    lon !== undefined &&
    lat !== 0 &&
    lon !== 0 &&
    lat > -500
  )
}

export function serializeCoordinates({ lon, lat }) {
  return `${(+lon).toFixed(3)}_${(+lat).toFixed(3)}`
}
export function deserializeCoordinates(coordinateString) {
  const [lon, lat] = coordinateString.split('_').map(el => +el)
  return { lon, lat }
}

export function getCoordinatesFromUrl() {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  let coordinates = { lon: 0, lat: -500 }

  try {
    const _coordinates = deserializeCoordinates(params.coordinates)
    if (
      _coordinates &&
      !Number.isNaN(_coordinates.lon) &&
      !Number.isNaN(_coordinates.lat)
    ) {
      coordinates = _coordinates
    }
  } catch (ex) {}
  return coordinates
}

export function lookupStateUrlPart(state: string) {
  switch (state) {
    case 'BW':
      return 'baw'
    case 'BY':
      return 'bay'
    case 'BE':
    case 'BB':
      return 'bbb'
    case 'HB':
      return 'nib'
    case 'HH':
      return 'shh'
    case 'HE':
      return 'hes'
    case 'MV':
      return 'mvp'
    case 'NI':
      return 'nib'
    case 'NW':
      return 'nrw'
    case 'RP':
      return 'rps'
    case 'SL':
      return 'rps'
    case 'SN':
      return 'sac'
    case 'ST':
      return 'saa'
    case 'SH':
      return 'shh'
    case 'TH':
      return 'thu'
    default:
      return 'brd'
  }
}

export async function getLocationData(coordinates: Coordinates) {
  const ENDPOINT = `https://api.brightsky.dev/`
  let weatherWarningsUrl = new URL(ENDPOINT + 'alerts')
  weatherWarningsUrl.search = new URLSearchParams({
    ...trimCoordinates(coordinates),
  }).toString()

  const rawData = await (await getCachedRequest(weatherWarningsUrl, 19)).json()
  return rawData?.location?.state_short ?? ''
}
