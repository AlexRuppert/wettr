<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  interface Props extends CustomElement {}

  let { class: className, children, ...other }: Props = $props()
</script>

<button
  class={[
    'clickable flex appearance-none items-center justify-center rounded-md p-1',
    className,
  ]}
  aria-label="Button"
  {...other}
>
  {@render children()}
</button>
