let history = []
const MAX_ITEMS = 3
function loadHistory() {
  history = JSON.parse(localStorage.history || '[]')
}
function saveHistory() {
  localStorage.history = JSON.stringify(history)
}
export function getHistory() {
  return history
}

export function pushHistory(place: string) {
  history = [place, ...history.filter(el => el !== place).slice(0, MAX_ITEMS-1)]
  saveHistory()
}

loadHistory()