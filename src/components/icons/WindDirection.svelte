<svelte:options immutable />

<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte'
  import { clamp } from '@/logic/utils'
  import { windDirection } from '@/components/icons/icons'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'

  interface Props extends CustomElement {
    direction: number
    strength: number
  }
  let { direction, strength, className = '', ...other } = $props<Props>()

  let scale = $derived(0.8 + clamp(strength / 20, 0, 1.7))
</script>

<div
  class={classProp('outlined-path origin-center', className)}
  {...other}
  style="transform: scale({scale}) rotate({direction + 90}deg)"
>
  <SvgIcon d={windDirection} outline />
</div>
