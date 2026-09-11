import { useState } from 'react'
import { audioEngine } from '../../audio/AudioEngine'
import { useLanguage } from '../../i18n/LanguageContext'

export default function MuteToggle({ className = '' }: { className?: string }) {
  const [muted, setMuted] = useState(() => audioEngine.isMuted())
  const { locale } = useLanguage()

  return (
    <button
      onClick={() => {
        const next = !muted
        audioEngine.setMuted(next)
        setMuted(next)
      }}
      title={
        locale === 'en' ? (muted ? 'Unmute' : 'Mute') : muted ? 'Activar sonido' : 'Silenciar'
      }
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-sm text-zinc-400 hover:text-amber-400 transition-colors ${className}`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
