import { getCachedRequest } from './cache'

let holidaysUrl = new URL('https://openholidaysapi.org/PublicHolidays')
// sorted according to https://opendatalab.de/projects/geojson-utilities/
const stateLookup = [
  'BW',
  'BY',
  'BE',
  'BB',
  'HB',
  'HH',
  'HE',
  'RP',
  'MV',
  'NI',
  'NW',
  'SL',
  'SN',
  'ST',
  'SH',
  'TH',
].map(el => 'DE-' + el)

export async function getHolidays(state: number) {
  const now = new Date()
  holidaysUrl.search = new URLSearchParams({
    countryIsoCode: 'DE',
    languageIsoCode: 'DE',
    subdivisionCode: stateLookup[state] ?? stateLookup[0],
    validFrom: `${now.getFullYear()}-01-01`,
    validTo: `${now.getFullYear() + 1}-01-31`,
  }).toString()
  return processHolidayData(
    await (await getCachedRequest(holidaysUrl.toString(), 31 * 24 * 60)).json(),
  )
}

function processHolidayData(data) {
  return data.map(d => ({
    startDate: new Date(d.startDate),
    endDate: new Date(d.endDate),
    name: d.name[0].text,
    nationwide: d.nationwide,
  }))
}
