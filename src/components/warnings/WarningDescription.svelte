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

<div class={classProp('hyphens-auto p-2 leading-5', className)} {...other}>
  <div>
    {description}
  </div>
  <div class="my-1 whitespace-pre-wrap pt-1">
    <strong class="leading-5 underline">{!!texts ? hintText : ''}</strong>
    {#each texts as text, i}
      <p>
        {text.trim()}
        {#if links[i]}
          <a class="underline" href={links[i]} target="_blank">{links[i]}</a>
        {/if}
      </p>
    {/each}
  </div>
</div>

<style>
</style>
