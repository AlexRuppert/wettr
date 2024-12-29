<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { fade } from 'svelte/transition'

  interface Props extends CustomElement {
    show?: boolean
    onclose: () => void
  }

  let { show = $bindable(false), onclose, ...other }: Props = $props()

  function close(e?: Event) {
    e?.stopPropagation()
    show = false
  }

  $effect.pre(() => {
    document.body.style.overflow = show ? 'hidden' : 'auto'
    if (!show) {
      onclose?.()
    }
  })
</script>

{#if show}
  <div
    aria-hidden="true"
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 z-20 bg-gray-900/60 backdrop-blur-xs"
    onclick={close}
  ></div>
{/if}
