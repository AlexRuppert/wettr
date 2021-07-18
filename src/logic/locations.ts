import locationList from '../assets/locations'

export interface Coordinates {
  lat: number
  lon: number
}

export const locations = (() => {
  const minLat = +locationList[0]
  const minLon = +locationList[1]
  const coordinatesString = locationList[2] as string
  const places = (locationList[3] as string).split('|')
  const locations = []
  let lat = 0
  for (let i = 0; i < coordinatesString.length / 3; i++) {
    const buffer = coordinatesString.substr(i * 3, 3)
    let num = +buffer / 100
    if (i % 2 === 0) {
      //lat
      num += minLat
      lat = num
    } else {
      num += minLon
      let name = places[Math.floor(i / 2)]
      locations.push({
        name,
        lat,
        lon: num,
        search: name
          .split(/,|(\sbei|am|in\s)/)[0]
          .trim()
          .toLowerCase(),
      })
    }
  }
  return locations
})()

export function filterLocations(search: string, maxResults = 5) {
  search = search.trim().toLowerCase()
  if (search.length <= 0)
    return ['Berlin', 'München', 'Düsseldorf', 'Hamburg', 'Stuttgart']
  return locations
    .filter(l => l.search.includes(search))
    .slice(0, maxResults)
    .map(s => s.name)
}

export function getLocationCoordinates(place: string) {
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
        }
      }

      successCallback({ closestCity, coordinates: { lat, lon } })
    },
    () => alert('Ort konte nicht ermittelt werden')
  )
}
