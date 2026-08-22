import type { ImageMetadata } from 'astro'

// Shared images under public/i, imported for build-time optimization.
// The originals keep being served at /i/ for the v1 and v2 sites; v3 emits
// resized, hashed WebP copies under /v3/_astro/ (cached immutable).
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../../../public/i/*.{jpg,png}',
  { eager: true }
)

export function sharedImage(path: string): ImageMetadata {
  const entry = modules[`../../../public${path}`]
  if (!entry) throw new Error(`Unknown shared image: ${path}`)
  return entry.default
}
