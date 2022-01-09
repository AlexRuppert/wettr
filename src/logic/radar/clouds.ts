import { ungzip } from 'pako/lib/inflate'
import { getCachedRequest } from '../cache'
import type { GeoBounds } from './utils'
import { mercatorProjection } from './utils'
import { isInBounds } from './utils'

const CLOUDS_URL =
  /*import.meta.env.DEV
  ? 'http://localhost:3001/api/clouds'
  : */ 'https://wettr-service.vercel.app/api/clouds'

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

function addMinutes(date, minutes) {
  const _date = new Date(date)
  return new Date(_date.setMinutes(_date.getMinutes() + minutes))
}

function getTimes() {
  const nowIso = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const minute = +nowIso.match(/:(\d\d):/)[1]
  const startMinute = ((minute / 15) | 0) * 15
  const baseTime = addMinutes(
    new Date(nowIso.substring(0, 13) + ':00:00Z'),
    startMinute
  )
  return [...Array(9)].map((_, i) => addMinutes(baseTime, i * 15))
}

async function fetchClouds(viewBounds: GeoBounds, onlyNow = false) {
  const cloudsRaw = await (
    await getCachedRequest(
      CLOUDS_URL +
        `?bounds=${viewBounds.lb.lon},${viewBounds.rt.lon},${
          viewBounds.lb.lat
        },${viewBounds.rt.lat}${onlyNow ? '&onlyNow=true' : ''}`,
      9
    )
  ).json()
  return decodeClouds(cloudsRaw)
}

export async function getClouds(viewBounds: GeoBounds, onlyNow = false) {
  let clouds = (await fetchClouds(viewBounds, onlyNow))
    .filter(cell => isInBounds(cell, viewBounds))
    .map(cell => ({ ...cell, projected: mercatorProjection(viewBounds, cell) }))

  clouds.sort((a, b) => a.value - b.value)

  clouds = Array.from(
    new Map(
      clouds.map(cell => [
        `${cell.time} ${(cell.projected.x * 1e4) | 0} ${
          (cell.projected.y * 1e4) | 0
        }`,
        cell,
      ])
    ).values()
  )
  //const times = [...new Set(clouds.map(c => c.time))].map(t => new Date(t))
  //times.sort((a, b) => a.getTime() - b.getTime())
  const times = getTimes()
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
