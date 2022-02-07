import locationsUrl from '../assets/locations.json?url'
import { getCachedRequest } from './cache'

export interface Coordinates {
  lat: number
  lon: number
}

export const loadLocations = async () => {
  const locationList = await (
    await getCachedRequest(locationsUrl, 7 * 60 * 24)
  ).json()
  const locations = locationList.map(location => ({
    ...location,
    search: location.name
      .split(/,|(\s(bei|am|in)\s)/)[0]
      .trim()
      .toLowerCase(),
  }))
  return locations
}
let locations = []

const getLocations = async () => {
  if (locations.length < 1) {
    locations = await loadLocations()
  }
  return locations
}

export async function filterLocations(search: string, maxResults = 5) {
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
  targetLon: number
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
    () => alert('Ort konte nicht ermittelt werden')
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
      +location.lon
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
