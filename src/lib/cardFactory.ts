// src/lib/cardFactory.ts
import type { Card, CardType, LayerKey } from '../types'
import { CARD_SIZES } from '../types'

let idCounter = 0
export function newId(): string {
  return `card-${Date.now()}-${++idCounter}`
}

export function makeCard(
  x: number,
  y: number,
  activeLayer: LayerKey,
  type: CardType = 'generic',
): Card {
  const size = CARD_SIZES.M
  return {
    id: newId(),
    type,
    x: x - size.width / 2,
    y: y - size.height / 2,
    width: size.width,
    height: size.height,
    content: { lor: '', meta: '' },
    layers: [activeLayer],
    zIndex: 0,
    fontSize: 14,
    pinId: null,
  }
}
