import { useMemo } from 'react'

const TILE = 128

/**
 * One small noise tile generated once and repeated as a background, nudged with a CSS
 * steps() animation. The old version rebuilt a full-viewport ImageData every frame
 * (~2.6M Math.random() calls at 1440x900): ~20fps on desktop for an effect at 3% opacity,
 * and it starved the typewriter's timers so answers typed 4x slower than intended.
 */
function makeNoiseTile(): string | null {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = TILE
  const ctx = canvas.getContext('2d')
  if (!ctx) return null // e.g. jsdom, or a browser with canvas blocked: no grain, no crash
  const img = ctx.createImageData(TILE, TILE)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = Math.random() * 30
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

// Sin mix-blend-overlay: a 3% de opacidad no se distingue, y la mezcla a pantalla
// completa costaba ~15fps al recomponerse en cada paso de la animación.
export default function FilmGrain({ opacity = 0.035 }: { opacity?: number }) {
  const tile = useMemo(makeNoiseTile, [])
  if (!tile) return null
  return (
    <div
      aria-hidden="true"
      className="film-grain pointer-events-none fixed -inset-[128px] z-50"
      style={{ opacity, backgroundImage: `url(${tile})` }}
    />
  )
}
