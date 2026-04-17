<!-- src/components/Pin.svelte -->
<script lang="ts">
  export let x: number
  export let y: number
</script>

<circle cx={x} cy={y} r="5" fill="#8b4513" stroke="#5a2d0c" stroke-width="1.5" />
