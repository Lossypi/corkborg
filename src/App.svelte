<script lang="ts">
  import Canvas from './components/Canvas.svelte'
</script>

<main>
  <Canvas>
    <!-- children will be added here -->
  </Canvas>
</main>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { overflow: hidden; width: 100vw; height: 100vh; background: #c8a97b; }
  main { width: 100%; height: 100%; }
</style>
