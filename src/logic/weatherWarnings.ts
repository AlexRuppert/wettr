import hull from 'hull.js'
import { SimplifyAP } from 'simplify-ts'
import { getCachedRequest } from './cache'
import { sort } from './utils'
const WARNINGS_URL = `https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/gemeinde_warnings_v2.json`
export async function getWeatherWarnings(coordinates) {
  const rawData = await (await getCachedRequest(WARNINGS_URL, 19)).json()
  const warnings = processWarningData(rawData)
  return warnings
}
function keepWarning(warning, end, now) {
  return warning.level > 2 && end > now
}
function processWarningData(warningData) {
  const now = Date.now()
  let result = warningData.warnings
    .map(w => {
      return {
        event: formatEvent(w.event),
        description: w.description,
        time: { start: new Date(w.start), end: new Date(w.end) },
        instruction: w.instruction,
        level: w.level,
        type: w.type,
        regions: keepWarning(w, w.end, now)
          ? w.regions.map(r => readPolygons(r.polygon))
          : [],
        urls: w.urls,
      }
    })
    .filter(w => keepWarning(w, w.time.end, now))

  //by level and start time
  return sort(result, (a: any, b: any) => {
    const diff = a.level - b.level
    return diff === 0 ? a.time.start.getTime() - b.time.start.getTime() : diff
  })
}

function formatEvent(event) {
  return event.toLowerCase().replace(/(^|\s)\p{L}/gu, l => l.toUpperCase())
}

function readPolygons(polygon) {
  const lb = { lon: 100, lat: 100 }
  const rt = { lon: 0, lat: 0 }

  const coordinates = []
  //+2 because there are too many points anyways
  for (let i = 0; i < polygon.length / 2; i += 3) {
    const y = polygon[i * 2]
    const x = polygon[i * 2 + 1]

    coordinates.push([x, y])
  }

  const concaveHull = SimplifyAP(hull(coordinates, 0.1), 0.02, false)

  for (let i = 0; i < concaveHull.length; i++) {
    const [lon, lat] = concaveHull[i]
    if (lon < lb.lon) {
      lb.lon = lon
    } else if (lon > rt.lon) {
      rt.lon = lon
    }
    if (lat < lb.lat) {
      lb.lat = lat
    } else if (lat > rt.lat) {
      rt.lat = lat
    }
  }

  return {
    polygon: concaveHull,
    bounds: { lb, rt },
  }
}
