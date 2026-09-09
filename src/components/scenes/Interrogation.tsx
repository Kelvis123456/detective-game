import { useState } from 'react'
import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useTypewriter } from '../../hooks/useTypewriter'
import {
  getAvailableDialogues,
  getAskedDialogues,
  getEmotionalStateLabel,
  getEmotionalStateColor,
  getEmotionalStateIcon,
  getSuspectSuspicionLevel,
} from '../../engine/InterrogationEngine'
import type { Dialogue, EmotionalState, Suspect } from '../../types'
import GameHUD from '../ui/GameHUD'

/* ─── Emotional-state portrait animations ─── */
const PORTRAIT_MOTION: Record<EmotionalState, TargetAndTransition> = {
  angry: {
    x: [-3, 3, -3, 3, -2, 2, 0],
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1.5 },
  },
  nervous: {
    y: [0, -3, 0, -2, 0],
    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.8 },
  },
  evasive: {
    x: [0, 10, 0, -10, 0],
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
  sad: {
    y: [0, 2, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  calm: {},
}

function SuspectPortrait({
  suspect,
  emotionColor,
  emotionalState,
}: {
  suspect: Suspect
  emotionColor: string
  emotionalState: EmotionalState | null
}) {
  const anim = emotionalState ? PORTRAIT_MOTION[emotionalState] ?? {} : {}

  return (
    <motion.div
      key={emotionalState ?? 'idle'}
      animate={anim}
      className="relative mb-3 mx-auto"
      style={{ width: '148px', height: '200px' }}
    >
      {/* Card background */}
      <div
        className="absolute inset-0 rounded overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0c0b09 0%, #141210 55%, #0a0d14 100%)',
          border: `1px solid ${emotionColor}45`,
          boxShadow: `0 0 50px ${emotionColor}20, 0 8px 32px rgba(0,0,0,0.8), inset 0 0 50px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Scanlines */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
          }}
        />

        {/* Emotional glow */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 38%, ${emotionColor}25 0%, transparent 65%)`,
          }}
        />

        {/* Corner marks */}
        <div className="absolute top-2 left-2.5 text-[8px] tracking-widest font-bold" style={{ color: `${emotionColor}70` }}>
          SOSPECHOSO
        </div>
        <div className="absolute top-2 right-2.5 text-[9px]" style={{ color: `${emotionColor}60` }}>
          ◆
        </div>

        {/* Shoulders silhouette */}
        <div
          className="absolute rounded-t-[50%]"
          style={{
            bottom: '38px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '72px',
            background: `linear-gradient(180deg, ${emotionColor}35 0%, ${emotionColor}12 100%)`,
            borderTop: `1px solid ${emotionColor}30`,
          }}
        />

        {/* Head / avatar circle */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 38% 32%, ${emotionColor}55 0%, ${emotionColor}22 55%, transparent 100%)`,
            border: `2px solid ${emotionColor}40`,
            fontSize: '48px',
            lineHeight: 1,
          }}
        >
          {suspect.avatar}

          {/* Sweat drops — nervous */}
          {emotionalState === 'nervous' && (
            <>
              <motion.div
                animate={{ y: [0, 30], opacity: [1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                className="absolute"
                style={{
                  top: '12px', right: '-10px',
                  width: '4px', height: '10px',
                  background: 'rgba(120,200,255,0.75)',
                  borderRadius: '50% 50% 50% 50% / 20% 20% 80% 80%',
                }}
              />
              <motion.div
                animate={{ y: [0, 22], opacity: [0.8, 0] }}
                transition={{ duration: 1.0, repeat: Infinity, delay: 0.5 }}
                className="absolute"
                style={{
                  top: '22px', right: '-16px',
                  width: '3px', height: '7px',
                  background: 'rgba(120,200,255,0.5)',
                  borderRadius: '50% 50% 50% 50% / 20% 20% 80% 80%',
                }}
              />
            </>
          )}

          {/* Anger veins */}
          {emotionalState === 'angry' && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="absolute top-0 right-0 text-sm"
            >
              💢
            </motion.div>
          )}

          {/* Question marks — evasive */}
          {emotionalState === 'evasive' && (
            <motion.div
              animate={{ opacity: [0, 0.7, 0], y: [-4, -12] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              className="absolute -top-2 -right-1 text-xs text-amber-500"
            >
              ?
            </motion.div>
          )}
        </div>

        {/* Angry glow strip at top */}
        {emotionalState === 'angry' && (
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(220,60,60,0.7), transparent)' }}
          />
        )}

        {/* Sad blue vignette */}
        {emotionalState === 'sad' && (
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(30,80,150,0.25) 0%, transparent 65%)' }}
          />
        )}

        {/* ID plate */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2"
          style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%)',
            borderTop: `1px solid ${emotionColor}30`,
          }}
        >
          {emotionalState && (
            <p className="text-[8px] tracking-[0.15em] mb-0.5" style={{ color: `${emotionColor}80` }}>
              {getEmotionalStateLabel(emotionalState as Parameters<typeof getEmotionalStateLabel>[0]).toUpperCase()}
            </p>
          )}
          <p className="text-[11px] font-bold text-white leading-tight truncate">{suspect.name}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Interrogation() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const selectedSuspect = useGameStore((s) => s.selectedSuspect)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const askQuestion = useGameStore((s) => s.askQuestion)
  const goTo = useGameStore((s) => s.goTo)
  const showNotification = useGameStore((s) => s.showNotification)

  const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null)

  const { displayed, done, skip } = useTypewriter(currentDialogue?.answer ?? '', 8)

  if (!selectedCase || !selectedSuspect || !caseProgress) return null

  const askedIds = caseProgress.interviewedSuspects[selectedSuspect.id] ?? new Set<string>()
  const available = getAvailableDialogues(selectedSuspect, askedIds)
  const asked = getAskedDialogues(selectedSuspect, askedIds)
  const suspicionLevel = getSuspectSuspicionLevel(selectedSuspect, askedIds)

  const handleAsk = (dialogue: Dialogue) => {
    if (currentDialogue && !done) return
    setCurrentDialogue(dialogue)
    askQuestion(selectedSuspect.id, dialogue.id, dialogue.revealedEvidenceIds)

    if (dialogue.revealedEvidenceIds.length > 0) {
      const names = dialogue.revealedEvidenceIds
        .map((id) => selectedCase.evidence.find((e) => e.id === id)?.name ?? id)
        .join(', ')
      setTimeout(() => showNotification(`Nueva evidencia: ${names}`), 500)
    }
  }

  const emotionColor = currentDialogue
    ? getEmotionalStateColor(currentDialogue.emotionalState)
    : '#52525b'

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 pb-16">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 py-3"
      >
        <button
          onClick={() => goTo('crime-scene')}
          className="text-xs tracking-widest text-zinc-600 hover:text-amber-400 transition-colors"
        >
          ← ESCENA
        </button>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500">SALA DE INTERROGATORIO</p>
        <button
          onClick={() => goTo('evidence-board')}
          className="text-xs tracking-widest text-zinc-600 hover:text-amber-400 transition-colors"
        >
          EVIDENCIAS →
        </button>
      </motion.div>

      <div className="flex flex-1">
        {/* Left: Suspect portrait + info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/30 p-5 flex flex-col items-center"
        >
          <SuspectPortrait
            suspect={selectedSuspect}
            emotionColor={emotionColor}
            emotionalState={currentDialogue?.emotionalState ?? null}
          />

          <p className="text-sm font-bold text-zinc-100 mb-0.5 text-center">{selectedSuspect.name}</p>
          <p className="text-[10px] text-zinc-600 mb-3 text-center">{selectedSuspect.occupation}</p>

          {/* Emotional state badge */}
          <AnimatePresence mode="wait">
            {currentDialogue && (
              <motion.div
                key={currentDialogue.emotionalState}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="mb-3 flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs"
                style={{
                  borderColor: `${emotionColor}50`,
                  backgroundColor: `${emotionColor}18`,
                  color: emotionColor,
                  boxShadow: `0 0 14px ${emotionColor}15`,
                }}
              >
                <span>{getEmotionalStateIcon(currentDialogue.emotionalState)}</span>
                <span>{getEmotionalStateLabel(currentDialogue.emotionalState)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suspicion meter */}
          {asked.length > 0 && (
            <div className="w-full mb-3">
              <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
                <span>Sospecha</span>
                <span
                  style={{
                    color:
                      suspicionLevel > 60 ? '#e05555' : suspicionLevel > 30 ? '#f0a830' : '#6b6375',
                    fontWeight: suspicionLevel > 60 ? 700 : 400,
                  }}
                >
                  {suspicionLevel}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${suspicionLevel}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      suspicionLevel > 60
                        ? 'linear-gradient(90deg, #e05555, #ff8080)'
                        : suspicionLevel > 30
                        ? 'linear-gradient(90deg, #c87020, #f0a830)'
                        : 'linear-gradient(90deg, #2a6aaa, #4a9eff)',
                    boxShadow:
                      suspicionLevel > 60
                        ? '0 0 8px rgba(220,80,80,0.6)'
                        : 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Alibi */}
          <div className="w-full rounded border border-zinc-800 bg-zinc-950/60 p-3 text-xs mb-3">
            <p className="text-[9px] tracking-[0.15em] text-zinc-600 mb-1">COARTADA</p>
            <p className="text-zinc-400 leading-relaxed">{selectedSuspect.alibi}</p>
          </div>

          {/* Already asked */}
          {asked.length > 0 && (
            <div className="w-full">
              <p className="text-[9px] tracking-[0.15em] text-zinc-700 mb-2">YA PREGUNTADO</p>
              <div className="space-y-1">
                {asked.map((d) => (
                  <div key={d.id} className="flex items-center gap-1.5 text-[10px] text-zinc-700">
                    <span style={{ color: getEmotionalStateColor(d.emotionalState) }}>
                      {getEmotionalStateIcon(d.emotionalState)}
                    </span>
                    <span className="truncate">{d.question}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Center: Dialogue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-1 flex flex-col p-6"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${emotionColor}06 0%, transparent 60%)`,
          }}
        >
          {/* Answer display */}
          <div className="flex-1 mb-5">
            <AnimatePresence mode="wait">
              {currentDialogue ? (
                <motion.div
                  key={currentDialogue.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {/* Detective question */}
                  <div className="mb-3 rounded border border-zinc-800 bg-zinc-900/60 p-3">
                    <p className="text-[9px] tracking-[0.15em] text-zinc-600 mb-1">DETECTIVE:</p>
                    <p className="text-sm text-zinc-300 italic">"{currentDialogue.question}"</p>
                  </div>

                  {/* Suspect answer */}
                  <div
                    className="rounded border p-4 min-h-36"
                    style={{
                      borderColor: `${emotionColor}35`,
                      backgroundColor: `${emotionColor}09`,
                      boxShadow: `inset 0 0 30px ${emotionColor}06`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] tracking-[0.15em]" style={{ color: `${emotionColor}90` }}>
                        {selectedSuspect.name.toUpperCase()}:
                      </p>
                      {!done && (
                        <button
                          onClick={skip}
                          className="text-[10px] text-zinc-600 hover:text-amber-400 transition-colors border border-zinc-800 hover:border-amber-700/60 px-2 py-0.5 rounded"
                        >
                          Saltar ▶▶
                        </button>
                      )}
                    </div>
                    <p className="text-sm leading-7 text-zinc-200">
                      "{displayed}
                      {!done && (
                        <span className="ml-0.5 inline-block w-0.5 h-4 bg-zinc-400 cursor-blink align-middle" />
                      )}
                      {done && '"'}
                    </p>
                  </div>

                  {/* Revealed evidence */}
                  {done && currentDialogue.revealedEvidenceIds.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mt-3 flex items-center gap-2 rounded border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-400"
                      style={{ boxShadow: '0 0 18px rgba(200,130,0,0.12)' }}
                    >
                      <span>🔍</span>
                      <span>
                        Nueva evidencia revelada:{' '}
                        <strong>
                          {currentDialogue.revealedEvidenceIds
                            .map((id) => selectedCase.evidence.find((e) => e.id === id)?.name ?? id)
                            .join(', ')}
                        </strong>
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-48 flex-col items-center justify-center gap-3"
                >
                  <div className="text-4xl opacity-20">💬</div>
                  <p className="text-sm text-zinc-700 italic">
                    Selecciona una pregunta para comenzar...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Question list */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-zinc-600 mb-3">
              PREGUNTAS DISPONIBLES ({available.length})
            </p>
            {available.length > 0 ? (
              <div className="space-y-2">
                {available.map((dialogue, i) => (
                  <motion.button
                    key={dialogue.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => handleAsk(dialogue)}
                    disabled={!done && currentDialogue !== null}
                    className="w-full rounded border border-zinc-800 bg-zinc-900/50 p-3 text-left text-sm text-zinc-400 hover:border-amber-700/50 hover:bg-zinc-800/50 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="text-amber-700 mr-2">›</span>
                    {dialogue.question}
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded border border-zinc-800 bg-zinc-900/30 p-4 text-center"
              >
                <p className="text-sm text-zinc-500 mb-1">✓ Interrogatorio completado</p>
                <p className="text-xs text-zinc-700">
                  Has preguntado todo lo que hay que preguntar.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <GameHUD activeTab="scene" />
    </div>
  )
}
