<!-- src/components/Canvas.svelte -->
<script lang="ts">
  import { viewport } from '../stores/viewport'

  let isSpaceDown = false
  let isPanning = false
  let panStart = { x: 0, y: 0 }
  let panOrigin = { x: 0, y: 0 }

  function onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space' && !e.repeat) {
      isSpaceDown = true
      e.preventDefault()
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.code === 'Space') isSpaceDown = false
  }

  function onMouseDown(e: MouseEvent) {
    if (isSpaceDown || e.button === 1) {
      isPanning = true
      panStart = { x: e.clientX, y: e.clientY }
      panOrigin = { x: $viewport.x, y: $viewport.y }
      e.preventDefault()
    }
  }

  function onMouseMove(e: MouseEvent) {
    if (isPanning) {
      viewport.setPan(
        panOrigin.x + (e.clientX - panStart.x),
        panOrigin.y + (e.clientY - panStart.y),
      )
    }
  }

  function onMouseUp(e: MouseEvent) {
    if (e.button === 1 || isSpaceDown) isPanning = false
  }

  function onWheel(e: WheelEvent) {
    if (e.shiftKey) return  // reserved for card font size
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 0.9
    viewport.zoom(factor, e.clientX, e.clientY)
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
  on:dblclick
  on:contextmenu|preventDefault
>
  <div class="canvas-world" style:transform>
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
    width: 0; height: 0;  /* children use absolute positioning */
  }
</style>
