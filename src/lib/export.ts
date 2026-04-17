// src/lib/export.ts
import type { BoardState, Card } from '../types'

function sanitize(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').trim() || 'untitled'
}

function cardTitle(card: Card): string {
  const raw = card.content.lor || card.content.meta || ''
  return sanitize(raw.split('\n')[0]) || card.id
}

export function generateMarkdown(state: BoardState): Record<string, string> {
  const files: Record<string, string> = {}

  const titleMap = new Map(state.cards.map(c => [c.id, cardTitle(c)]))

  for (const card of state.cards) {
    const title = cardTitle(card)
    const tags = [card.type, ...card.layers]

    const links = state.threads
      .filter(t => t.from.cardId === card.id || t.to.cardId === card.id)
      .map(t => {
        const otherId = t.from.cardId === card.id ? t.to.cardId : t.from.cardId
        const otherTitle = titleMap.get(otherId)
        return otherTitle ? `- [[${otherTitle}]]` : null
      })
      .filter(Boolean) as string[]

    const lines: string[] = [
      '---',
      `tags: [${tags.join(', ')}]`,
      '---',
      '',
    ]

    if (card.layers.includes('lor') && card.content.lor) {
      lines.push('## Лорный слой', card.content.lor, '')
    }
    if (card.layers.includes('meta') && card.content.meta) {
      lines.push('## Логический слой', card.content.meta, '')
    }
    if (links.length > 0) {
      lines.push('## Связи', ...links, '')
    }

    files[`${title}.md`] = lines.join('\n')
  }

  return files
}

export function exportToJSON(state: BoardState): string {
  return JSON.stringify(state, null, 2)
}

export function importFromJSON(json: string): BoardState {
  return JSON.parse(json) as BoardState
}
