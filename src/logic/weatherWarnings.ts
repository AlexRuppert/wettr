import { getCachedRequest } from '@/logic/cache'
import { sortBy, trimCoordinates } from '@/logic/utils'
import { Coordinates } from './locations'
const ENDPOINT = `https://api.brightsky.dev/`
let weatherWarningsUrl = new URL(ENDPOINT + 'alerts')

export async function getWeatherWarnings(coordinates: Coordinates) {
  weatherWarningsUrl.search = new URLSearchParams({
    ...trimCoordinates(coordinates),
  }).toString()

  const rawData = await (await getCachedRequest(weatherWarningsUrl, 19)).json()
  return processWarningData(rawData)
}

function severityToRank(severity: string) {
  const dict = {
    minor: 1,
    moderate: 2,
    severe: 3,
    extreme: 4,
  }
  return dict[severity] ?? 0
}
function urgencyToRank(urgency: string) {
  const dict = {
    future: 1,
    immediate: 2,
  }
  return dict[urgency] ?? 0
}
function processWarningData(warningData) {
  const now = Date.now()
  let result: any[] = warningData.alerts
    .map(a => {
      return {
        event: formatEvent(a.event_de) ?? '',
        description: a.description_de ?? '',
        time: { start: new Date(a.onset), end: new Date(a.expires) },
        instruction: a.instruction_de ?? '',
        certainty: a.certainty,
        severity: a.severity,
        severityRank: severityToRank(a.severety),
        urgency: a.urgency,
        urgencyRank: urgencyToRank(a.urgency),
        responseType: a.response_type,
        category: a.category,
        type: a.event_code, //
      }
    })
    .filter(w => w.time.end > now)

  return result.toSorted(
    sortBy(
      (a: any, b: any) => b.severityRank - a.severityRank,
      (a: any, b: any) => a.severityRank - b.severityRank,
      (a: any, b: any) => a.time.start.getTime() - b.time.start.getTime(),
    ),
  )
}

function formatEvent(event) {
  return event.toLowerCase().replace(/(^|\s)\p{L}/gu, l => l.toUpperCase())
}
