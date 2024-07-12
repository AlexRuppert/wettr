<script lang="ts">
  import { classProp, type CustomElement } from '@/logic/svelte.svelte'

  interface Props extends CustomElement {
    description: string
    instruction: string
    hintText: string
  }
  let { description, instruction, hintText, className, ...other }: Props =
    $props()
</script>

<div
  class={classProp('bg-surface-400 p-3 pr-6 leading-4', className)}
  {...other}
>
  <div>
    {description}
  </div>
  <p>
    <strong>{!!instruction ? hintText : ''}</strong><br />
    {instruction}
  </p>
</div>
