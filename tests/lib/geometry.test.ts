import { describe, it, expect } from 'vitest'
import { screenToWorld, worldToScreen } from '../../src/lib/geometry'

const vp100 = { x: 100, y: 50, scale: 1 }
const vp2x  = { x: 0,   y: 0,  scale: 2 }

describe('screenToWorld', () => {
  it('subtracts pan offset', () => {
    expect(screenToWorld(200, 150, vp100)).toEqual({ x: 100, y: 100 })
  })
  it('divides by scale', () => {
    expect(screenToWorld(400, 200, vp2x)).toEqual({ x: 200, y: 100 })
  })
  it('is identity at default viewport', () => {
    expect(screenToWorld(300, 300, { x: 0, y: 0, scale: 1 })).toEqual({ x: 300, y: 300 })
  })
})

describe('worldToScreen', () => {
  it('adds pan offset', () => {
    expect(worldToScreen(100, 100, vp100)).toEqual({ x: 200, y: 150 })
  })
  it('multiplies by scale', () => {
    expect(worldToScreen(200, 100, vp2x)).toEqual({ x: 400, y: 200 })
  })
  it('round-trips with screenToWorld', () => {
    const world = screenToWorld(350, 250, vp100)
    expect(worldToScreen(world.x, world.y, vp100)).toEqual({ x: 350, y: 250 })
  })
})
