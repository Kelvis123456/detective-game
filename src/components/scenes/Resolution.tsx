import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getConnectionAccuracy, isConnectionCorrect } from '../../engine/EvidenceEngine'
import { PortraitAvatar } from '../ui/PortraitAvatar'
import { useLanguage } from '../../i18n/LanguageContext'
import { getDictionary, ENDING_TEXT } from '../../i18n/dictionary'
import type { EndingType } from '../../types'

const ENDING_ICON_TONE: Record<EndingType, { icon: string; tone: 'green' | 'amber' | 'red' | 'zinc' }> = {
  'correct-full-case': { icon: '🏆', tone: 'green' },
  'correct-partial-reasoning': { icon: '🔶', tone: 'amber' },
  'wrong-suspect-culprit-escapes': { icon: '❌', tone: 'red' },
  'insufficient-evidence': { icon: '📁', tone: 'zinc' },
}

const TONE_STYLES: Record<
  'green' | 'amber' | 'red' | 'zinc',
  { vignette: string; text: string; glow: string; border: string; bg: string }
> = {
  green: {
    vignette: 'radial-gradient(ellipse at center, rgba(0,60,0,0.25) 0%, transparent 70%)',
    text: 'text-green-400',
    glow: '0 0 30px rgba(0,200,0,0.4)',
    border: 'border-green-900/40',
    bg: 'bg-green-950/20',
  },
  amber: {
    vignette: 'radial-gradient(ellipse at center, rgba(90,60,0,0.25) 0%, transparent 70%)',
    text: 'text-amber-400',
    glow: '0 0 30px rgba(200,150,0,0.35)',
    border: 'border-amber-900/40',
    bg: 'bg-amber-950/20',
  },
  red: {
    vignette: 'radial-gradient(ellipse at center, rgba(80,0,0,0.35) 0%, transparent 70%)',
    text: 'text-red-400',
    glow: '0 0 30px rgba(200,0,0,0.4)',
    border: 'border-red-900/40',
    bg: 'bg-red-950/20',
  },
  zinc: {
    vignette: 'radial-gradient(ellipse at center, rgba(60,60,60,0.25) 0%, transparent 70%)',
    text: 'text-zinc-400',
    glow: '0 0 30px rgba(150,150,150,0.25)',
    border: 'border-zinc-700/40',
    bg: 'bg-zinc-900/40',
  },
}

export default function Resolution() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const resetCase = useGameStore((s) => s.resetCase)
  const goTo = useGameStore((s) => s.goTo)
  const { locale } = useLanguage()
  const dict = getDictionary(locale).resolution
  const PROOF_LABELS = {
    means: getDictionary(locale).accusation.means,
    motive: getDictionary(locale).accusation.motive,
    opportunity: getDictionary(locale).accusation.opportunity,
  } as const

  if (!selectedCase || !caseProgress || !caseProgress.accusedSuspectId) return null

  const accused = selectedCase.suspects.find((s) => s.id === caseProgress.accusedSuspectId)
  const guilty = selectedCase.suspects.find((s) => s.id === selectedCase.solution.guiltyId)
  const ending: EndingType =
    caseProgress.ending ?? (caseProgress.correct ? 'correct-full-case' : 'wrong-suspect-culprit-escapes')
  const isCorrect = caseProgress.correct
  const meta = { ...ENDING_ICON_TONE[ending], ...ENDING_TEXT[locale][ending] }
  const tone = TONE_STYLES[meta.tone]
  const { explanation, timeline, proof } = selectedCase.solution
  const connectionAccuracy = getConnectionAccuracy(selectedCase, caseProgress.playerConnections)

  return (
    <div className="relative min-h-screen bg-zinc-950 pb-16">
      {/* Color overlay */}
      <div className="pointer-events-none fixed inset-0" style={{ background: tone.vignette }} />

      <div className="relative z-10 mx-auto max-w-2xl px-6 pt-12">
        {/* Result header */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 text-6xl emoji-tone">{meta.icon}</div>
          <h2
            className={`text-4xl font-bold mb-2 ${tone.text}`}
            style={{ textShadow: tone.glow }}
          >
            {meta.title}
          </h2>
          <p className="text-sm text-zinc-400">{meta.subtitle}</p>
        </motion.div>

        {/* Partial reasoning breakdown */}
        {ending === 'correct-partial-reasoning' && proof && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6 rounded-lg border border-amber-900/40 bg-amber-950/10 p-4"
          >
            <p className="text-[10px] tracking-widest text-amber-600 mb-3">{dict.reasoningBreakdown}</p>
            <div className="grid grid-cols-3 gap-3">
              {(['means', 'motive', 'opportunity'] as const).map((cat) => {
                const requiredForCat = proof[cat] ?? []
                const suppliedId = caseProgress.accusationProof?.[cat]
                const satisfied = requiredForCat.length === 0 || (!!suppliedId && requiredForCat.includes(suppliedId))
                return (
                  <div
                    key={cat}
                    className={`rounded border p-2 text-center text-xs ${
                      satisfied ? 'border-green-900/40 text-green-400' : 'border-red-900/40 text-red-400'
                    }`}
                  >
                    {satisfied ? '✓' : '✗'} {PROOF_LABELS[cat]}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Accused vs Guilty */}
        {!isCorrect && accused && guilty && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 grid grid-cols-2 gap-4"
          >
            <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-4 text-center">
              <p className="text-[10px] tracking-widest text-red-400 mb-2">{dict.yourAccused}</p>
              <div className="mb-1 flex justify-center">
                <PortraitAvatar seed={accused.id} size={48} className="rounded-full" />
              </div>
              <div className="text-sm font-bold text-red-300">{accused.name}</div>
              <div className="text-xs text-red-400 mt-1">{dict.innocent}</div>
            </div>
            <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4 text-center">
              <p className="text-[10px] tracking-widest text-amber-600 mb-2">{dict.realCulprit}</p>
              <div className="mb-1 flex justify-center">
                <PortraitAvatar seed={guilty.id} size={48} className="rounded-full" />
              </div>
              <div className="text-sm font-bold text-amber-300">{guilty.name}</div>
              <div className="text-xs text-amber-600 mt-1">
                {ending === 'insufficient-evidence' ? dict.stillFreeNoClues : dict.stillFreeEscaped}
              </div>
            </div>
          </motion.div>
        )}

        {/* Guilty reveal */}
        {isCorrect && guilty && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mb-6 flex items-center gap-4 rounded border ${tone.border} ${tone.bg} p-5`}
          >
            <PortraitAvatar seed={guilty.id} size={64} className="rounded-full flex-shrink-0" />
            <div>
              <p className="text-[10px] tracking-widest text-green-400 mb-0.5">{dict.culpritConfirmed}</p>
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
            className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <p className="text-[10px] tracking-widest text-amber-600 mb-2">{dict.realMotive}</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{guilty.motive}</p>
          </motion.div>
        )}

        {/* Connections board reveal */}
        {caseProgress.playerConnections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <p className="text-[10px] tracking-widest text-amber-600 mb-3">
              {dict.yourConnectionsBoard(connectionAccuracy.correct, connectionAccuracy.total)}
            </p>
            <div className="space-y-1.5">
              {caseProgress.playerConnections.map((conn) => {
                const evidence = selectedCase.evidence.find((e) => e.id === conn.fromId)
                const suspect = selectedCase.suspects.find((s) => s.id === conn.toId)
                const correct = isConnectionCorrect(selectedCase, conn)
                return (
                  <div
                    key={conn.fromId}
                    className={`flex items-center gap-2 rounded border p-2 text-xs ${
                      correct ? 'border-green-900/40 text-green-400' : 'border-red-900/40 text-red-400'
                    }`}
                  >
                    <span>{correct ? '✓' : '✗'}</span>
                    <span className="truncate">{evidence?.name ?? conn.fromId}</span>
                    <span className="text-zinc-400">→</span>
                    <span className="truncate">{suspect?.name ?? conn.toId}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/60 p-5"
        >
          <p className="text-[10px] tracking-widest text-zinc-400 mb-3">{dict.crimeReconstruction}</p>
          <p className="text-sm text-zinc-300 leading-7">{explanation}</p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-[10px] tracking-widest text-zinc-400 mb-4">{dict.timeline}</p>
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
                {/* -22px = 16px del pl-4 del item + 6px de medio punto: centrado sobre la línea
                    (con -left-1.5 quedaba 16px a la derecha de ella) */}
                <div className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border border-amber-800 bg-amber-950" />
                <p className="text-[10px] text-amber-600 mb-0.5">{event.time}</p>
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
            {dict.anotherCase}
          </button>
          <button
            onClick={() => goTo('main-menu')}
            className="flex-1 rounded border border-zinc-700 py-3 text-sm tracking-widest uppercase text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
          >
            {dict.mainMenuBtn}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
