import { serializeCoordinates } from './locations'

let data = { history: [] }
const MAX_ITEMS = 4
function loadHistory() {
  data = localStorage.wettr ? JSON.parse(localStorage.wettr) : { history: [] }
}
function saveHistory() {
  localStorage.wettr = JSON.stringify(data)
}
export function getHistory() {
  return data?.history ?? []
}

export function pushHistory(location, { lon, lat }) {
  const coordinates = { lon, lat }
  const serCoordinates = serializeCoordinates(coordinates)
  data.history = [
    { location, coordinates },
    ...data.history
      .filter(el => serializeCoordinates(el.coordinates) !== serCoordinates)
      .slice(0, MAX_ITEMS - 1),
  ]
  saveHistory()
}

loadHistory()
