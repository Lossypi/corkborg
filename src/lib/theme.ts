// src/lib/theme.ts
import type { LayerKey } from '../types'

export const LAYER_TOKENS = {
  lor: {
    paperMain:          '#f5e8cc',
    paperAlt:           '#fff5de',
    ink:                '#2a1a08',
    thread:             '#a8282a',
    pin:                '#c43030',
    pinStyle:           'push' as const,
    accent:             '#a8282a',
    stampColor:         '#a8282a',
    stampText:          '#ЛОР',
    marginaliaColor:    '#9a2418',
    tapeColor:          'rgba(232,212,150,0.82)',
    modeLabel:          'Лорный',
    fontFactual:        '"Courier Prime", "Courier New", monospace',
    fontHand:           '"Caveat", "Marker Felt", cursive',
    cardTilt:           true,
    sagPx:              28,
    vignette:           'radial-gradient(ellipse 70% 60% at 50% 42%, rgba(255,200,100,0.22) 0%, rgba(255,170,60,0.06) 35%, rgba(30,10,0,0.38) 75%, rgba(20,5,0,0.65) 100%)',
    boardOverlay:       null as string | null,
    boardGrid:          false,
  },
  meta: {
    paperMain:          '#e8f0f8',
    paperAlt:           '#f0f8ff',
    ink:                '#0f1f35',
    thread:             '#2060b8',
    pin:                '#3070cc',
    pinStyle:           'brass' as const,
    accent:             '#2060b8',
    stampColor:         '#1a50a0',
    stampText:          '#МЕТА',
    marginaliaColor:    '#1a409a',
    tapeColor:          'rgba(160,200,240,0.78)',
    modeLabel:          'Логический',
    fontFactual:        '"Courier Prime", "Courier New", monospace',
    fontHand:           '"Caveat", "Marker Felt", cursive',
    cardTilt:           false,
    sagPx:              8,
    vignette:           'radial-gradient(ellipse 100% 90% at 50% 50%, transparent 30%, rgba(10,30,70,0.28) 65%, rgba(5,15,45,0.62) 100%)',
    boardOverlay:       'rgba(18,36,72,0.32)' as string | null,
    boardGrid:          true,
  },
} satisfies Record<LayerKey, {
  paperMain: string; paperAlt: string; ink: string; thread: string
  pin: string; pinStyle: 'push' | 'brass'; accent: string
  stampColor: string; stampText: string; marginaliaColor: string
  tapeColor: string; modeLabel: string; fontFactual: string; fontHand: string
  cardTilt: boolean; sagPx: number; vignette: string
  boardOverlay: string | null; boardGrid: boolean
}>

export const PAPER_FOR_TYPE: Record<string, 'factual' | 'hand'> = {
  npc:      'factual',
  location: 'factual',
  event:    'factual',
  idea:     'hand',
  generic:  'hand',
}

export function layerCssVars(active: LayerKey): Record<string, string> {
  const t = LAYER_TOKENS[active]
  return {
    '--layer-paper-main':   t.paperMain,
    '--layer-paper-alt':    t.paperAlt,
    '--layer-ink':          t.ink,
    '--layer-thread':       t.thread,
    '--layer-accent':       t.accent,
    '--layer-tape':         t.tapeColor,
    '--layer-stamp':        t.stampColor,
    '--layer-font-factual': t.fontFactual,
    '--layer-font-hand':    t.fontHand,
  }
}
