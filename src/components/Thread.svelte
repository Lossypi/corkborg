<!-- src/components/Thread.svelte -->
<script lang="ts">
  import { computeSagPath, computeShadowPath } from '../lib/bezier'
  import type { Thread } from '../types'

  export let thread: Thread
  export let x1: number
  export let y1: number
  export let x2: number
  export let y2: number
  export let color: string = '#a8282a'
  export let opacity: number = 1
  export let sag: number = 28
  export let isLor: boolean = true

  let showLabel = false

  const filterId = `thread-rough-${thread.id}`

  $: main = computeSagPath(x1, y1, x2, y2, sag)
  $: shadow = computeShadowPath(x1, y1, x2, y2, sag)
  $: strokeW = isLor ? 2.6 : 1.8
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<g
  style:opacity
  on:mouseenter={() => (showLabel = true)}
  on:mouseleave={() => (showLabel = false)}
  on:click
>
  <!-- Turbulence filter for organic look (lor only) -->
  {#if isLor}
    <defs>
      <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="2" seed="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  {/if}

  <!-- Shadow -->
  <path
    d={shadow}
    fill="none"
    stroke="rgba(0,0,0,0.38)"
    stroke-width="3"
    stroke-linecap="round"
    opacity="0.55"
  />

  <!-- Main thread -->
  <path
    d={main.d}
    fill="none"
    stroke={color}
    stroke-width={strokeW}
    stroke-linecap="round"
    filter={isLor ? `url(#${filterId})` : undefined}
  />

  <!-- Highlight dash (lor only) -->
  {#if isLor}
    <path
      d={main.d}
      fill="none"
      stroke="rgba(255,255,255,0.2)"
      stroke-width="0.8"
      stroke-dasharray="3 5"
      stroke-linecap="round"
    />
  {/if}

  <!-- Invisible thick hit area -->
  <path d={main.d} fill="none" stroke="transparent" stroke-width="12" style="cursor:pointer" />

  <!-- Label on hover -->
  {#if showLabel && thread.label}
    <foreignObject
      x={main.midX - 40}
      y={main.midY + 8}
      width="80"
      height="26"
      style="pointer-events:none; overflow:visible"
    >
      <!-- svelte-ignore a11y-missing-attribute -->
      <div
        style="
          background: rgba(250,232,200,0.98);
          border: 1px solid {color};
          padding: 3px 8px;
          font-family: 'Caveat', cursive;
          font-size: 13px;
          border-radius: 1px;
          transform: rotate(-2deg);
          white-space: nowrap;
          display: inline-block;
        "
      >{thread.label}</div>
    </foreignObject>
  {/if}
</g>
