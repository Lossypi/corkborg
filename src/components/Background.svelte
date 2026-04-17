<!-- src/components/Background.svelte -->
<script lang="ts">
</script>

<div class="bg-root">
  <!-- Cork texture via SVG filter -->
  <svg class="cork-texture" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="cork">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0.3" />
        <feBlend in="SourceGraphic" mode="multiply" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="#c8a97b" filter="url(#cork)" />
  </svg>

  <!-- Radial vignette: transparent center → fade at edges -->
  <div class="vignette" />
</div>

<style>
  .bg-root {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .cork-texture {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 70% at 50% 50%,
      transparent 40%,
      rgba(240, 220, 180, 0.5) 100%
    );
  }
</style>
