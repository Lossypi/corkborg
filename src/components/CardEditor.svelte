<!-- src/components/CardEditor.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Card, LayerKey } from '../types'

  export let card: Card
  export let activeLayer: LayerKey

  const dispatch = createEventDispatcher<{ save: { content: string }; close: void }>()

  let text = card.content[activeLayer]

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') dispatch('close')
  }

  function onBlur() {
    dispatch('save', { content: text })
    dispatch('close')
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<textarea
  bind:value={text}
  autofocus
  on:keydown={onKeyDown}
  on:blur={onBlur}
  style:font-size="{card.fontSize}px"
/>

<style>
  textarea {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    resize: none;
    outline: none;
    padding: 8px;
    font-family: 'Segoe UI', sans-serif;
    line-height: 1.4;
    cursor: text;
    z-index: 1;
  }
</style>
