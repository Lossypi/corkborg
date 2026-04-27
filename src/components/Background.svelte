<!-- src/components/Background.svelte -->
<script lang="ts">
  import { layer as layerStore } from '../stores/layer'
  import { LAYER_TOKENS } from '../lib/theme'
  import { corkBackground } from '../lib/decorations'

  const cork = corkBackground()

  $: tokens = LAYER_TOKENS[$layerStore.active]
  $: isLor = $layerStore.active === 'lor'
</script>

<div class="bg-root">
  <!-- Cork texture: SVG data-URI, non-tiling, organic -->
  <div class="cork" style:background={cork} />

  <!-- Layer-specific vignette -->
  <div class="vignette" style:background={tokens.vignette} />

  <!-- Meta overlay: cold blue wash -->
  {#if !isLor}
    <div class="meta-overlay" />
  {/if}

  <!-- Blueprint grid (meta only) -->
  {#if !isLor}
    <div class="blueprint-grid" />
  {/if}

  <!-- Wood frame inset -->
  <div class="wood-frame" />
</div>

<style>
  .bg-root {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .cork {
    position: absolute;
    inset: 0;
    background-size: 100% 100%;
  }
  .vignette {
    position: absolute;
    inset: 0;
    transition: background 0.4s;
  }
  .meta-overlay {
    position: absolute;
    inset: 0;
    background: rgba(18, 36, 72, 0.32);
  }
  .blueprint-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(80,140,220,0.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(80,140,220,0.09) 1px, transparent 1px),
      linear-gradient(rgba(80,140,220,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(80,140,220,0.035) 1px, transparent 1px);
    background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
  }
  .wood-frame {
    position: absolute;
    inset: 0;
    box-shadow:
      inset 0 0 0 6px rgba(80,50,20,0.35),
      inset 0 0 0 7px rgba(40,20,0,0.5),
      inset 0 0 30px rgba(0,0,0,0.25);
  }
</style>
