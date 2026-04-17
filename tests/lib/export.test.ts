// tests/lib/export.test.ts
import { describe, it, expect } from 'vitest'
import { generateMarkdown, exportToJSON, importFromJSON } from '../../src/lib/export'
import type { BoardState, Card } from '../../src/types'

function makeCard(id: string, overrides: Partial<Card> = {}): Card {
  return {
    id, type: 'generic', x: 0, y: 0, width: 180, height: 120,
    content: { lor: id + ' lor text', meta: id + ' meta text' },
    layers: ['lor'],
    zIndex: 0, fontSize: 14, pinId: null,
    ...overrides,
  }
}

const STATE: BoardState = {
  cards: [
    makeCard('Кузнец', { type: 'npc', layers: ['lor', 'meta'] }),
    makeCard('Деревня', { type: 'location', layers: ['lor'] }),
  ],
  threads: [
    { id: 't1', layer: 'lor', from: { cardId: 'Кузнец' }, to: { cardId: 'Деревня' }, label: null }
  ],
  pins: [],
  images: [],
}

describe('generateMarkdown', () => {
  it('creates one file per card', () => {
    const files = generateMarkdown(STATE)
    expect(Object.keys(files)).toHaveLength(2)
  })

  it('filename is derived from first line of lor content', () => {
    const files = generateMarkdown(STATE)
    expect(Object.keys(files)).toContain('Кузнец lor text.md')
  })

  it('includes layer tags in frontmatter', () => {
    const files = generateMarkdown(STATE)
    const kuznet = Object.values(files)[0]
    expect(kuznet).toContain('tags:')
    expect(kuznet).toContain('lor')
  })

  it('includes card type tag', () => {
    const files = generateMarkdown(STATE)
    const kuznet = files['Кузнец lor text.md']
    expect(kuznet).toContain('npc')
  })

  it('includes wikilinks for connected cards', () => {
    const files = generateMarkdown(STATE)
    const kuznet = files['Кузнец lor text.md']
    expect(kuznet).toContain('[[')
  })

  it('dual-layer card has both sections', () => {
    const files = generateMarkdown(STATE)
    const kuznet = files['Кузнец lor text.md']
    expect(kuznet).toContain('## Лорный слой')
    expect(kuznet).toContain('## Логический слой')
  })
})

describe('JSON round-trip', () => {
  it('importFromJSON(exportToJSON(state)) equals original state', () => {
    expect(importFromJSON(exportToJSON(STATE))).toEqual(STATE)
  })
})
