<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn } from '@/logic/utils'
  interface Props extends CustomElement {
    label?: string
  }

  let {
    label = 'Button',
    class: className,
    children,
    ...other
  }: Props = $props()
</script>

<button
  class={cn(
    'clickable rounded-default flex size-10 appearance-none items-center justify-center border-none bg-transparent p-1',
    className,
  )}
  aria-label={label}
  {...other}
>
  {@render children()}
</button>
