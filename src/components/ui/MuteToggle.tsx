import { useState } from 'react'
import { audioEngine } from '../../audio/AudioEngine'

export default function MuteToggle({ className = '' }: { className?: string }) {
  const [muted, setMuted] = useState(() => audioEngine.isMuted())

  return (
    <button
      onClick={() => {
        const next = !muted
        audioEngine.setMuted(next)
        setMuted(next)
      }}
      title={muted ? 'Activar sonido' : 'Silenciar'}
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-sm text-zinc-400 hover:text-amber-400 transition-colors ${className}`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
