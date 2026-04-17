<!-- src/components/LayerAssign.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { LayerKey } from '../types'

  export let currentLayers: LayerKey[]

  const dispatch = createEventDispatcher<{ change: LayerKey[] }>()

  function toggle(l: LayerKey) {
    let next = currentLayers.includes(l)
      ? currentLayers.filter(x => x !== l)
      : [...currentLayers, l]
    if (next.length === 0) next = [l]  // at least one layer required
    dispatch('change', next)
  }
</script>

<div class="layer-assign">
  <span class="label">Слои:</span>
  <button class:on={currentLayers.includes('lor')} on:click={() => toggle('lor')}>Лор</button>
  <button class:on={currentLayers.includes('meta')} on:click={() => toggle('meta')}>Мета</button>
</div>

<style>
  .layer-assign {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #fff8ee;
    border: 1px solid #c8a060;
    border-radius: 4px;
    padding: 4px 8px;
    z-index: 1000;
    box-shadow: 2px 3px 6px rgba(0,0,0,0.2);
    font-size: 12px;
    white-space: nowrap;
  }
  .label { color: #666; }
  button {
    padding: 2px 8px;
    border: 1px solid #aaa;
    border-radius: 10px;
    cursor: pointer;
    background: transparent;
    font-size: 12px;
  }
  button.on { background: #e8c890; border-color: #a07030; font-weight: bold; }
</style>
