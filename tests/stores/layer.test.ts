// tests/stores/layer.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { layer } from '../../src/stores/layer'

beforeEach(() => {
  layer.setActive('lor')
  layer.setInactiveDim(0)
})

describe('layer store', () => {
  it('starts with lor active', () => {
    expect(get(layer).active).toBe('lor')
  })

  it('toggle switches lor → meta', () => {
    layer.toggle()
    expect(get(layer).active).toBe('meta')
  })

  it('toggle switches meta → lor', () => {
    layer.toggle()
    layer.toggle()
    expect(get(layer).active).toBe('lor')
  })

  it('setActive sets specific layer', () => {
    layer.setActive('meta')
    expect(get(layer).active).toBe('meta')
  })

  it('setInactiveDim clamps to 0–1', () => {
    layer.setInactiveDim(1.5)
    expect(get(layer).inactiveDim).toBe(1)
    layer.setInactiveDim(-0.2)
    expect(get(layer).inactiveDim).toBe(0)
  })

  it('setInactiveDim stores value', () => {
    layer.setInactiveDim(0.6)
    expect(get(layer).inactiveDim).toBe(0.6)
  })
})
