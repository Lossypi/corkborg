// src/lib/gravity.ts
import type { Card } from '../types'

export function computeGravityOffset(
  cursorX: number,
  cursorY: number,
  cards: Card[],
): { x: number; y: number } {
  if (cards.length === 0) return { x: cursorX, y: cursorY }
  const cx = cards.reduce((s, c) => s + c.x + c.width / 2, 0) / cards.length
  const cy = cards.reduce((s, c) => s + c.y + c.height / 2, 0) / cards.length
  return {
    x: cursorX + (cx - cursorX) * 0.3,
    y: cursorY + (cy - cursorY) * 0.3,
  }
}
