// tests/lib/gravity.test.ts
import { describe, it, expect } from 'vitest'
import { computeGravityOffset } from '../../src/lib/gravity'
import type { Card } from '../../src/types'

function makeCard(x: number, y: number): Card {
  return {
    id: 'c', type: 'generic', x, y, width: 180, height: 120,
    content: { lor: '', meta: '' }, layers: ['lor'],
    zIndex: 0, fontSize: 14, pinId: null,
  }
}

describe('computeGravityOffset', () => {
  it('returns cursor position when no cards exist', () => {
    expect(computeGravityOffset(100, 200, [])).toEqual({ x: 100, y: 200 })
  })

  it('shifts new card toward centroid', () => {
    // Two cards: centers at (90,60) and (270,60), centroid=(180,60)
    // cursor at (0,0), shift = 0 + (180-0)*0.3 = 54
    const cards = [makeCard(0, 0), makeCard(180, 0)]
    const result = computeGravityOffset(0, 0, cards)
    expect(result.x).toBeCloseTo(54)
    expect(result.y).toBeCloseTo(18)  // (60-0)*0.3 = 18
  })

  it('is idempotent at centroid', () => {
    const cards = [makeCard(0, 0), makeCard(180, 0)]
    // centroid x: (90+270)/2=180, centroid y: (60+60)/2=60
    const result = computeGravityOffset(180, 60, cards)
    expect(result.x).toBeCloseTo(180)
    expect(result.y).toBeCloseTo(60)
  })
})
