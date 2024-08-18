export interface CustomElement {
  className?: string
  [k: string]: any
}

export function classProp(baseClass: string, classString: string) {
  return baseClass + ' ' + (classString ?? '')
}

export function once(fn: { call: (arg0: any, arg1: any) => void }) {
  return function (event: Event) {
    if (fn) fn.call(this, event)
    fn = null
  }
}

export function preventDefault(fn: { call: (arg0: any, arg1: any) => void }) {
  return function (event: Event) {
    event.preventDefault()
    fn.call(this, event)
  }
}

export function stopPropagation(fn: { call: (arg0: any, arg1: any) => void }) {
  return function (event: Event) {
    event.stopPropagation()
    fn.call(this, event)
  }
}

export function stopImmediatePropagation(fn: {
  call: (arg0: any, arg1: any) => void
}) {
  return function (event: Event) {
    event.stopImmediatePropagation()
    fn.call(this, event)
  }
}

export function writable<T>(initial: T) {
  let value = $state<T>(initial)

  return {
    get value() {
      return value
    },
    set value(val) {
      value = val
    },
  }
}

export function get<T>(w: { value: T }) {
  return { ...w.value } //shallow clone
}
