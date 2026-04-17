<!-- src/components/ExportPanel.svelte -->
<script lang="ts">
  import { board } from '../stores/board'
  import { generateMarkdown, exportToJSON, importFromJSON } from '../lib/export'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{ close: void }>()

  async function exportObsidian() {
    const files = generateMarkdown($board)
    try {
      const dir = await (window as any).showDirectoryPicker()
      for (const [name, content] of Object.entries(files)) {
        const fh = await dir.getFileHandle(name, { create: true })
        const w = await fh.createWritable()
        await w.write(content)
        await w.close()
      }
      alert(`Экспортировано ${Object.keys(files).length} файлов`)
    } catch (e: any) {
      if (e.name !== 'AbortError') alert('Ошибка экспорта: ' + e.message)
    }
  }

  function exportJSON() {
    const json = exportToJSON($board)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'corkborg-board.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        board.set(importFromJSON(text))
      } catch {
        alert('Не удалось импортировать: неверный формат')
      }
    }
    input.click()
  }
</script>

<div class="panel">
  <h3>Экспорт</h3>
  <button on:click={exportObsidian}>→ Obsidian (Markdown)</button>
  <button on:click={exportJSON}>→ JSON (резервная копия)</button>
  <button on:click={importJSON}>← Импорт JSON</button>
  <button class="close" on:click={() => dispatch('close')}>✕</button>
</div>

<style>
  .panel {
    position: fixed;
    top: 60px;
    right: 16px;
    background: #fffdf5;
    border: 1px solid #c8a060;
    border-radius: 8px;
    padding: 16px;
    z-index: 1000;
    box-shadow: 2px 4px 12px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 220px;
  }
  h3 { margin: 0; font-size: 14px; font-weight: bold; }
  button {
    padding: 8px 12px;
    border: 1px solid #c8a060;
    border-radius: 4px;
    cursor: pointer;
    background: #faf0dc;
    font-size: 13px;
    text-align: left;
  }
  button:hover { background: #f0e0c0; }
  .close {
    position: absolute;
    top: 8px; right: 8px;
    padding: 2px 6px;
    font-size: 11px;
    background: transparent;
    border-color: transparent;
  }
</style>
