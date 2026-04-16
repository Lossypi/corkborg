<!-- src/components/Canvas.svelte -->
<script lang="ts">
  import { viewport } from '../stores/viewport'
  import { board } from '../stores/board'
  import { layer as layerStore } from '../stores/layer'
  import { screenToWorld } from '../lib/geometry'
  import { makeCard } from '../lib/cardFactory'
  import { computeGravityOffset } from '../lib/gravity'
  import Card from './Card.svelte'
  import CardEditor from './CardEditor.svelte'
  import type { Card as CardType } from '../types'

  let isSpaceDown = false
  let isPanning = false
  let panStart = { x: 0, y: 0 }
  let panOrigin = { x: 0, y: 0 }

  // Card drag (RMB)
  let draggingId: string | null = null
  let dragCardOrigin = { x: 0, y: 0 }
  let dragMouseStart = { x: 0, y: 0 }

  // Editing
  let editingId: string | null = null

  function toWorld(e: MouseEvent) {
    return screenToWorld(e.clientX, e.clientY, $viewport)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space' && !e.repeat && editingId === null) {
      isSpaceDown = true
      e.preventDefault()
    }
  }
  function onKeyUp(e: KeyboardEvent) {
    if (e.code === 'Space') isSpaceDown = false
  }

  // Double-click on canvas background → create card
  function onDblClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.classList.contains('canvas-root') && !target.classList.contains('canvas-world')) return
    const world = toWorld(e)
    const pos = computeGravityOffset(world.x, world.y, $board.cards)
    const card = makeCard(pos.x, pos.y, $layerStore.active)
    board.addCard(card)
    board.bringToFront(card.id)
    editingId = card.id
  }

  function onMouseDown(e: MouseEvent) {
    // Canvas pan
    if (isSpaceDown || e.button === 1) {
      isPanning = true
      panStart = { x: e.clientX, y: e.clientY }
      panOrigin = { x: $viewport.x, y: $viewport.y }
      e.preventDefault()
    }
  }

  function onCardMouseDown(e: MouseEvent, card: CardType) {
    if (e.button === 2) {
      // RMB drag to move
      draggingId = card.id
      dragCardOrigin = { x: card.x, y: card.y }
      dragMouseStart = { x: e.clientX, y: e.clientY }
      board.bringToFront(card.id)
      e.preventDefault()
      e.stopPropagation()
    } else if (e.button === 0) {
      board.bringToFront(card.id)
    }
  }

  function onCardClick(e: MouseEvent, card: CardType) {
    if (e.button !== 0) return
    editingId = card.id
    e.stopPropagation()
  }

  function onMouseMove(e: MouseEvent) {
    if (isPanning) {
      viewport.setPan(
        panOrigin.x + (e.clientX - panStart.x),
        panOrigin.y + (e.clientY - panStart.y),
      )
    }
    if (draggingId) {
      const dx = (e.clientX - dragMouseStart.x) / $viewport.scale
      const dy = (e.clientY - dragMouseStart.y) / $viewport.scale
      board.updateCard(draggingId, {
        x: dragCardOrigin.x + dx,
        y: dragCardOrigin.y + dy,
      })
    }
  }

  function onMouseUp(e: MouseEvent) {
    isPanning = false
    draggingId = null
  }

  function onWheel(e: WheelEvent) {
    if (e.shiftKey) return
    e.preventDefault()
    viewport.zoom(e.deltaY < 0 ? 1.1 : 0.9, e.clientX, e.clientY)
  }

  function onCardShiftWheel(e: WheelEvent, card: CardType) {
    if (!e.shiftKey) return
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY < 0 ? 1 : -1
    const newSize = Math.max(8, Math.min(48, card.fontSize + delta))
    board.updateCard(card.id, { fontSize: newSize })
  }

  function onEditorSave(cardId: string, content: string) {
    const existingCard = $board.cards.find(c => c.id === cardId)
    if (!existingCard) return
    board.updateCard(cardId, {
      content: { ...existingCard.content, [$layerStore.active]: content }
    })
  }

  $: transform = `translate(${$viewport.x}px, ${$viewport.y}px) scale(${$viewport.scale})`
</script>

<svelte:window
  on:keydown={onKeyDown}
  on:keyup={onKeyUp}
  on:mouseup={onMouseUp}
  on:mousemove={onMouseMove}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="canvas-root"
  class:panning={isPanning}
  on:mousedown={onMouseDown}
  on:wheel={onWheel}
  on:dblclick={onDblClick}
  on:contextmenu|preventDefault
>
  <div class="canvas-world" style:transform>
    {#each $board.cards as card (card.id)}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="card-wrapper"
        style:left="{card.x}px"
        style:top="{card.y}px"
        style:z-index={card.zIndex}
        on:mousedown={e => onCardMouseDown(e, card)}
        on:click={e => onCardClick(e, card)}
        on:wheel={e => onCardShiftWheel(e, card)}
        on:contextmenu|preventDefault
      >
        <Card
          {card}
          activeLayer={$layerStore.active}
          ghostOpacity={$layerStore.ghostOpacity}
        />
        {#if editingId === card.id}
          <CardEditor
            {card}
            activeLayer={$layerStore.active}
            on:save={e => onEditorSave(card.id, e.detail.content)}
            on:close={() => (editingId = null)}
          />
        {/if}
      </div>
    {/each}
    <slot />
  </div>
</div>

<style>
  .canvas-root {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
  }
  .canvas-root.panning { cursor: grabbing; }
  .canvas-world {
    position: absolute;
    top: 0; left: 0;
    transform-origin: 0 0;
    width: 0; height: 0;
  }
  .card-wrapper {
    position: absolute;
  }
</style>
