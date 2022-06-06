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
    transition:fade={{ duration: 200 }}
    class="bg-dark-800/90 inset-0 z-20 fixed"
    on:click|stopPropagation={close}
  />
{/if}
<style global>
  
</style>