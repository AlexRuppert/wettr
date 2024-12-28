<script lang="ts">
  import { windDirection } from '@/components/icons/icons'
  import SvgIcon from '@/components/icons/SvgIcon.svelte'
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { clamp, cn } from '@/logic/utils'

  interface Props extends CustomElement {
    direction: number
    strength: number
  }
  let { direction, strength, class: className, ...other }: Props = $props()

  let scale = $derived(0.8 + clamp(strength / 20, 0, 1.7))
</script>

<div
  class={cn('outlined-path origin-center', className)}
  {...other}
  style="transform: scale({scale}) rotate({direction + 90}deg)"
>
  <SvgIcon d={windDirection} />
</div>
