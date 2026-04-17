export type BezierPath = { d: string; midX: number; midY: number }

export function computeSagPath(
  x1: number, y1: number,
  x2: number, y2: number,
): BezierPath {
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  const sag  = dist * 0.25

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  const cp1x = x1 + dx * 0.25
  const cp1y = midY + sag
  const cp2x = x1 + dx * 0.75
  const cp2y = midY + sag

  return {
    d: `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`,
    midX,
    midY: midY + sag * 0.5,
  }
}
