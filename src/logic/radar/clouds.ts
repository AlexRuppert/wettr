import { ungzip } from 'pako/dist/pako'
import type { GeoBounds } from './utils'

const CLOUDS_URL = 'http://localhost:3001/api/clouds'
const BOUNDS = {
  lb: {
    lon: 3.5889,
    lat: 46.9526,
  },
  rt: {
    lon: 15.7208,
    lat: 54.7405,
  },
}

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
        result.push({time: sector.time, lon, lat, value })
        index++
      }
    }
  })

  return result
}

export async function getClouds(viewBounds: GeoBounds, onlyNow = false) {
  const cloudsRaw = await (
    await fetch(
      CLOUDS_URL +
        `?bounds=${viewBounds.lb.lon},${viewBounds.rt.lon},${viewBounds.lb.lat},${viewBounds.rt.lat}&onlyNow=${onlyNow}`
    )
  ).json()
  return decodeClouds(cloudsRaw)
}
