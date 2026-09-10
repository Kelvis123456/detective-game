import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getProgressPercent } from '../../engine/CaseEngine'
import type { Scene } from '../../types'

type ActiveTab = 'scene' | 'evidence' | 'digital' | 'accuse'

const BASE_TABS: { id: ActiveTab; label: string; icon: string; scene: Scene }[] = [
  { id: 'scene', label: 'Escena', icon: '🔦', scene: 'crime-scene' },
  { id: 'evidence', label: 'Evidencias', icon: '📎', scene: 'evidence-board' },
]
const DIGITAL_TAB = { id: 'digital' as const, label: 'Digital', icon: '📱', scene: 'digital-forensics' as const }
const ACCUSE_TAB = { id: 'accuse' as const, label: 'Acusar', icon: '⚖️', scene: 'accusation' as const }

export default function GameHUD({ activeTab }: { activeTab: ActiveTab }) {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const goTo = useGameStore((s) => s.goTo)

  if (!selectedCase || !caseProgress) return null

  const hasDigital =
    (selectedCase.digitalDevices?.length ?? 0) > 0 && caseProgress.discoveredDeviceIds.size > 0
  const TABS = hasDigital ? [...BASE_TABS, DIGITAL_TAB, ACCUSE_TAB] : [...BASE_TABS, ACCUSE_TAB]

  const progress = getProgressPercent(caseProgress, selectedCase)
  const evidenceCount = caseProgress.collectedEvidenceIds.size

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-800">
        <motion.div
          className="h-full bg-amber-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-center gap-2 px-4 py-2 md:justify-between">
        {/* Case info */}
        <div className="hidden min-w-0 items-center gap-2 md:flex">
          <span className="text-lg flex-shrink-0">{selectedCase.thumbnail}</span>
          <div className="min-w-0">
            <div className="text-[9px] text-zinc-500 tracking-widest uppercase">Caso activo</div>
            <div className="text-xs font-medium text-amber-400 truncate">{selectedCase.title}</div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => goTo(tab.scene)}
              className={`flex flex-col items-center px-4 py-1 rounded transition-all text-[10px] tracking-wider ${
                activeTab === tab.id
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              <span className="text-base leading-none mb-0.5">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="hidden flex-shrink-0 whitespace-nowrap text-right md:block">
          <div className="text-[9px] text-zinc-500 uppercase tracking-widest">
            {evidenceCount} evidencias · {progress}%
          </div>
          <div className="text-xs text-zinc-500">{selectedCase.difficulty}</div>
        </div>
      </div>
    </div>
  )
}
