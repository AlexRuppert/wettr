<svelte:options immutable />

<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte'
  interface Props extends CustomElement {
    label?: string
  }

  let { label = 'Button', className = '', ...other } = $props<Props>()
</script>

<button
  class={classProp(
    'clickable flex size-10 appearance-none items-center rounded-default border-none bg-transparent p-1',
    className,
  )}
  aria-label={label}
  {...other}
>
  <slot />
</button>
