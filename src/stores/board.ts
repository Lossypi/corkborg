import { writable } from 'svelte/store'
import type { BoardState, Card, Thread, Pin, ImageNode } from '../types'

const EMPTY: BoardState = { cards: [], threads: [], pins: [], images: [] }

function createBoard() {
  const { subscribe, set, update } = writable<BoardState>(EMPTY)

  return {
    subscribe,
    set,
    addCard(card: Card) {
      update(s => ({ ...s, cards: [...s.cards, card] }))
    },
    updateCard(id: string, patch: Partial<Card>) {
      update(s => ({ ...s, cards: s.cards.map(c => c.id === id ? { ...c, ...patch } : c) }))
    },
    removeCard(id: string) {
      update(s => ({
        ...s,
        cards: s.cards.filter(c => c.id !== id),
        threads: s.threads.filter(t => t.from.cardId !== id && t.to.cardId !== id),
        pins: s.pins.filter(p => p.cardId !== id),
      }))
    },
    bringToFront(id: string) {
      update(s => {
        const maxZ = s.cards.reduce((m, c) => Math.max(m, c.zIndex), 0)
        return { ...s, cards: s.cards.map(c => c.id === id ? { ...c, zIndex: maxZ + 1 } : c) }
      })
    },
    addThread(thread: Thread) {
      update(s => ({ ...s, threads: [...s.threads, thread] }))
    },
    updateThread(id: string, patch: Partial<Thread>) {
      update(s => ({ ...s, threads: s.threads.map(t => t.id === id ? { ...t, ...patch } : t) }))
    },
    removeThread(id: string) {
      update(s => ({ ...s, threads: s.threads.filter(t => t.id !== id) }))
    },
    addPin(pin: Pin) {
      update(s => ({ ...s, pins: [...s.pins, pin] }))
    },
    addImage(img: ImageNode) {
      update(s => ({ ...s, images: [...s.images, img] }))
    },
    updateImage(id: string, patch: Partial<ImageNode>) {
      update(s => ({ ...s, images: s.images.map(i => i.id === id ? { ...i, ...patch } : i) }))
    },
    removeImage(id: string) {
      update(s => ({ ...s, images: s.images.filter(i => i.id !== id) }))
    },
  }
}

export const board = createBoard()
