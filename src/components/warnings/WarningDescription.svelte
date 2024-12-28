<script lang="ts">
  import { type CustomElement } from '@/logic/svelte.svelte'
  import { cn } from '@/logic/utils'

  interface Props extends CustomElement {
    description: string
    instruction: string
    hintText: string
  }
  let {
    description,
    instruction,
    hintText,
    class: className,
    ...other
  }: Props = $props()

  const LINK_REGEX = /(https?:\/\/\S+)|(www\.\S+)/gm

  let texts = $derived(instruction?.split(LINK_REGEX) ?? [])
  let links = $derived(instruction?.match(LINK_REGEX) ?? [])
</script>

<div class={cn('p-2 leading-5 hyphens-auto', className)} {...other}>
  <div>
    {description}
  </div>
  <div class="my-1 pt-1 whitespace-pre-wrap">
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
