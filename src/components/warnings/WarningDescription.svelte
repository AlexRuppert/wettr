<script lang="ts">
  export let description
  export let instruction
  export let hintText
</script>

<div class="p-3 pr-6 leading-4">
  <div>
    {description}
  </div>
  <p>
    <strong>{!!instruction ? hintText : ''}</strong><br />
    {instruction}
  </p>
</div>
<style global>
</style>