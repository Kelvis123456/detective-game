import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { ALL_CASES } from '../../data'
import { Case } from '../../types'
import Particles from '../ui/Particles'
import { getDetectiveRank } from '../../engine/RankEngine'

const DIFFICULTY_COLOR: Record<string, string> = {
  Fácil: 'text-green-400 border-green-700/50',
  Medio: 'text-amber-400 border-amber-700/50',
  Difícil: 'text-red-400 border-red-700/50',
}

export default function CaseSelection() {
  const selectCase = useGameStore((s) => s.selectCase)
  const goTo = useGameStore((s) => s.goTo)
  const stats = useGameStore((s) => s.playerStats)
  const rank = getDetectiveRank(stats)

  return (
    <div className="relative min-h-screen bg-zinc-950 pb-16 pt-8">
      <Particles count={30} />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <button
            onClick={() => goTo('main-menu')}
            className="mb-6 text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
          >
            ← VOLVER
          </button>
          <h2 className="text-3xl font-bold tracking-widest text-amber-400">
            EXPEDIENTES ACTIVOS
          </h2>
          <div className="mx-auto mt-3 h-px w-32 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          <p className="mt-4 text-sm text-zinc-500">
            Selecciona un caso para comenzar tu investigación
          </p>
          <span className="mt-3 inline-block rounded border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[10px] tracking-widest text-zinc-500">
            🕵️ RANGO ACTUAL: <span className="text-amber-400">{rank.toUpperCase()}</span>
          </span>
        </motion.div>

        {/* Case cards */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {ALL_CASES.map((case_, i) => (
            <CaseCard key={case_.id} case_={case_} index={i} onSelect={selectCase} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CaseCard({
  case_,
  index,
  onSelect,
}: {
  case_: Case
  index: number
  onSelect: (c: Case) => void
}) {
  const diffClass = DIFFICULTY_COLOR[case_.difficulty] ?? 'text-zinc-400 border-zinc-700'

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect(case_)}
      className="group cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur transition-all hover:border-amber-700/60 hover:bg-zinc-900"
      style={{
        boxShadow: `0 0 0 0 ${case_.color}`,
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px ${case_.color}30`
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent'
      }}
    >
      <div className="flex items-start gap-5">
        {/* Thumbnail */}
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg text-3xl"
          style={{ backgroundColor: `${case_.color}25`, border: `1px solid ${case_.color}40` }}
        >
          {case_.thumbnail}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs text-zinc-400">CASO #{String(index + 1).padStart(3, '0')}</span>
            <span className={`rounded border px-2 py-0.5 text-xs ${diffClass}`}>
              {case_.difficulty}
            </span>
            <span className="text-xs text-zinc-400">{case_.location}</span>
          </div>

          <h3 className="text-xl font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
            {case_.title}
          </h3>
          <p className="text-sm text-zinc-500 italic mb-3">{case_.subtitle}</p>
          <p className="text-sm leading-relaxed text-zinc-400">{case_.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span>📅 {case_.date}</span>
            <span>👥 {case_.suspects.length} sospechosos</span>
            <span>🔍 {case_.evidence.length} evidencias</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 self-center text-zinc-500 group-hover:text-amber-500 transition-colors text-xl">
          →
        </div>
      </div>
    </motion.div>
  )
}
