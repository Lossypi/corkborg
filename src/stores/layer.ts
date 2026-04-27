// src/stores/layer.ts
import { writable } from 'svelte/store'
import type { LayerKey } from '../types'

type LayerState = { active: LayerKey; inactiveDim: number }

function createLayer() {
  const { subscribe, update } = writable<LayerState>({ active: 'lor', inactiveDim: 0 })
  return {
    subscribe,
    toggle() { update(s => ({ ...s, active: s.active === 'lor' ? 'meta' : 'lor' })) },
    setActive(l: LayerKey) { update(s => ({ ...s, active: l })) },
    setInactiveDim(v: number) { update(s => ({ ...s, inactiveDim: Math.max(0, Math.min(1, v)) })) },
  }
}

export const layer = createLayer()
