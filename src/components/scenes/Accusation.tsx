import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { Suspect } from '../../types'

export default function Accusation() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const accuseSuspect = useGameStore((s) => s.accuseSuspect)
  const goTo = useGameStore((s) => s.goTo)

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  if (!selectedCase || !caseProgress) return null

  const collectedKey = selectedCase.evidence.filter(
    (e) => e.isKey && caseProgress.collectedEvidenceIds.has(e.id)
  ).length
  const totalKey = selectedCase.evidence.filter((e) => e.isKey).length

  const handleSelect = (suspect: Suspect) => {
    if (confirmId === suspect.id) {
      accuseSuspect(suspect.id)
    } else {
      setConfirmId(suspect.id)
    }
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col">
      {/* Dramatic red vignette */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(80,0,0,0.4) 100%)',
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-red-900/30 bg-zinc-900/80 px-6 py-3">
        <button
          onClick={() => goTo('evidence-board')}
          className="text-xs tracking-widest text-zinc-600 hover:text-amber-400 transition-colors"
        >
          ← EVIDENCIAS
        </button>
        <p className="text-xs tracking-widest text-red-400">⚖️ REALIZAR ACUSACIÓN</p>
        <div />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl w-full px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2
            className="text-3xl font-bold text-red-400 mb-2"
            style={{ textShadow: '0 0 30px rgba(139,26,26,0.6)' }}
          >
            ¿Quién es el culpable?
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Esta decisión cerrará el caso. Asegúrate de tener evidencia suficiente.
          </p>

          {/* Key evidence status */}
          <div className="inline-flex items-center gap-3 rounded border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs">
            <span className="text-zinc-500">Evidencias clave encontradas:</span>
            <span
              className={`font-bold ${collectedKey === totalKey ? 'text-green-400' : 'text-amber-400'}`}
            >
              {collectedKey}/{totalKey}
            </span>
            {collectedKey < totalKey && (
              <span className="text-zinc-600">— considera volver a la escena</span>
            )}
          </div>
        </motion.div>

        {/* Suspect cards */}
        <div className="space-y-4">
          {selectedCase.suspects.map((suspect, i) => {
            const interviewed = caseProgress.interviewedSuspects[suspect.id]?.size ?? 0
            const total = suspect.dialogues.length
            const isHovered = hoveredId === suspect.id
            const isConfirm = confirmId === suspect.id

            return (
              <motion.div
                key={suspect.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(suspect)}
                  onMouseEnter={() => setHoveredId(suspect.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="w-full rounded border text-left transition-all"
                  style={{
                    borderColor: isConfirm
                      ? 'rgba(220,38,38,0.6)'
                      : isHovered
                      ? 'rgba(139,26,26,0.5)'
                      : 'rgba(39,39,42,1)',
                    backgroundColor: isConfirm
                      ? 'rgba(127,29,29,0.2)'
                      : isHovered
                      ? 'rgba(24,24,27,0.8)'
                      : 'rgba(24,24,27,0.5)',
                    boxShadow: isConfirm ? '0 0 20px rgba(139,26,26,0.3)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div
                      className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-3xl"
                      style={{
                        border: isConfirm ? '2px solid rgba(220,38,38,0.5)' : '1px solid #3f3f46',
                        backgroundColor: isConfirm ? 'rgba(127,29,29,0.3)' : '#18181b',
                      }}
                    >
                      {suspect.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-zinc-100 text-lg">{suspect.name}</div>
                      <div className="text-xs text-zinc-500 mb-2">{suspect.occupation}</div>
                      <div className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                        {suspect.description}
                      </div>
                      <div className="mt-2 text-[10px] text-zinc-700">
                        Preguntas respondidas: {interviewed}/{total}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {isConfirm ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="rounded border border-red-700 bg-red-950/50 px-3 py-1.5 text-xs text-red-300"
                        >
                          ¿Confirmar?
                          <br />
                          <span className="text-[10px] text-red-600">Clic para acusar</span>
                        </motion.div>
                      ) : (
                        <div className="text-zinc-700 text-xl">→</div>
                      )}
                    </div>
                  </div>
                </motion.button>

                {/* Cancel confirmation */}
                <AnimatePresence>
                  {isConfirm && (
                    <motion.button
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={() => setConfirmId(null)}
                      className="w-full text-center py-1.5 text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
