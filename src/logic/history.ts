import { Coordinates } from '@/logic/locations'

let data = { history: [] }
const MAX_ITEMS = 7
function loadHistory() {
  data = localStorage.wettr ? JSON.parse(localStorage.wettr) : { history: [] }
}
function saveHistory() {
  localStorage.wettr = JSON.stringify(data)
}
export function getHistory() {
  return data?.history ?? []
}

export function pushHistory(location: string, { lon, lat }: Coordinates) {
  const coordinates = { lon, lat }

  data.history = [
    { location, coordinates },
    ...data.history
      .filter(el => el.location !== location)
      .slice(0, MAX_ITEMS - 1),
  ]
  saveHistory()
}

loadHistory()
