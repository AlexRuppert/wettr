type ClassString = string | object | ClassString[]
export interface CustomElement {
  class?: ClassString
  [k: string]: any
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
