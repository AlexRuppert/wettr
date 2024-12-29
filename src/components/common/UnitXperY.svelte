<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { toLocalDecimal } from '@/logic/utils'
  interface Props extends CustomElement {
    value?: number
    top: string
    bottom: string
  }

  let { value = 0, top, bottom, class: className, ...other }: Props = $props()
</script>

<div class={['flex items-center space-x-0.5', className]} {...other}>
  <div class="text-right">{toLocalDecimal(value)}</div>
  <div class="text-[0.6em]">
    {#if top === bottom}
      <span>{top}</span>
    {:else}
      <sup>{top}</sup>/<sub>{bottom}</sub>
    {/if}
  </div>
</div>
