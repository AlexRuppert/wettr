<svelte:options immutable />

<script lang="ts">
  export let label = 'Button'
</script>

<button
  class="{$$props.class ||
    ''} clickable flex h-10 w-10 appearance-none items-center rounded border-none bg-transparent p-1"
  on:click
  aria-label={label}
>
  <slot />
</button>
