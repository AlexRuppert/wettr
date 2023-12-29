<svelte:options immutable />

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  const dispatch = createEventDispatcher()

  function close() {
    dispatch('close')
  }
  export let show = false
</script>

{#if show}
  <div
    aria-hidden="true"
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 z-20 bg-gray-900/60"
    on:click|stopPropagation={close}
  />
{/if}

<style global>
</style>
