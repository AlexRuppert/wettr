<script lang="ts">
  export let label = 'Button'
</script>

<button
  class="bg-transparent border-none rounded flex h-10 p-1 w-10 appearance-none clickable items-center"
  on:click
  aria-label={label}
>
  <slot />
</button>

<style global>
  button {
    touch-action: manipulation;
  }
</style>
