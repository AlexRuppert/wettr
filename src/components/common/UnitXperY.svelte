<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'
  interface Props extends CustomElement {
    top: string
    bottom: string
  }

  let { top, bottom, className = '', ...other }: Props = $props()
</script>

<div
  class={classProp('self-center pt-0.5 text-[0.6rem]', className)}
  {...other}
>
  <sup>{top}</sup>/<sub>{bottom}</sub>
</div>
