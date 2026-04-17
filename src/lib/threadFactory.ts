// src/lib/threadFactory.ts
import type { Thread, Pin, LayerKey } from '../types'

let idCounter = 0

export function newThreadId(): string {
  return `thread-${Date.now()}-${++idCounter}`
}

export function newPinId(): string {
  return `pin-${Date.now()}-${++idCounter}`
}

export function makeThread(
  fromCardId: string,
  toCardId: string,
  layer: LayerKey,
): Thread {
  return {
    id: newThreadId(),
    layer,
    from: { cardId: fromCardId },
    to:   { cardId: toCardId },
    label: null,
  }
}

export function makePin(cardId: string): Pin {
  return { id: newPinId(), cardId }
}
