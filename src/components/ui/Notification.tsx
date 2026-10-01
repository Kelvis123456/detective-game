import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

export default function Notification() {
  const notifications = useGameStore((s) => s.notifications)
  const clear = useGameStore((s) => s.clearNotification)
  const current = notifications[0] ?? null

  // Depende de la cola, no del texto: con dos mensajes idénticos seguidos el texto no
  // cambiaba, el efecto no volvía a correr y el segundo toast nunca se cerraba.
  useEffect(() => {
    if (!current) return
    const t = setTimeout(clear, 3000)
    return () => clearTimeout(t)
  }, [current, notifications.length, clear])

  return (
    // región siempre montada: los lectores de pantalla anuncian lo que entra (antes la
    // evidencia encontrada era silenciosa)
    <div role="status" aria-live="polite">
    <AnimatePresence>
      {current && (
        <motion.div
          key={current}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 right-6 left-6 z-50 flex max-w-sm items-center gap-3 rounded border border-amber-600/40 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur md:left-auto md:bottom-20"
        >
          <span className="text-lg emoji-tone" aria-hidden="true">🔍</span>
          <span className="text-sm text-amber-200">{current}</span>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}
