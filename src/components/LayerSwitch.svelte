<!-- src/components/LayerSwitch.svelte -->
<script lang="ts">
  import { layer } from '../stores/layer'
  import { LAYER_TOKENS } from '../lib/theme'

  $: lorTokens  = LAYER_TOKENS['lor']
  $: metaTokens = LAYER_TOKENS['meta']
  $: active = $layer.active
</script>

<div class="dock">
  <!-- Лорный pill -->
  <button
    class="pill"
    class:pill-active={active === 'lor'}
    style:--active-color={lorTokens.accent}
    on:click={() => layer.setActive('lor')}
  >
    <span class="dot" style:background={active === 'lor' ? '#fff' : lorTokens.accent} />
    {lorTokens.modeLabel}
  </button>

  <!-- Логический pill -->
  <button
    class="pill"
    class:pill-active={active === 'meta'}
    style:--active-color={metaTokens.accent}
    on:click={() => layer.setActive('meta')}
  >
    <span class="dot" style:background={active === 'meta' ? '#fff' : metaTokens.accent} />
    {metaTokens.modeLabel}
  </button>

  <!-- Inactive dim slider -->
  <label class="dim-label">
    <span>Тень</span>
    <input
      type="range"
      min="0"
      max="1"
      step="0.04"
      value={$layer.inactiveDim}
      on:input={e => layer.setInactiveDim(Number((e.target as HTMLInputElement).value))}
    />
  </label>
</div>

<style>
  .dock {
    position: fixed;
    bottom: 16px;
    left: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(20,14,8,0.82);
    border-radius: 20px;
    padding: 5px 10px 5px 5px;
    z-index: 1000;
    box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border: none;
    border-radius: 15px;
    background: transparent;
    color: rgba(245,232,204,0.55);
    font-family: "Inter Tight", system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    letter-spacing: 0.3px;
  }
  .pill-active {
    background: var(--active-color);
    color: #fff;
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dim-label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(245,232,204,0.55);
    font-family: "Inter Tight", system-ui, sans-serif;
    font-size: 11px;
    padding-left: 6px;
    border-left: 1px solid rgba(255,255,255,0.1);
  }
  input[type=range] {
    width: 72px;
    accent-color: rgba(245,232,204,0.7);
  }
</style>
