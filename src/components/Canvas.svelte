<!-- src/components/Canvas.svelte -->
<script lang="ts">
  import { viewport } from '../stores/viewport'
  import { board } from '../stores/board'
  import { layer as layerStore } from '../stores/layer'
  import { screenToWorld } from '../lib/geometry'
  import { makeCard } from '../lib/cardFactory'
  import { makeThread, makePin } from '../lib/threadFactory'
  import { computeGravityOffset } from '../lib/gravity'
  import Card from './Card.svelte'
  import CardEditor from './CardEditor.svelte'
  import TypeSelector from './TypeSelector.svelte'
  import type { Card as CardType } from '../types'
  import ThreadLayer from './ThreadLayer.svelte'

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

  // Type selector
  let typeSelectorCardId: string | null = null

  // Thread drawing
  let drawingThread = false
  let threadFromCard: string | null = null
  let threadMousePos = { x: 0, y: 0 }

  const EDGE_HIT_PX = 14

  // Thread editing (Task 13)
  let editingThreadId: string | null = null

  function toWorld(e: MouseEvent) {
    return screenToWorld(e.clientX, e.clientY, $viewport)
  }

  function isOnCardEdge(
    e: MouseEvent,
    card: { x: number; y: number; width: number; height: number },
  ): boolean {
    const world = toWorld(e)
    const dx = world.x - card.x
    const dy = world.y - card.y
    const w = card.width
    const h = card.height
    const near =
      dx < EDGE_HIT_PX || dx > w - EDGE_HIT_PX ||
      dy < EDGE_HIT_PX || dy > h - EDGE_HIT_PX
    const inside = dx > 0 && dx < w && dy > 0 && dy < h
    return near && inside
  }

  function getCardAtWorld(wx: number, wy: number): import('../types').Card | null {
    return [...$board.cards].reverse().find(c =>
      wx >= c.x && wx <= c.x + c.width &&
      wy >= c.y && wy <= c.y + c.height
    ) ?? null
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
    typeSelectorCardId = null
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
      draggingId = card.id
      dragCardOrigin = { x: card.x, y: card.y }
      dragMouseStart = { x: e.clientX, y: e.clientY }
      board.bringToFront(card.id)
      e.preventDefault()
      e.stopPropagation()
    } else if (e.button === 0) {
      if (isOnCardEdge(e, card)) {
        // Start drawing thread
        drawingThread = true
        threadFromCard = card.id
        threadMousePos = toWorld(e)
        e.preventDefault()
        e.stopPropagation()
        return
      }
      board.bringToFront(card.id)
    }
  }

  function onCardClick(e: MouseEvent, card: CardType) {
    if (e.button !== 0) return
    editingId = card.id
    e.stopPropagation()
  }

  function onCardContextMenu(e: MouseEvent, card: CardType) {
    e.preventDefault()
    e.stopPropagation()
    // Only open selector if mouse didn't move much (not a drag)
    const dx = Math.abs(e.clientX - dragMouseStart.x)
    const dy = Math.abs(e.clientY - dragMouseStart.y)
    if (dx < 5 && dy < 5) {
      typeSelectorCardId = typeSelectorCardId === card.id ? null : card.id
    }
    draggingId = null
  }

  function onTypeSelect(cardId: string, type: import('../types').CardType) {
    board.updateCard(cardId, { type })
    typeSelectorCardId = null
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
    if (drawingThread) {
      threadMousePos = toWorld(e)
    }
  }

  function onMouseUp(e: MouseEvent) {
    if (drawingThread && threadFromCard) {
      const world = toWorld(e)
      const target = getCardAtWorld(world.x, world.y)
      if (target && target.id !== threadFromCard) {
        // Ensure both cards have pins
        const fromCard = $board.cards.find(c => c.id === threadFromCard)!
        if (!fromCard.pinId) {
          const pin = makePin(threadFromCard)
          board.addPin(pin)
          board.updateCard(threadFromCard, { pinId: pin.id })
        }
        if (!target.pinId) {
          const pin = makePin(target.id)
          board.addPin(pin)
          board.updateCard(target.id, { pinId: pin.id })
        }
        board.addThread(makeThread(threadFromCard, target.id, $layerStore.active))
      }
      drawingThread = false
      threadFromCard = null
    }
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
        on:contextmenu={e => onCardContextMenu(e, card)}
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
        {#if typeSelectorCardId === card.id}
          <TypeSelector
            current={card.type}
            on:select={e => onTypeSelect(card.id, e.detail)}
          />
        {/if}
      </div>
    {/each}
    <slot />
  </div>
  <ThreadLayer
    drawingFrom={drawingThread ? threadFromCard : null}
    drawingTo={drawingThread ? threadMousePos : null}
    {editingThreadId}
    on:threadclick={e => (editingThreadId = e.detail)}
    on:labelsave={e => { board.updateThread(e.detail.id, { label: e.detail.label || null }); editingThreadId = null }}
    on:labelclose={() => (editingThreadId = null)}
  />
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
