import { writable } from 'svelte/store'

export type Viewport = { x: number; y: number; scale: number }

function createViewport() {
  const { subscribe, set, update } = writable<Viewport>({ x: 0, y: 0, scale: 1 })

  return {
    subscribe,
    set,
    setPan(x: number, y: number) {
      update(v => ({ ...v, x, y }))
    },
    pan(dx: number, dy: number) {
      update(v => ({ ...v, x: v.x + dx, y: v.y + dy }))
    },
    zoom(factor: number, cx: number, cy: number) {
      update(v => {
        const newScale = Math.max(0.1, Math.min(4, v.scale * factor))
        const ratio = newScale / v.scale
        return {
          x: cx - ratio * (cx - v.x),
          y: cy - ratio * (cy - v.y),
          scale: newScale,
        }
      })
    },
  }
}

export const viewport = createViewport()
