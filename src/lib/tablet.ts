// src/lib/tablet.ts
export function isTablet(): boolean {
  // Only treat as tablet when primary pointer is coarse AND no fine pointer exists at all
  // This avoids falsely triggering on touch-enabled laptops that also have a mouse
  return window.matchMedia('(pointer: coarse) and (any-pointer: coarse)').matches
}
