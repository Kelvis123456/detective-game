import { useEffect, useRef } from 'react'
import { Howl, Howler } from 'howler'

const soundCache = new Map<string, Howl>()

function getOrCreate(src: string, loop: boolean, volume: number): Howl {
  const key = `${src}:${loop}`
  if (!soundCache.has(key)) {
    soundCache.set(
      key,
      new Howl({ src: [src], loop, volume, html5: true })
    )
  }
  return soundCache.get(key)!
}

export function useBackgroundMusic(src: string | null, volume = 0.3) {
  const howlRef = useRef<Howl | null>(null)

  useEffect(() => {
    if (!src) return

    howlRef.current = getOrCreate(src, true, volume)
    howlRef.current.play()

    return () => {
      howlRef.current?.fade(volume, 0, 1000)
      setTimeout(() => howlRef.current?.stop(), 1100)
    }
  }, [src, volume])
}

export function playSound(src: string, volume = 0.6) {
  const howl = new Howl({ src: [src], volume })
  howl.play()
}

export function setGlobalVolume(volume: number) {
  Howler.volume(volume)
}
