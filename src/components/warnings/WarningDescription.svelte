<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'

  interface Props extends CustomElement {
    description: string
    instruction: string
    hintText: string
  }
  let { description, instruction, hintText, className, ...other }: Props =
    $props()

  const LINK_REGEX = /(https?:\/\/\S+)|(www\.\S+)/gm

  let texts = $derived(instruction?.split(LINK_REGEX) ?? [])
  let links = $derived(instruction?.match(LINK_REGEX) ?? [])
</script>

<div
  class={classProp('bg-surface-400 p-3 pr-6 leading-4', className)}
  {...other}
>
  <div>
    {description}
  </div>
  <p class="my-1 hyphens-auto whitespace-pre-wrap pt-1">
    <strong>{!!texts ? hintText : ''}</strong><br />
    {#each texts as text, i}
      {text.trim()}
      {#if links[i]}
        <a class="underline" href={links[i]} target="_blank">{links[i]}</a>
      {/if}
    {/each}
  </p>
</div>

<style>
</style>
