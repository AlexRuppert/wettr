<svelte:options immutable />

<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte'
  interface Props extends CustomElement {
    top: string
    bottom: string
  }

  let { top, bottom, className = '', ...other } = $props<Props>()
</script>

<div
  class={classProp('self-center pt-0.5 text-[0.6rem]', className)}
  {...other}
>
  <sup>{top}</sup>/<sub>{bottom}</sub>
</div>
