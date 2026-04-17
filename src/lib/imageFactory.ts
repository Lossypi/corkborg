// src/lib/imageFactory.ts
import type { ImageNode } from '../types'

let idCounter = 0

export function makeImageNode(x: number, y: number, dataUrl: string): ImageNode {
  return {
    id: `img-${Date.now()}-${++idCounter}`,
    x, y,
    width: 200,
    height: 150,
    dataUrl,
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
