<!-- src/components/Minimap.svelte -->
<script lang="ts">
  import { board } from '../stores/board'
  import { viewport } from '../stores/viewport'

  const MM_W = 160
  const MM_H = 110
  const SCALE = 1 / 20  // 1 world unit = 0.05 minimap px

  $: vpW = (window.innerWidth / $viewport.scale) * SCALE
  $: vpH = (window.innerHeight / $viewport.scale) * SCALE
  $: vpX = (-$viewport.x / $viewport.scale) * SCALE
  $: vpY = (-$viewport.y / $viewport.scale) * SCALE

  function onClick(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const mmX = e.clientX - rect.left
    const mmY = e.clientY - rect.top
    const worldX = mmX / SCALE
    const worldY = mmY / SCALE
    viewport.setPan(
      window.innerWidth / 2 - worldX * $viewport.scale,
      window.innerHeight / 2 - worldY * $viewport.scale,
    )
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="minimap" on:click={onClick}>
  <svg width={MM_W} height={MM_H}>
    {#each $board.cards as card (card.id)}
      <rect
        x={card.x * SCALE}
        y={card.y * SCALE}
        width={card.width * SCALE}
        height={card.height * SCALE}
        fill="#e8c890"
        stroke="#a07030"
        stroke-width="0.5"
        rx="1"
      />
    {/each}

    <!-- Viewport indicator -->
    <rect
      x={vpX}
      y={vpY}
      width={vpW}
      height={vpH}
      fill="none"
      stroke="#333"
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
    width: 160px;
    height: 110px;
    background: rgba(200, 169, 123, 0.85);
    border: 1px solid #a07030;
    border-radius: 4px;
    cursor: crosshair;
    z-index: 500;
    overflow: hidden;
    box-shadow: 1px 2px 6px rgba(0,0,0,0.3);
  }
</style>
