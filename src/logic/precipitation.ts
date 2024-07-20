import { type Coordinates } from './locations'
import { getCachedRequest } from '@/logic/cache'
import { trimCoordinates } from './utils'
import { inflate } from 'pako'
const ENDPOINT = 'https://api.brightsky.dev/'
let precipitationUrl = new URL(ENDPOINT + 'radar')

export async function getWeatherPrecipitation(coordinates: Coordinates) {
  precipitationUrl.search = new URLSearchParams({
    ...trimCoordinates(coordinates),
    distance: '19000',
    tz: 'Europe/Berlin',
  }).toString()

  const precipiationData = await (
    await getCachedRequest(precipitationUrl.toString(), 4)
  ).json()

  const processedPrecipiationData = processPrecipiationData(precipiationData)
  //console.log(processedPrecipiationData)
  return processedPrecipiationData
}

function processPrecipiationData(precipiationData) {
  const _15MinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000)

  const radar = precipiationData.radar
    .filter(r => new Date(r.timestamp) > _15MinutesAgo)
    .map(r => {
      const compressed = Uint8Array.from(atob(r.precipitation_5), c =>
        c.charCodeAt(0),
      )
      const precipitation = new Uint16Array(inflate(compressed).buffer)
      return {
        precipitation,
        timestamp: r.timestamp,
        bbox: precipiationData.bbox,
        coordinates: precipiationData.geometry?.coordinates,
      }
    })

  return radar
}
