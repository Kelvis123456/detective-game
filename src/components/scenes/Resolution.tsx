import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

export default function Resolution() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const resetCase = useGameStore((s) => s.resetCase)
  const goTo = useGameStore((s) => s.goTo)

  if (!selectedCase || !caseProgress || !caseProgress.accusedSuspectId) return null

  const accused = selectedCase.suspects.find((s) => s.id === caseProgress.accusedSuspectId)
  const guilty = selectedCase.suspects.find((s) => s.id === selectedCase.solution.guiltyId)
  const isCorrect = caseProgress.correct
  const { explanation, timeline } = selectedCase.solution

  return (
    <div className="relative min-h-screen bg-zinc-950 pb-16">
      {/* Color overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: isCorrect
            ? 'radial-gradient(ellipse at center, rgba(0,60,0,0.25) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(80,0,0,0.35) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 pt-12">
        {/* Result header */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 text-6xl">{isCorrect ? '🏆' : '❌'}</div>
          <h2
            className={`text-4xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
            style={{
              textShadow: isCorrect
                ? '0 0 30px rgba(0,200,0,0.4)'
                : '0 0 30px rgba(200,0,0,0.4)',
            }}
          >
            {isCorrect ? '¡CASO RESUELTO!' : 'ACUSACIÓN INCORRECTA'}
          </h2>
          <p className="text-sm text-zinc-500">
            {isCorrect
              ? 'Tu análisis fue correcto. La justicia prevalece.'
              : 'El verdadero culpable sigue libre. La justicia falló esta vez.'}
          </p>
        </motion.div>

        {/* Accused vs Guilty */}
        {!isCorrect && accused && guilty && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 grid grid-cols-2 gap-4"
          >
            <div className="rounded border border-red-900/40 bg-red-950/20 p-4 text-center">
              <p className="text-[10px] tracking-widest text-red-700 mb-2">TU ACUSADO</p>
              <div className="text-3xl mb-1">{accused.avatar}</div>
              <div className="text-sm font-bold text-red-300">{accused.name}</div>
              <div className="text-xs text-red-700 mt-1">INOCENTE</div>
            </div>
            <div className="rounded border border-green-900/40 bg-green-950/20 p-4 text-center">
              <p className="text-[10px] tracking-widest text-green-700 mb-2">EL CULPABLE REAL</p>
              <div className="text-3xl mb-1">{guilty.avatar}</div>
              <div className="text-sm font-bold text-green-300">{guilty.name}</div>
              <div className="text-xs text-green-700 mt-1">CULPABLE</div>
            </div>
          </motion.div>
        )}

        {/* Guilty reveal */}
        {isCorrect && guilty && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex items-center gap-4 rounded border border-green-900/40 bg-green-950/20 p-5"
          >
            <div className="text-4xl">{guilty.avatar}</div>
            <div>
              <p className="text-[10px] tracking-widest text-green-700 mb-0.5">CULPABLE CONFIRMADO</p>
              <div className="text-xl font-bold text-green-300">{guilty.name}</div>
              <div className="text-xs text-zinc-400">{guilty.occupation}</div>
            </div>
          </motion.div>
        )}

        {/* Motive */}
        {guilty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 rounded border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <p className="text-[10px] tracking-widest text-amber-700 mb-2">MOTIVO REAL</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{guilty.motive}</p>
          </motion.div>
        )}

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded border border-zinc-800 bg-zinc-900/60 p-5"
        >
          <p className="text-[10px] tracking-widest text-zinc-600 mb-3">RECONSTRUCCIÓN DEL CRIMEN</p>
          <p className="text-sm text-zinc-300 leading-7">{explanation}</p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-[10px] tracking-widest text-zinc-600 mb-4">LÍNEA DE TIEMPO</p>
          <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-800" />
            {timeline.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="relative mb-4 pl-4"
              >
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border border-amber-800 bg-amber-950" />
                <p className="text-[10px] text-amber-700 mb-0.5">{event.time}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-4"
        >
          <button
            onClick={resetCase}
            className="flex-1 rounded border border-amber-700/60 bg-amber-950/40 py-3 text-sm tracking-widest uppercase text-amber-300 hover:bg-amber-900/50 transition-all"
          >
            Otro Caso
          </button>
          <button
            onClick={() => goTo('main-menu')}
            className="flex-1 rounded border border-zinc-700 py-3 text-sm tracking-widest uppercase text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
          >
            Menú Principal
          </button>
        </motion.div>
      </div>
    </div>
  )
}
