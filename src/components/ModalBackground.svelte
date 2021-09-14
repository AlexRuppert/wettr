<script lang="ts">
  export let hidden = true
  export let click: (...args: any[]) => any = () => (hidden = false)
</script>

<div class="opacity-0 fixed inset-0 z-10" class:hidden on:click={click} />
