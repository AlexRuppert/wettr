<script lang="ts" generics="TComponent extends Component">
  import type { Component, ComponentProps, Snippet } from 'svelte'

  let lazyComponent: Promise<{ default: TComponent }> = $state(null)
  let {
    loadFn,
    loadIsTriggered,
    params = $bindable(),
    children,
    loaderElement,
  } = $props<{
    loadFn: () => Promise<{ default: TComponent }>
    loadIsTriggered: boolean
    params: ComponentProps<TComponent>
    children?: Snippet
    loaderElement?: Snippet
  }>()

  function loadComponent() {
    lazyComponent = loadFn()
  }
  $effect(() => {
    if (loadIsTriggered && !lazyComponent) {
      loadComponent()
    }
  })
</script>

{#if lazyComponent}
  {#await lazyComponent}
    {@render loaderElement?.()}
  {:then { default: c }}
    {@const Component = c}
    <Component {...params as ComponentProps<TComponent>} />
  {/await}
{:else}
  {@render children?.()}
{/if}
