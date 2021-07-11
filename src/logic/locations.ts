import locationList from '../assets/locations'

export interface Coordinates {
  lat: number
  lon: number
}

export const locations = locationList.map(l => {
  const split = l.split('|')
  return {
    name: split[2],
    lat: split[0],
    lon: split[1],
    search: split[2]
      .split(/,|( bei )|( am )|( in )/)[0]
      .trim()
      .toLowerCase(),
  }
})

export function filterLocations(search: string, maxResults = 5) {
  search = search.trim().toLowerCase()
  if (search.length <= 0) return []
  return locations.filter(l => l.search.includes(search)).slice(0, maxResults).map(s => s.name)
}

export function getLocationCoordinates(place: string) {
  console.log(place)
  if (place.trim().length === 0) return null

  const result = locations.find(l => l.name === place)
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

export function getGeolocationCoordinates(successCallback) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords
      const lat = latitude.toFixed(3)
      const lon = longitude.toFixed(3)
      let closestCity = ''
      let closestDistance = Infinity

      for (let location of locations) {
        const dist = distance(latitude, longitude, +location.lat, +location.lon)
        if (dist < closestDistance) {
          closestDistance = dist

          closestCity = location.name
          console.log(closestCity)
        }
      }

      successCallback({ closestCity, coordinates: { lat, lon } })
    },
    () => alert('Ort konte nicht ermittelt werden')
  )
}
