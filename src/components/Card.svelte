<!-- src/components/Card.svelte -->
<script lang="ts">
  import type { Card, LayerKey } from '../types'

  export let card: Card
  export let activeLayer: LayerKey
  export let ghostOpacity: number

  // Clip-path for card type (cut corner shape)
  const CLIPS: Record<string, string> = {
    generic:  'none',
    npc:      'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
    location: 'polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)',
    event:    'polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)',
    idea:     'polygon(0 0, 100% 0, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
  }

  $: clipPath = CLIPS[card.type] ?? 'none'
  $: isVisible = card.layers.includes(activeLayer)
  $: opacity = isVisible ? 1 : ghostOpacity
  $: content = isVisible ? card.content[activeLayer] : (card.content.lor || card.content.meta)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="card"
  style:width="{card.width}px"
  style:height="{card.height}px"
  style:clip-path={clipPath}
  style:opacity
  style:font-size="{card.fontSize}px"
>
  <div class="card-content">
    {content}
  </div>
</div>

<style>
  .card {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--card-bg, #faf0dc);
    border: 1px solid var(--card-border, #c8a060);
    border-radius: 2px;
    padding: 8px;
    transition: opacity 0.2s;
    box-shadow: 1px 2px 4px rgba(0,0,0,0.25);
  }
  .card-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.4;
    font-family: 'Segoe UI', sans-serif;
  }
</style>
