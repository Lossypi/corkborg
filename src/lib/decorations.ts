// src/lib/decorations.ts

export function mulberry32(seed: number): () => number {
  let a = seed | 0
  return function () {
    a = (a + 0x6D2B79F5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function idSeed(id: string): number {
  return id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
}

const MARGINALIA_POOL = ['?', '??', '!', '→', '14/03', '«проверить»', '✓', '«алиби?»', 'см. Янку', '×']

export interface CardExtras {
  tapeTop: boolean
  tapeCornerTL: boolean
  tapeCornerBR: boolean
  hasMarginalia: boolean
  marginText: string
  stampPos: 'br' | 'bl'
  isPhoto: boolean
  tilt: number
}

export function caseExtras(cardId: string, cardType: string): CardExtras {
  const r = mulberry32(idSeed(cardId))
  return {
    tapeTop:       r() > 0.45,
    tapeCornerTL:  r() > 0.7,
    tapeCornerBR:  r() > 0.75,
    hasMarginalia: r() > 0.4,
    marginText:    MARGINALIA_POOL[Math.floor(r() * MARGINALIA_POOL.length)],
    stampPos:      r() > 0.5 ? 'br' : 'bl',
    isPhoto:       cardType === 'event' && r() > 0.4,
    tilt:          (r() - 0.5) * 6,
  }
}

export function corkBackground(): string {
  const base = '#c8a872'
  const deep = '#6a4020'

  function hexCh(h: string, start: number) { return parseInt(h.slice(start, start + 2), 16) }

  const flecks: [number, number, number, number][] = [
    [120, 80, 8, 0.35], [680, 140, 12, 0.42], [420, 320, 6, 0.3],
    [820, 440, 10, 0.38], [240, 520, 14, 0.4], [60, 380, 7, 0.32],
    [540, 70, 5, 0.28], [780, 280, 9, 0.36], [340, 180, 11, 0.34],
    [600, 520, 8, 0.3], [150, 260, 6, 0.28], [880, 60, 7, 0.32],
  ]

  const dr = hexCh(deep, 1), dg = hexCh(deep, 3), db = hexCh(deep, 5)
  const deepR = dr / 255, deepG = dg / 255, deepB = db / 255

  const fleckEls = flecks.map(([x, y, r, o]) =>
    `<ellipse cx='${x}' cy='${y}' rx='${r}' ry='${r * 0.65}' fill='rgb(${dr},${dg},${db})' fill-opacity='${o}' transform='rotate(${(x + y) % 60} ${x} ${y})'/>`,
  ).join('')

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600' viewBox='0 0 900 600' preserveAspectRatio='none'>
    <defs>
      <filter id='n' x='0' y='0' width='100%' height='100%'>
        <feTurbulence type='fractalNoise' baseFrequency='0.02 0.03' numOctaves='3' seed='7' stitchTiles='stitch'/>
        <feColorMatrix values='0 0 0 0 ${deepR} 0 0 0 0 ${deepG} 0 0 0 0 ${deepB} 0 0 0 0.32 0'/>
      </filter>
      <filter id='blur'><feGaussianBlur stdDeviation='1.2'/></filter>
    </defs>
    <rect width='900' height='600' fill='${base}'/>
    <rect width='900' height='600' filter='url(#n)'/>
    <g filter='url(#blur)' opacity='0.85'>${fleckEls}</g>
  </svg>`

  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}") ${base}`
}

export function paperBackground(color: string, grain = 0.06): string {
  return `
    radial-gradient(circle at 20% 30%, rgba(0,0,0,${grain * 0.8}) 0 1px, transparent 1.5px),
    radial-gradient(circle at 70% 60%, rgba(0,0,0,${grain * 0.6}) 0 1px, transparent 1.5px),
    radial-gradient(circle at 40% 85%, rgba(0,0,0,${grain * 0.5}) 0 1px, transparent 1.5px),
    linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%),
    ${color}
  `
}

export function photoPlaceholder(width: number, height: number): string {
  const tint = '#8a7a60'
  const dark = 'rgb(58,42,24)'
  const shadow = 'rgb(26,17,8)'
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' preserveAspectRatio='none'>
    <defs>
      <filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0'/></filter>
      <radialGradient id='vg' cx='0.5' cy='0.5' r='0.7'><stop offset='0%' stop-color='${tint}' stop-opacity='0'/><stop offset='100%' stop-color='${shadow}' stop-opacity='0.55'/></radialGradient>
    </defs>
    <rect width='100%' height='100%' fill='${tint}'/>
    <circle cx='50%' cy='42%' r='${Math.min(width, height) * 0.16}' fill='${dark}' opacity='0.5'/>
    <ellipse cx='50%' cy='85%' rx='${width * 0.35}' ry='${height * 0.3}' fill='${dark}' opacity='0.5'/>
    <rect width='100%' height='100%' fill='url(#vg)'/>
    <rect width='100%' height='100%' filter='url(#grain)'/>
  </svg>`
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`
}
