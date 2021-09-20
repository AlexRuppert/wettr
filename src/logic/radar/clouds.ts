import { ungzip } from 'pako/dist/pako'
import type { GeoBounds } from './utils'

const CLOUDS_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/clouds'
  : 'https://wettr-service.vercel.app/api/clouds'

function decodeClouds(clouds) {
  const result = []
  clouds.forEach(sector => {
    const lonFloor = sector.lon_bucket
    const latFloor = sector.lat_bucket

    const compressedMatrix = ungzip(
      Uint8Array.from(
        atob(sector.data)
          .split('')
          .map(c => c.charCodeAt(0))
      )
    )

    let index = 0
    for (let i = 0; i < compressedMatrix.length; i++) {
      const m = compressedMatrix[i]
      if (m & 128) {
        index += m & ~128
      } else {
        const lon = lonFloor + (index % 100) / 100
        const lat = latFloor + ((index / 100) | 0) / 100
        const value = m / 100
        result.push({ time: sector.time, lon, lat, value })
        index++
      }
    }
  })

  return result
}

async function fetchClouds(viewBounds: GeoBounds, onlyNow = false) {
  const cloudsRaw = await (
    await fetch(
      CLOUDS_URL +
        `?bounds=${viewBounds.lb.lon},${viewBounds.rt.lon},${
          viewBounds.lb.lat
        },${viewBounds.rt.lat}${onlyNow ? '&onlyNow=true' : ''}`
    )
  ).json()
  return decodeClouds(cloudsRaw)
}

export async function getClouds(viewBounds: GeoBounds, onlyNow = false) {
  const clouds = await fetchClouds(viewBounds, onlyNow)
  const times = [...new Set(clouds.map(c => c.time))].map(t => new Date(t))
  times.sort((a, b) => a.getTime() - b.getTime())
  return { times, clouds, viewBounds }
}

export function filterClouds(clouds: Cloud[], time: Date) {
  const isoTime = time.toISOString()
  return clouds.filter(c => c.time === isoTime)
}

export interface Cloud {
  time: string
  lon: number
  lat: number
  value: number
}
