<!-- src/components/ImageNode.svelte -->
<script lang="ts">
  import type { ImageNode } from '../types'
  export let image: ImageNode
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="image-node"
  style:left="{image.x}px"
  style:top="{image.y}px"
  style:width="{image.width}px"
  style:height="{image.height}px"
  on:mousedown
  on:contextmenu|preventDefault
>
  <img src={image.dataUrl} alt="" draggable="false" />
</div>

<style>
  .image-node {
    position: absolute;
    border: 1px solid rgba(0,0,0,0.2);
    box-shadow: 1px 2px 6px rgba(0,0,0,0.3);
    overflow: hidden;
    cursor: default;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    pointer-events: none;
  }
</style>
