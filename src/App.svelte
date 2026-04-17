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

  const THEMES = {
    lor: {
      '--bg':           '#c8a97b',
      '--card-bg':      '#faf0dc',
      '--card-border':  '#b8903a',
      '--thread-color': '#8b2020',
    },
    meta: {
      '--bg':           '#7b9ec8',
      '--card-bg':      '#dceeff',
      '--card-border':  '#5a80b8',
      '--thread-color': '#1a4a8b',
    },
  }

  $: theme = THEMES[$layer.active]
  $: cssVars = Object.entries(theme).map(([k, v]) => `${k}:${v}`).join(';')

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
    <button class="export-btn" on:click={() => showExport = true}>⬆ Экспорт</button>
    {#if showExport}
      <ExportPanel on:close={() => showExport = false} />
    {/if}
  {/if}
</main>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { overflow: hidden; width: 100vw; height: 100vh; }
  main {
    width: 100%;
    height: 100%;
    background: var(--bg);
    transition: background 0.3s;
  }
  .export-btn {
    position: fixed;
    top: 16px;
    right: 16px;
    padding: 6px 14px;
    background: rgba(255,255,255,0.85);
    border: 1px solid #aaa;
    border-radius: 16px;
    cursor: pointer;
    font-size: 13px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
</style>
