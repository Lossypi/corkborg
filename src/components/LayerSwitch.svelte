<!-- src/components/LayerSwitch.svelte -->
<script lang="ts">
  import { layer } from '../stores/layer'

  function onGhostInput(e: Event) {
    layer.setGhostOpacity(Number((e.target as HTMLInputElement).value))
  }
</script>

<div class="layer-switch">
  <button
    class:active={$layer.active === 'lor'}
    on:click={() => layer.setActive('lor')}
  >Лор</button>
  <button
    class:active={$layer.active === 'meta'}
    on:click={() => layer.setActive('meta')}
  >Мета</button>
  <label class="ghost-label">
    Тень:
    <input
      type="range" min="0" max="1" step="0.05"
      value={$layer.ghostOpacity}
      on:input={onGhostInput}
    />
  </label>
</div>

<style>
  .layer-switch {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.85);
    padding: 6px 12px;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 1000;
  }
  button {
    padding: 4px 12px;
    border: 1px solid #aaa;
    border-radius: 12px;
    cursor: pointer;
    background: transparent;
    font-size: 13px;
    transition: background 0.15s;
  }
  button.active { background: #e8c890; border-color: #a07030; font-weight: bold; }
  .ghost-label {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  input[type=range] { width: 80px; }
</style>
