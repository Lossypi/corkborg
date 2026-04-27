<!-- src/App.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Canvas from './components/Canvas.svelte'
  import LayerSwitch from './components/LayerSwitch.svelte'
  import Minimap from './components/Minimap.svelte'
  import ExportPanel from './components/ExportPanel.svelte'
  import { layer } from './stores/layer'
  import { board } from './stores/board'
  import { loadFromStorage, initAutosave } from './lib/persistence'
  import { isTablet } from './lib/tablet'
  import { layerCssVars, LAYER_TOKENS } from './lib/theme'

  $: tokens = LAYER_TOKENS[$layer.active]
  $: cssVarsObj = layerCssVars($layer.active)
  $: cssVars = Object.entries(cssVarsObj).map(([k, v]) => `${k}:${v}`).join(';')

  const tabletMode = isTablet()
  let showExport = false
  let stopAutosave: (() => void) | null = null

  onMount(() => {
    const saved = loadFromStorage()
    if (saved) board.set(saved)
    stopAutosave = initAutosave(board.subscribe)
  })

  onDestroy(() => stopAutosave?.())
</script>

<main style={cssVars}>
  <Canvas readonly={tabletMode} />
  {#if !tabletMode}
    <LayerSwitch />
  {/if}
  <Minimap />
  {#if !tabletMode}
    <!-- Layer indicator badge — top-left -->
    <div class="layer-badge" style:border-color={tokens.accent}>
      {tokens.modeLabel}
    </div>
    <!-- Export button — top-right -->
    <button class="chrome-btn export-btn" on:click={() => showExport = true}>
      ⬆ Экспорт
    </button>
    {#if showExport}
      <ExportPanel on:close={() => showExport = false} />
    {/if}
  {/if}
</main>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { overflow: hidden; width: 100vw; height: 100vh; }
  :global(#app) { width: 100%; height: 100%; }
  main {
    width: 100%;
    height: 100%;
    transition: filter 0.4s;
  }
  .layer-badge {
    position: fixed;
    top: 16px;
    left: 16px;
    background: rgba(20,14,8,0.82);
    color: #f5e8cc;
    border-left: 3px solid;
    padding: 8px 14px;
    border-radius: 2px;
    font-family: "Inter Tight", system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    z-index: 1000;
    pointer-events: none;
  }
  .chrome-btn {
    background: rgba(20,14,8,0.82);
    color: #f5e8cc;
    border: none;
    border-radius: 2px;
    font-family: "Inter Tight", system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    z-index: 1000;
    position: fixed;
  }
  .export-btn {
    top: 16px;
    right: 16px;
    padding: 6px 14px;
  }
</style>
