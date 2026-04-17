<!-- src/App.svelte -->
<script lang="ts">
  import Canvas from './components/Canvas.svelte'
  import LayerSwitch from './components/LayerSwitch.svelte'
  import Minimap from './components/Minimap.svelte'
  import { layer } from './stores/layer'

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
</script>

<main style={cssVars}>
  <Canvas />
  <LayerSwitch />
  <Minimap />
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
</style>
