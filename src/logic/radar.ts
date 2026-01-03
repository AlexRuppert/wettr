import { transform } from 'ol/proj'
import { createColorMap } from '@/logic/colorMap'
import proj4 from './minProj4js'
import { register } from 'ol/proj/proj4'
// DWD DE1200 projection constants

export const GRID_CONSTANTS = {
  width: 1100,
  height: 1200,
  projection: 'DE1200',
  projStr:
    '+proj=stere +lat_0=90 +lat_ts=60 +lon_0=10 +a=6378137 +b=6356752.3142451802 +no_defs +x_0=543196.83521776402 +y_0=3622588.8619310018',
  extent: [-500, -1199500, 1099500, 500],
}
proj4.defs(GRID_CONSTANTS.projection, GRID_CONSTANTS.projStr)
register(proj4)
const colorMap = createColorMap([
  { offset: 0, color: '#000083' },
  { offset: 0.6, color: '#880077' },
  { offset: 0.9, color: '#aa0000' },
  { offset: 1, color: '#ffff01' },
])
function precipitation_to_rgba(precip: number) {
  // Normalize, using 2.5 mm in 5 minutes as maximum
  const normalized = Math.min(precip, 300) / 300

  const rgba = colorMap(normalized)
  if (rgba) {
    //console.log(precip, normalized)
  }
  // Make no rain fully transparent, use 50 - 204 alpha range (~0.2 - 0.8 opacity) for other values
  const alpha = Math.max(
    Math.min(normalized * 10, 0.8) * 255,
    precip > 5 ? 50 : 0,
  )
  rgba[3] = alpha
  return rgba
}

export async function drawImage(record) {
  // Create an OpenLayers source with PNG data URL from a given radar record
  const canvas = new OffscreenCanvas(
    GRID_CONSTANTS.width,
    GRID_CONSTANTS.height,
  )
  const ctx = canvas.getContext('2d')

  const [offsetX, offsetY] = transform(
    record.coordinates[0],
    'EPSG:4326',
    GRID_CONSTANTS.projection,
  )

  const bboxWidth = record.bbox[2] - record.bbox[0] + 1
  const bboxHeight = record.bbox[3] - record.bbox[1] + 1
  const imageData2 = ctx.createImageData(bboxWidth, bboxHeight)

  for (const [i, precip] of record.precipitation.entries()) {
    let rgba = precipitation_to_rgba(precip)
    imageData2.data[i * 4] = rgba[0]
    imageData2.data[i * 4 + 1] = rgba[1]
    imageData2.data[i * 4 + 2] = rgba[2]
    imageData2.data[i * 4 + 3] = rgba[3]
  }
  ctx.putImageData(imageData2, offsetX / 1000, -offsetY / 1000)
  const blob = await canvas.convertToBlob()

  return {
    timestamp: record.timestamp,
    projection: GRID_CONSTANTS.projection,
    extent: GRID_CONSTANTS.extent,
    blob: blob,
    urlImage: window.URL.createObjectURL(blob),
  }
}
