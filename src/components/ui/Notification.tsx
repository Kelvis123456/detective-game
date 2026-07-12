import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

export default function Notification() {
  const notification = useGameStore((s) => s.notification)
  const clear = useGameStore((s) => s.clearNotification)

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(clear, 3000)
    return () => clearTimeout(t)
  }, [notification, clear])

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded border border-amber-600/40 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur"
        >
          <span className="text-lg">🔍</span>
          <span className="text-sm text-amber-200">{notification}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
