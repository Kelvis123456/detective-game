import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getCollectedEvidence } from '../../engine/CaseEngine'
import { groupEvidenceByType } from '../../engine/EvidenceEngine'
import { PortraitAvatar } from '../ui/PortraitAvatar'
import { useLanguage } from '../../i18n/LanguageContext'
import { getDictionary, EVIDENCE_TYPE_LABEL } from '../../i18n/dictionary'
import type { Evidence, EvidenceType, ProofCategory, Suspect } from '../../types'

export default function Accusation() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const submitAccusation = useGameStore((s) => s.submitAccusation)
  const goTo = useGameStore((s) => s.goTo)
  const { locale } = useLanguage()
  const dict = getDictionary(locale).accusation

  const PROOF_CATEGORIES: { id: ProofCategory; label: string; hint: string; icon: string }[] = [
    { id: 'means', label: dict.means, hint: dict.meansHint, icon: '🔧' },
    { id: 'motive', label: dict.motive, hint: dict.motiveHint, icon: '🎯' },
    { id: 'opportunity', label: dict.opportunity, hint: dict.opportunityHint, icon: '⏱️' },
  ]

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [accusedSuspect, setAccusedSuspect] = useState<Suspect | null>(null)
  const [proofChoice, setProofChoice] = useState<Partial<Record<ProofCategory, string>>>({})

  // Re-sync the suspect mid-accusation by id when selectedCase changes (a
  // language switch re-points it at the other locale's object -- see
  // gameStore.retranslateCase / CrimeScene's identical fix).
  useEffect(() => {
    if (!selectedCase) return
    setAccusedSuspect((prev) => (prev ? (selectedCase.suspects.find((s) => s.id === prev.id) ?? prev) : prev))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCase])

  if (!selectedCase || !caseProgress) return null

  const collectedKey = selectedCase.evidence.filter(
    (e) => e.isKey && caseProgress.collectedEvidenceIds.has(e.id)
  ).length
  const totalKey = selectedCase.evidence.filter((e) => e.isKey).length
  const requiresProof = Boolean(selectedCase.solution.proof)

  const handleSelect = (suspect: Suspect) => {
    if (confirmId !== suspect.id) {
      setConfirmId(suspect.id)
      return
    }
    if (requiresProof) {
      setAccusedSuspect(suspect)
    } else {
      submitAccusation({ suspectId: suspect.id })
    }
  }

  if (accusedSuspect) {
    const collectedEvidence = getCollectedEvidence(caseProgress, selectedCase)

    return (
      <div className="relative min-h-screen bg-zinc-950 flex flex-col">
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(80,0,0,0.4) 100%)',
          }}
        />
        <div className="relative z-10 flex items-center justify-between border-b border-red-900/30 bg-zinc-900/80 px-6 py-3">
          <button
            onClick={() => setAccusedSuspect(null)}
            className="text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
          >
            {dict.backChange}
          </button>
          <p className="text-xs tracking-widest text-red-400">{dict.buildYourCase}</p>
          <div />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl w-full px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              {dict.accusing(accusedSuspect.name)}
            </h2>
            <p className="text-sm text-zinc-400">
              {dict.buildHint}
            </p>
          </motion.div>

          <div className="space-y-6 mb-8">
            {PROOF_CATEGORIES.map((cat) => {
              const grouped = groupEvidenceByType(collectedEvidence)
              const types = Object.keys(grouped) as EvidenceType[]
              return (
                <div key={cat.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-bold text-amber-400">{cat.label}</span>
                    <span className="text-xs text-zinc-400">— {cat.hint}</span>
                  </div>
                  <button
                    onClick={() => setProofChoice((prev) => ({ ...prev, [cat.id]: undefined }))}
                    className={`mb-3 w-full rounded border px-3 py-2 text-left text-xs italic transition-all ${
                      !proofChoice[cat.id]
                        ? 'border-zinc-700 bg-zinc-900/60 text-zinc-400'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {dict.noSpecificEvidence}
                  </button>
                  <div className="space-y-3">
                    {types.map((type) => (
                      <div key={type}>
                        <p className="mb-1.5 text-[10px] tracking-widest text-zinc-400">
                          {EVIDENCE_TYPE_LABEL[locale][type].toUpperCase()}
                        </p>
                        <div className="grid gap-2">
                          {grouped[type].map((e: Evidence) => (
                            <button
                              key={e.id}
                              onClick={() => setProofChoice((prev) => ({ ...prev, [cat.id]: e.id }))}
                              className={`rounded border px-3 py-2 text-left text-xs transition-all ${
                                proofChoice[cat.id] === e.id
                                  ? 'border-amber-700/60 bg-amber-950/30 text-amber-300'
                                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              <span className="mr-1.5">{e.icon}</span>
                              {e.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() =>
              submitAccusation({
                suspectId: accusedSuspect.id,
                meansEvidenceId: proofChoice.means,
                motiveEvidenceId: proofChoice.motive,
                opportunityEvidenceId: proofChoice.opportunity,
              })
            }
            className="w-full rounded border border-red-700 bg-red-950/40 px-6 py-3 text-sm tracking-widest uppercase text-red-300 hover:bg-red-900/50 hover:text-red-100 transition-all"
          >
            {dict.submitAccusation}
          </button>
        </div>
      </div>
    )
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
          className="text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
        >
          {dict.backToEvidence}
        </button>
        <p className="text-xs tracking-widest text-red-400">{dict.makeAccusation}</p>
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
            {dict.whoIsGuilty}
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            {dict.decisionHint}
          </p>

          {/* Key evidence status */}
          <div className="inline-flex items-center gap-3 rounded border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs">
            <span className="text-zinc-400">{dict.keyEvidenceFound}</span>
            <span
              className={`font-bold ${collectedKey === totalKey ? 'text-green-400' : 'text-amber-400'}`}
            >
              {collectedKey}/{totalKey}
            </span>
            {collectedKey < totalKey && (
              <span className="text-zinc-400">{dict.considerReturning}</span>
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
                      className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
                      style={{
                        border: isConfirm ? '2px solid rgba(220,38,38,0.5)' : '1px solid #3f3f46',
                        backgroundColor: isConfirm ? 'rgba(127,29,29,0.3)' : '#18181b',
                      }}
                    >
                      <PortraitAvatar seed={suspect.id} size={52} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-zinc-100 text-lg">{suspect.name}</div>
                      <div className="text-xs text-zinc-400 mb-2">{suspect.occupation}</div>
                      <div className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {suspect.description}
                      </div>
                      <div className="mt-2 text-[10px] text-zinc-400">
                        {dict.questionsAnswered(interviewed, total)}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {isConfirm ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="rounded border border-red-700 bg-red-950/50 px-3 py-1.5 text-xs text-red-300"
                        >
                          {dict.confirm}
                          <br />
                          <span className="text-[10px] text-red-300">{dict.clickToContinue}</span>
                        </motion.div>
                      ) : (
                        <div className="text-zinc-400 text-xl">→</div>
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
                      className="w-full text-center py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {dict.cancel}
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
