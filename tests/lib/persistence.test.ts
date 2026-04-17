// tests/lib/persistence.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { loadFromStorage, saveToStorage } from '../../src/lib/persistence'
import type { BoardState } from '../../src/types'

const STATE: BoardState = {
  cards: [{
    id: 'c1', type: 'npc', x: 10, y: 20, width: 180, height: 120,
    content: { lor: 'hello', meta: 'world' }, layers: ['lor'],
    zIndex: 1, fontSize: 14, pinId: null,
  }],
  threads: [], pins: [], images: [],
}

beforeEach(() => localStorage.clear())

describe('persistence', () => {
  it('loadFromStorage returns null when empty', () => {
    expect(loadFromStorage()).toBeNull()
  })

  it('saveToStorage then load returns original state', () => {
    saveToStorage(STATE)
    expect(loadFromStorage()).toEqual(STATE)
  })

  it('loadFromStorage returns null on corrupt JSON', () => {
    localStorage.setItem('corkborg-board', '{bad json}')
    expect(loadFromStorage()).toBeNull()
  })
})
