<!-- src/components/Thread.svelte -->
<script lang="ts">
  import { computeSagPath } from '../lib/bezier'
  import type { Thread } from '../types'

  export let thread: Thread
  export let x1: number
  export let y1: number
  export let x2: number
  export let y2: number
  export let color: string = '#8b4513'
  export let opacity: number = 1

  let showLabel = false

  $: path = computeSagPath(x1, y1, x2, y2)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<g
  style:opacity
  on:mouseenter={() => (showLabel = true)}
  on:mouseleave={() => (showLabel = false)}
  on:click
>
  <!-- Invisible thick hit area -->
  <path d={path.d} fill="none" stroke="transparent" stroke-width="12" style="cursor:pointer" />
  <!-- Visible thread -->
  <path d={path.d} fill="none" stroke={color} stroke-width="2" stroke-linecap="round" />
  {#if showLabel && thread.label}
    <text
      x={path.midX}
      y={path.midY - 8}
      text-anchor="middle"
      font-size="11"
      fill={color}
      style="pointer-events:none; user-select:none;"
    >{thread.label}</text>
  {/if}
</g>
