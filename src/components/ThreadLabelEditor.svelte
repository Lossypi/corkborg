<!-- src/components/ThreadLabelEditor.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let x: number
  export let y: number
  export let value: string

  const dispatch = createEventDispatcher<{ save: string; close: void }>()
  let text = value

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      dispatch('save', text)
      dispatch('close')
    }
  }
</script>

<foreignObject {x} {y} width="120" height="28" style="overflow:visible">
  <!-- svelte-ignore a11y-autofocus -->
  <input
    bind:value={text}
    autofocus
    on:keydown={onKeyDown}
    on:blur={() => { dispatch('save', text); dispatch('close') }}
    placeholder="связь..."
  />
</foreignObject>

<style>
  input {
    width: 120px;
    padding: 3px 6px;
    border: 1px solid #888;
    border-radius: 3px;
    font-size: 11px;
    background: #fffdf5;
    transform: translate(-60px, -14px);
  }
</style>
