import { motion } from 'framer-motion'
import Particles from '../ui/Particles'
import { useGameStore } from '../../store/gameStore'
import { getDetectiveRank } from '../../engine/RankEngine'
import MuteToggle from '../ui/MuteToggle'

export default function MainMenu() {
  const goTo = useGameStore((s) => s.goTo)
  const stats = useGameStore((s) => s.playerStats)
  const rank = getDetectiveRank(stats)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950">
      <Particles count={50} />
      <MuteToggle className="fixed right-4 top-4 z-20" />

      {/* Vignette overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Rain lines */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-amber-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              height: '120%',
              animation: `rain-drop ${1.5 + Math.random() * 2}s linear ${Math.random() * 3}s infinite`,
              transform: 'rotate(10deg)',
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 text-6xl animate-float"
        >
          🕵️
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.08em' }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-2 text-5xl font-bold tracking-widest text-amber-400 animate-flicker"
          style={{ textShadow: '0 0 30px rgba(200,169,110,0.6)' }}
        >
          DETECTIVE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-1 text-xl tracking-[0.3em] text-zinc-400"
        >
          AGENCY
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8 h-px w-48 bg-gradient-to-r from-transparent via-amber-600 to-transparent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-12 max-w-sm text-sm leading-relaxed text-zinc-500 italic"
        >
          "La verdad no se encuentra. Se arranca de entre las mentiras."
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex w-72 flex-col gap-4"
        >
          <button
            onClick={() => goTo('case-selection')}
            className="group relative overflow-hidden rounded border border-amber-700/60 bg-amber-950/40 px-6 py-3 text-amber-300 transition-all hover:border-amber-500 hover:bg-amber-900/50 hover:text-amber-100 hover:shadow-lg hover:shadow-amber-900/30"
          >
            <span className="relative z-10 whitespace-nowrap text-sm tracking-wide uppercase font-medium">
              Iniciar Investigación
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-700/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>

          {stats.casesCompleted > 0 && (
            <div className="rounded border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-500">
              <div className="flex justify-between mb-2 border-b border-zinc-800 pb-2">
                <span>Rango:</span>
                <span className="font-bold text-amber-300">🕵️ {rank}</span>
              </div>
              <div className="flex justify-between">
                <span>Casos resueltos:</span>
                <span className="text-amber-400">{stats.casesCompleted}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Acusaciones correctas:</span>
                <span className="text-green-400">{stats.correctAccusations}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Evidencias recopiladas:</span>
                <span className="text-blue-400">{stats.totalEvidenceFound}</span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 z-10 w-full px-6 text-center text-xs tracking-widest text-zinc-400 sm:whitespace-nowrap"
      >
        DETECTIVE AGENCY · CASO CERRADO O NO, LA VERDAD SIEMPRE SALE A LA LUZ
      </motion.p>
    </div>
  )
}
