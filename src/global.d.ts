/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelte.JSX {
  interface HTMLProps<T> {
    onswipe?: any
  }
}
import { HTMLAttributes } from 'svelte/elements'

declare module 'svelte/elements' {
  export interface HTMLAttributes<T> {
    onoutsideclick?: (event: CustomEvent) => void
  }
}
