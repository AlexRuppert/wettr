<script lang="ts">
  export let hidden = true
  export let click: (...args: any[]) => any = () => (hidden = false)
</script>

<div class="opacity-50 bg-dark-800 fixed inset-0 z-10" class:hidden on:click={click} />
