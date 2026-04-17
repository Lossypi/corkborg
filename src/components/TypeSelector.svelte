<!-- src/components/TypeSelector.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { CardType } from '../types'

  export let current: CardType

  const dispatch = createEventDispatcher<{ select: CardType }>()

  const TYPES: { type: CardType; label: string }[] = [
    { type: 'generic',  label: '□ Generic'  },
    { type: 'npc',      label: '◥ NPC'      },
    { type: 'location', label: '◤ Location' },
    { type: 'event',    label: '◢ Event'    },
    { type: 'idea',     label: '◣ Idea'     },
  ]
</script>

<div class="type-selector">
  {#each TYPES as t}
    <button
      class:active={t.type === current}
      on:click={() => dispatch('select', t.type)}
    >{t.label}</button>
  {/each}
</div>

<style>
  .type-selector {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    display: flex;
    flex-direction: column;
    background: #fff8ee;
    border: 1px solid #c8a060;
    border-radius: 4px;
    padding: 4px;
    z-index: 1000;
    gap: 2px;
    box-shadow: 2px 3px 6px rgba(0,0,0,0.2);
  }
  button {
    background: none;
    border: none;
    padding: 4px 8px;
    cursor: pointer;
    text-align: left;
    border-radius: 2px;
    font-size: 13px;
  }
  button:hover { background: #f0e0c0; }
  button.active { background: #e8c890; font-weight: bold; }
</style>
