export type Viewport = { x: number; y: number; scale: number }

export function screenToWorld(sx: number, sy: number, vp: Viewport): { x: number; y: number } {
  return {
    x: (sx - vp.x) / vp.scale,
    y: (sy - vp.y) / vp.scale,
  }
}

export function worldToScreen(wx: number, wy: number, vp: Viewport): { x: number; y: number } {
  return {
    x: wx * vp.scale + vp.x,
    y: wy * vp.scale + vp.y,
  }
}
