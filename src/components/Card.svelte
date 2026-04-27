<!-- src/components/Card.svelte -->
<script lang="ts">
  import type { Card, LayerKey } from '../types'
  import { LAYER_TOKENS, PAPER_FOR_TYPE } from '../lib/theme'
  import { caseExtras, paperBackground, photoPlaceholder } from '../lib/decorations'

  export let card: Card
  export let activeLayer: LayerKey
  export let inactiveDim: number

  const CLIPS: Record<string, string> = {
    generic:  'none',
    npc:      'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
    location: 'polygon(0 0, 100% 0, 100% 100%, 58% 100%, 50% calc(100% - 10px), 42% 100%, 0 100%)',
    event:    'polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)',
    idea:     'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
  }

  $: tokens = LAYER_TOKENS[activeLayer]
  $: inactiveLayer = activeLayer === 'lor' ? 'meta' : 'lor'
  $: inactiveTokens = LAYER_TOKENS[inactiveLayer]

  $: isVisible = card.layers.includes(activeLayer)
  $: opacity = isVisible ? 1 : 0.08
  $: paperStyle = PAPER_FOR_TYPE[card.type] ?? 'hand'
  $: paperColor = paperStyle === 'factual' ? tokens.paperMain : tokens.paperAlt

  $: extras = caseExtras(card.id, card.type)
  $: tiltDeg = tokens.cardTilt ? extras.tilt : 0

  $: isHand = paperStyle === 'hand'
  $: baseBg = paperBackground(paperColor, 0.06)
  $: cardBg = isHand
    ? `repeating-linear-gradient(transparent 0, transparent 17px, ${tokens.ink}14 17px, ${tokens.ink}14 18px), ${baseBg}`
    : baseBg

  $: isGhost = !isVisible

  $: activeContent   = card.content[activeLayer]
  $: inactiveContent = card.content[inactiveLayer]
  $: showInactive = !isGhost && inactiveDim > 0 && inactiveContent.trim().length > 0
  $: inactiveOpacity = Math.min(0.7, inactiveDim * 1.2)

  $: hasBothLayers = card.content.lor.trim().length > 0 && card.content.meta.trim().length > 0
  $: stampRotate = extras.stampPos === 'br' ? 5 : -5

  $: photoBandHeight = Math.floor(card.height * 0.48)
  $: photoSrc = extras.isPhoto ? photoPlaceholder(card.width, photoBandHeight) : null
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="card"
  class:ghost={isGhost}
  style:width="{card.width}px"
  style:height="{card.height}px"
  style:clip-path={CLIPS[card.type] ?? 'none'}
  style:opacity
  style:font-size="{card.fontSize}px"
  style:transform="rotate({tiltDeg}deg)"
  style:background={isGhost ? 'transparent' : cardBg}
  style:color={tokens.ink}
>
  <!-- Tape: top-center -->
  {#if extras.tapeTop && !isGhost}
    <div class="tape tape-top" style:background={tokens.tapeColor} />
  {/if}
  <!-- Tape: top-left corner -->
  {#if extras.tapeCornerTL && !isGhost}
    <div class="tape tape-tl" style:background={tokens.tapeColor} />
  {/if}
  <!-- Tape: bottom-right corner -->
  {#if extras.tapeCornerBR && !isGhost}
    <div class="tape tape-br" style:background={tokens.tapeColor} />
  {/if}

  <!-- Photo band (event cards) -->
  {#if photoSrc && !isGhost}
    <div
      class="photo-band"
      style:height="{photoBandHeight}px"
      style:background-image={photoSrc}
    />
  {/if}

  <!-- Idea fold overlay -->
  {#if card.type === 'idea' && !isGhost}
    <div
      class="idea-fold"
      style:background="linear-gradient(225deg, rgba(0,0,0,0.25) 0 48%, {paperColor} 52%)"
    />
  {/if}

  <!-- Card content -->
  <div
    class="card-body"
    style:margin-top={photoSrc ? `${photoBandHeight}px` : '0'}
    style:font-family={isHand ? tokens.fontHand : tokens.fontFactual}
  >
    <div class="card-text">{activeContent}</div>

    <!-- Inactive layer dim -->
    {#if showInactive}
      <div class="inactive-sep" style:border-color="{inactiveTokens.accent}44" />
      <div
        class="inactive-label"
        style:color={inactiveTokens.accent}
        style:opacity={inactiveOpacity}
      >{inactiveLayer === 'lor' ? 'ЛОР↓' : 'МЕТА↓'}</div>
      <div
        class="inactive-text"
        style:color={inactiveTokens.accent}
        style:opacity={inactiveOpacity}
        style:font-family={paperStyle === 'hand' ? inactiveTokens.fontFactual : inactiveTokens.fontHand}
      >{inactiveContent}</div>
    {/if}
  </div>

  <!-- Ink stamp (both layers have content) -->
  {#if hasBothLayers && !isGhost}
    <div
      class="stamp"
      class:stamp-br={extras.stampPos === 'br'}
      class:stamp-bl={extras.stampPos === 'bl'}
      style:border-color={tokens.stampColor}
      style:color={tokens.stampColor}
      style:transform="rotate({stampRotate}deg)"
    >{tokens.stampText}</div>
  {/if}

  <!-- Marginalia -->
  {#if extras.hasMarginalia && !isGhost}
    <div
      class="marginalia"
      style:color={tokens.marginaliaColor}
      style:transform="rotate({(extras.tilt * 2) % 12}deg)"
    >{extras.marginText}</div>
  {/if}
</div>

<style>
  .card {
    position: relative;
    overflow: hidden;
    border-radius: 1px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.22);
    transition: opacity 0.2s, filter 0.4s;
  }
  .card.ghost {
    box-shadow: none;
    border: 1px dashed rgba(100,80,40,0.4);
    background: transparent !important;
  }
  .card-body {
    position: absolute;
    inset: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .card-text {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.4;
    flex: 1;
    overflow: hidden;
  }
  .inactive-sep {
    border-top: 1px dashed;
    margin: 3px 0;
  }
  .inactive-label {
    font-family: "Inter Tight", system-ui, sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    line-height: 1;
  }
  .inactive-text {
    font-size: 0.85em;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.3;
    overflow: hidden;
  }
  .tape {
    position: absolute;
    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    border-left: 1px solid rgba(0,0,0,0.08);
    border-right: 1px solid rgba(0,0,0,0.08);
    z-index: 10;
  }
  .tape-top {
    width: 44px; height: 16px;
    top: -8px;
    left: calc(50% - 22px);
  }
  .tape-tl {
    width: 28px; height: 14px;
    top: -6px; left: -10px;
    transform: rotate(-35deg);
  }
  .tape-br {
    width: 28px; height: 14px;
    bottom: -6px; right: -10px;
    transform: rotate(-35deg);
  }
  .photo-band {
    position: absolute;
    top: 0; left: 0; right: 0;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .idea-fold {
    position: absolute;
    top: 0; right: 0;
    width: 18px; height: 18px;
    filter: drop-shadow(-1px 1px 1px rgba(0,0,0,0.15));
    z-index: 5;
  }
  .stamp {
    position: absolute;
    padding: 3px 8px;
    border: 2px solid;
    font-family: "Inter Tight", system-ui, sans-serif;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.55;
    pointer-events: none;
    z-index: 8;
    box-shadow: inset 0 0 0 0.5px currentColor;
  }
  .stamp-br { bottom: 6px; right: 6px; }
  .stamp-bl { bottom: 6px; left: 6px; }
  .marginalia {
    position: absolute;
    top: 4px;
    left: 5px;
    font-family: "Caveat", "Marker Felt", cursive;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.05;
    white-space: nowrap;
    pointer-events: none;
    text-shadow: 0 0 0.5px currentColor;
    z-index: 9;
  }
</style>
