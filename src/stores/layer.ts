// src/stores/layer.ts
import { writable } from 'svelte/store'
import type { LayerKey } from '../types'

type LayerState = { active: LayerKey; ghostOpacity: number }

function createLayer() {
  const { subscribe, update } = writable<LayerState>({ active: 'lor', ghostOpacity: 0.3 })
  return {
    subscribe,
    toggle() { update(s => ({ ...s, active: s.active === 'lor' ? 'meta' : 'lor' })) },
    setActive(l: LayerKey) { update(s => ({ ...s, active: l })) },
    setGhostOpacity(v: number) { update(s => ({ ...s, ghostOpacity: Math.max(0, Math.min(1, v)) })) },
  }
}

export const layer = createLayer()
