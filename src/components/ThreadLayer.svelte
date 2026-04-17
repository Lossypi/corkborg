<!-- src/components/ThreadLayer.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { board } from '../stores/board'
  import { layer as layerStore } from '../stores/layer'
  import { viewport } from '../stores/viewport'
  import { computeSagPath } from '../lib/bezier'
  import Thread from './Thread.svelte'
  import Pin from './Pin.svelte'

  export let drawingFrom: string | null = null
  export let drawingTo: { x: number; y: number } | null = null
  export let editingThreadId: string | null = null

  const dispatch = createEventDispatcher<{ threadclick: string; labelsave: { id: string; label: string }; labelclose: void }>()

  const LAYER_COLORS: Record<string, string> = {
    lor:  '#8b2020',
    meta: '#1a4a8b',
  }

  function getPinPos(cardId: string): { x: number; y: number } | null {
    const card = $board.cards.find(c => c.id === cardId)
    if (!card) return null
    return { x: card.x + card.width / 2, y: card.y }
  }

  function threadOpacity(threadLayer: string): number {
    return threadLayer === $layerStore.active ? 1 : $layerStore.ghostOpacity
  }
</script>

<svg
  style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;pointer-events:none"
>
  <g transform="translate({$viewport.x},{$viewport.y}) scale({$viewport.scale})">
    {#each $board.threads as thread (thread.id)}
      {@const p1 = getPinPos(thread.from.cardId)}
      {@const p2 = getPinPos(thread.to.cardId)}
      {#if p1 && p2}
        <g style="pointer-events:all">
          <Thread
            {thread}
            x1={p1.x} y1={p1.y}
            x2={p2.x} y2={p2.y}
            color={LAYER_COLORS[thread.layer] ?? '#8b4513'}
            opacity={threadOpacity(thread.layer)}
            on:click={() => dispatch('threadclick', thread.id)}
          />
        </g>
      {/if}
    {/each}

    {#each $board.pins as pin (pin.id)}
      {@const pos = getPinPos(pin.cardId)}
      {#if pos}
        <Pin x={pos.x} y={pos.y} />
      {/if}
    {/each}

    <!-- In-progress thread preview while drawing -->
    {#if drawingFrom && drawingTo}
      {@const fromPos = getPinPos(drawingFrom)}
      {#if fromPos}
        {@const path = computeSagPath(fromPos.x, fromPos.y, drawingTo.x, drawingTo.y)}
        <path d={path.d} fill="none" stroke="#888" stroke-width="2" stroke-dasharray="6 4" />
      {/if}
    {/if}
  </g>
</svg>
