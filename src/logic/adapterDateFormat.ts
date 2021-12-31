/**
 * This app does not need complex time manipulation or IE support, so we can avoid importing date-fns and save some bytes
 */
import { _adapters } from 'chart.js'

const MS_IN_H = 60 * 60 * 1000
_adapters._date.override({
  _id: 'date-fns',

  formats() {
    return {}
  },
  parse(time) {
    //@ts-ignore
    return new Date(time).getTime()
  },
  format(time) {
    const date = new Date(time).getHours()
    return date < 10 ? '0' + date : date + ''
  },
  add(time) {
    return time + MS_IN_H
  },
  diff(max, min) {
    return Math.floor((max - min) / MS_IN_H)
  },
  //@ts-ignore
  startOf(time) {
    const date = new Date(time)
    date.setMinutes(0, 0, 0)
    return date
  },
  endOf() {
    return 0
  },
})
