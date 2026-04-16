import { describe, it, expect, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { board } from '../../src/stores/board'
import type { Card } from '../../src/types'

const makeCard = (id: string): Card => ({
  id,
  type: 'generic',
  x: 0, y: 0, width: 180, height: 120,
  content: { lor: 'lor text', meta: 'meta text' },
  layers: ['lor'],
  zIndex: 0,
  fontSize: 14,
  pinId: null,
})

beforeEach(() => {
  board.set({ cards: [], threads: [], pins: [], images: [] })
})

describe('card CRUD', () => {
  it('addCard adds a card', () => {
    board.addCard(makeCard('a'))
    expect(get(board).cards).toHaveLength(1)
    expect(get(board).cards[0].id).toBe('a')
  })

  it('updateCard patches specific fields', () => {
    board.addCard(makeCard('a'))
    board.updateCard('a', { x: 50, y: 100 })
    const card = get(board).cards[0]
    expect(card.x).toBe(50)
    expect(card.y).toBe(100)
    expect(card.type).toBe('generic')  // unchanged
  })

  it('removeCard also removes connected threads and pins', () => {
    board.addCard(makeCard('a'))
    board.addCard(makeCard('b'))
    board.addThread({ id: 't1', layer: 'lor', from: { cardId: 'a' }, to: { cardId: 'b' }, label: null })
    board.addPin({ id: 'p1', cardId: 'a' })
    board.removeCard('a')
    const s = get(board)
    expect(s.cards).toHaveLength(1)
    expect(s.threads).toHaveLength(0)
    expect(s.pins).toHaveLength(0)
  })

  it('bringToFront gives card highest zIndex', () => {
    board.addCard({ ...makeCard('a'), zIndex: 1 })
    board.addCard({ ...makeCard('b'), zIndex: 2 })
    board.bringToFront('a')
    const cardA = get(board).cards.find(c => c.id === 'a')!
    const cardB = get(board).cards.find(c => c.id === 'b')!
    expect(cardA.zIndex).toBeGreaterThan(cardB.zIndex)
  })
})

describe('thread CRUD', () => {
  it('addThread adds a thread', () => {
    board.addThread({ id: 't1', layer: 'lor', from: { cardId: 'a' }, to: { cardId: 'b' }, label: null })
    expect(get(board).threads).toHaveLength(1)
  })

  it('updateThread patches label', () => {
    board.addThread({ id: 't1', layer: 'lor', from: { cardId: 'a' }, to: { cardId: 'b' }, label: null })
    board.updateThread('t1', { label: 'knows' })
    expect(get(board).threads[0].label).toBe('knows')
  })
})
