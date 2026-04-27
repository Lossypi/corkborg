export type BezierPath = { d: string; midX: number; midY: number }

export function computeSagPath(
  x1: number, y1: number,
  x2: number, y2: number,
  sag = 28,
): BezierPath {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2 + sag
  const c1x = x1 + (mx - x1) * 0.5
  const c1y = y1 + (my - y1) * 0.6
  const c2x = x2 + (mx - x2) * 0.5
  const c2y = y2 + (my - y2) * 0.6
  return {
    d: `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`,
    midX: mx,
    midY: my,
  }
}

export function computeShadowPath(
  x1: number, y1: number,
  x2: number, y2: number,
  sag = 28,
): string {
  const dx = 2, dy = 4
  const mx = (x1 + x2) / 2 + dx
  const my = (y1 + y2) / 2 + sag + dy
  const c1x = (x1 + dx) + (mx - (x1 + dx)) * 0.5
  const c1y = (y1 + dy) + (my - (y1 + dy)) * 0.6
  const c2x = (x2 + dx) + (mx - (x2 + dx)) * 0.5
  const c2y = (y2 + dy) + (my - (y2 + dy)) * 0.6
  return `M ${x1 + dx} ${y1 + dy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2 + dx} ${y2 + dy}`
}
