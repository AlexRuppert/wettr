<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { fade } from 'svelte/transition'

  interface Props extends CustomElement {
    show?: boolean
    onclose: () => void
  }

  let { show = false, onclose, className = '', ...other }: Props = $props()

  function close(e: Event) {
    e.stopPropagation()
    onclose()
  }
</script>

{#if show}
  <div
    aria-hidden="true"
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 z-20 bg-gray-900/60 backdrop-blur-sm"
    onclick={close}
  ></div>
{/if}
