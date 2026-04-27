<!-- src/components/Minimap.svelte -->
<script lang="ts">
  import { board } from '../stores/board'
  import { viewport } from '../stores/viewport'
  import { layer as layerStore } from '../stores/layer'
  import { LAYER_TOKENS } from '../lib/theme'

  const MM_W = 190
  const MM_H = 120
  const SCALE = 1 / 20

  $: tokens = LAYER_TOKENS[$layerStore.active]

  $: vpW = (window.innerWidth  / $viewport.scale) * SCALE
  $: vpH = (window.innerHeight / $viewport.scale) * SCALE
  $: vpX = (-$viewport.x / $viewport.scale) * SCALE
  $: vpY = (-$viewport.y / $viewport.scale) * SCALE

  function getPinPos(cardId: string) {
    const card = $board.cards.find(c => c.id === cardId)
    if (!card) return null
    return { x: (card.x + card.width / 2) * SCALE, y: (card.y + 14) * SCALE }
  }

  function onClick(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const worldX = (e.clientX - rect.left) / SCALE
    const worldY = (e.clientY - rect.top) / SCALE
    viewport.setPan(
      window.innerWidth  / 2 - worldX * $viewport.scale,
      window.innerHeight / 2 - worldY * $viewport.scale,
    )
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
  class="minimap"
  style:border-color={tokens.accent}
  on:click={onClick}
>
  <svg width={MM_W} height={MM_H}>
    <!-- Threads -->
    {#each $board.threads as thread (thread.id)}
      {@const p1 = getPinPos(thread.from.cardId)}
      {@const p2 = getPinPos(thread.to.cardId)}
      {#if p1 && p2}
        <line
          x1={p1.x} y1={p1.y}
          x2={p2.x} y2={p2.y}
          stroke={LAYER_TOKENS[thread.layer].thread}
          stroke-width="1"
          opacity="0.6"
        />
      {/if}
    {/each}

    <!-- Cards -->
    {#each $board.cards as card (card.id)}
      <rect
        x={card.x * SCALE}
        y={card.y * SCALE}
        width={card.width * SCALE}
        height={card.height * SCALE}
        fill={LAYER_TOKENS[$layerStore.active].paperMain}
        stroke={tokens.accent}
        stroke-width="0.5"
        rx="1"
        opacity={card.layers.includes($layerStore.active) ? 0.9 : 0.25}
      />
    {/each}

    <!-- Viewport indicator -->
    <rect
      x={vpX}
      y={vpY}
      width={vpW}
      height={vpH}
      fill={tokens.accent}
      fill-opacity="0.08"
      stroke={tokens.accent}
      stroke-width="1"
      stroke-dasharray="3 2"
    />
  </svg>
</div>

<style>
  .minimap {
    position: fixed;
    bottom: 16px;
    right: 16px;
    width: 190px;
    height: 120px;
    background: rgba(20,14,6,0.9);
    border: 1px solid;
    border-radius: 2px;
    cursor: crosshair;
    z-index: 500;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }
</style>
