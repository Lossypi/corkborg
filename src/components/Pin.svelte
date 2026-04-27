<!-- src/components/Pin.svelte -->
<script lang="ts">
  export let x: number
  export let y: number
  export let pinStyle: 'push' | 'brass' = 'push'

  const size = 14
</script>

{#if pinStyle === 'brass'}
  <defs>
    <radialGradient id="brassGrad" cx="0.35" cy="0.35" r="0.7">
      <stop offset="0%" stop-color="#f5d77a"/>
      <stop offset="55%" stop-color="#c8a860"/>
      <stop offset="100%" stop-color="#8a6a2e"/>
    </radialGradient>
  </defs>
  <g transform="translate({x},{y})" style="pointer-events:none">
    <circle r={size/2 + 2} fill="rgba(0,0,0,0.35)" transform="translate(1,2)"/>
    <circle r={size/2} fill="#8a6a2e"/>
    <circle r={size/2} fill="url(#brassGrad)"/>
    <circle r={size/2 - 3} cx={-1.5} cy={-1.5} fill="rgba(255,240,200,0.6)"/>
  </g>
{:else}
  <!-- Red pushpin (lor) -->
  <g transform="translate({x},{y})" style="pointer-events:none">
    <circle r={size/2 + 1} fill="rgba(0,0,0,0.4)" transform="translate(1.5,2)"/>
    <circle r={size/2} fill="#c43030"/>
    <circle r={size/2 - 2} cx={-1.5} cy={-1.5} fill="rgba(255,255,255,0.5)"/>
    <circle r={1} cx={1.5} cy={1.5} fill="rgba(0,0,0,0.3)"/>
  </g>
{/if}
