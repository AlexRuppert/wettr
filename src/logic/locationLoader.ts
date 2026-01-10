import locationsUrl from '@/assets/locations.bin.json?url'
import { getCachedRequest } from '@/logic/cache'
import { defineFormat, Type } from 'tinybuf'
const UMLAUT_REPLACEMENTS = [
  { regex: /ä/g, replacement: 'a' },
  { regex: /ö/g, replacement: 'o' },
  { regex: /ü/g, replacement: 'u' },
  { regex: /ß/g, replacement: 'ss' },
]
export const loadLocations = async () => {
  const locationDecoderFormat = defineFormat({
    minLat: Type.UInt32,
    minLon: Type.UInt32,
    lons: [Type.UInt16],
    lats: [Type.UInt16],
    names: Type.String,
  })
  const locationList = await (
    await getCachedRequest(locationsUrl, 7 * 60 * 24)
  ).arrayBuffer()

  const decodedLocations = locationDecoderFormat.decode(locationList)
  const loadedLocations = []
  //@ts-ignore
  const locationNames = decodedLocations.names.split('%')
  //@ts-ignore
  for (let i = 0; i < decodedLocations.lons.length; i++) {
    let lon = (decodedLocations.lons[i] + decodedLocations.minLon) / 1000
    let lat = (decodedLocations.lats[i] + decodedLocations.minLat) / 1000
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
