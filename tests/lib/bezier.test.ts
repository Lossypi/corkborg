import { describe, it, expect } from 'vitest'
import { computeSagPath } from '../../src/lib/bezier'

describe('computeSagPath', () => {
  it('returns SVG path string starting with M', () => {
    const result = computeSagPath(0, 0, 100, 0)
    expect(result.d).toMatch(/^M /)
  })

  it('contains cubic bezier C command', () => {
    const result = computeSagPath(0, 0, 100, 0)
    expect(result.d).toContain('C')
  })

  it('midY is below straight midpoint (positive sag for horizontal line)', () => {
    const result = computeSagPath(0, 0, 100, 0)
    expect(result.midY).toBeGreaterThan(0)
  })

  it('sag scales with distance', () => {
    const short = computeSagPath(0, 0, 50, 0)
    const long  = computeSagPath(0, 0, 200, 0)
    expect(long.midY).toBeGreaterThan(short.midY)
  })

  it('midX is midpoint of x', () => {
    const result = computeSagPath(100, 0, 300, 0)
    expect(result.midX).toBe(200)
  })
})
