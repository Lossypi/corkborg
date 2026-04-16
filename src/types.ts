export type LayerKey = 'lor' | 'meta'

export type CardType = 'npc' | 'location' | 'event' | 'idea' | 'generic'

export type Card = {
  id: string
  type: CardType
  x: number
  y: number
  width: number
  height: number
  content: Record<LayerKey, string>
  layers: LayerKey[]
  zIndex: number
  fontSize: number
  pinId: string | null
}

export type Thread = {
  id: string
  layer: LayerKey
  from: { cardId: string }
  to: { cardId: string }
  label: string | null
}

export type Pin = {
  id: string
  cardId: string
}

export type ImageNode = {
  id: string
  x: number
  y: number
  width: number
  height: number
  dataUrl: string
}

export type BoardState = {
  cards: Card[]
  threads: Thread[]
  pins: Pin[]
  images: ImageNode[]
}

export const CARD_SIZES = {
  S: { width: 120, height: 80 },
  M: { width: 180, height: 120 },
  L: { width: 240, height: 160 },
} as const

export type CardSize = keyof typeof CARD_SIZES
