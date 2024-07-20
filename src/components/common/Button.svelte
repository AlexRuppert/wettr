<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
  interface Props extends CustomElement {
    label?: string
  }

  let { label = 'Button', className = '', children, ...other }: Props = $props()
</script>

<button
  class={classProp(
    'clickable flex size-10 appearance-none items-center justify-center rounded-default border-none bg-transparent p-1',
    className,
  )}
  aria-label={label}
  {...other}
>
  {@render children()}
</button>
