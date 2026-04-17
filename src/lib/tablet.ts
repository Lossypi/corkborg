// src/lib/tablet.ts
export function isTablet(): boolean {
  return window.matchMedia('(pointer: coarse)').matches
}
