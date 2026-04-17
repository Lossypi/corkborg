// src/lib/persistence.ts
import type { BoardState } from '../types'

const KEY = 'corkborg-board'

export function loadFromStorage(): BoardState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as BoardState
  } catch {
    return null
  }
}

export function saveToStorage(state: BoardState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function initAutosave(
  subscribe: (cb: (state: BoardState) => void) => () => void,
): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return subscribe(state => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => saveToStorage(state), 500)
  })
}
