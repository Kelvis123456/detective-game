import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useTypewriter } from '../../hooks/useTypewriter'
import {
  getAvailableDialogues,
  getAskedDialogues,
  getEmotionalStateColor,
  getEmotionalStateIcon,
  getSuspectSuspicionLevel,
} from '../../engine/InterrogationEngine'
import type { Dialogue, EmotionalState, Locale, Suspect } from '../../types'
import GameHUD from '../ui/GameHUD'
import { PortraitAvatar } from '../ui/PortraitAvatar'
import { useLanguage } from '../../i18n/LanguageContext'
import { getDictionary, EMOTIONAL_STATE_LABEL } from '../../i18n/dictionary'

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
  locale,
}: {
  suspect: Suspect
  emotionColor: string
  emotionalState: EmotionalState | null
  locale: Locale
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
          {getDictionary(locale).interrogation.suspectLabel}
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
          }}
        >
          <PortraitAvatar seed={suspect.id} size={72} className="rounded-full" />

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
              {EMOTIONAL_STATE_LABEL[locale][emotionalState].toUpperCase()}
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
  const { locale } = useLanguage()
  const dict = getDictionary(locale).interrogation

  const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null)
  // Solo la evidencia que esta respuesta trajo de verdad: la que ya habías encontrado en
  // la escena se anunciaba como "nueva" aunque el contador no cambiaba.
  const [newlyRevealed, setNewlyRevealed] = useState<string[]>([])
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // el aviso se programa con 500 ms de retraso: si se cambia de pantalla antes, no debe
  // aparecer encima de la siguiente (pasaba sobre el teclado del PIN)
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  // selectedSuspect is already re-pointed at the other locale's object by
  // gameStore.retranslateCase on a language switch -- re-derive the
  // currently-displayed dialogue from it by id so the answer text on screen
  // updates too, instead of staying on the stale object.
  useEffect(() => {
    if (!selectedSuspect) return
    setCurrentDialogue((prev) => (prev ? (selectedSuspect.dialogues.find((d) => d.id === prev.id) ?? prev) : prev))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSuspect])

  const { displayed, done, skip } = useTypewriter(currentDialogue?.answer ?? '', 8)

  if (!selectedCase || !selectedSuspect || !caseProgress) return null

  const askedIds = caseProgress.interviewedSuspects[selectedSuspect.id] ?? new Set<string>()
  const available = getAvailableDialogues(selectedSuspect, askedIds)
  const asked = getAskedDialogues(selectedSuspect, askedIds)
  const suspicionLevel = getSuspectSuspicionLevel(selectedSuspect, askedIds)

  const handleAsk = (dialogue: Dialogue) => {
    if (currentDialogue && !done) return
    const fresh = dialogue.revealedEvidenceIds.filter((id) => !caseProgress.collectedEvidenceIds.has(id))
    setCurrentDialogue(dialogue)
    setNewlyRevealed(fresh)
    askQuestion(selectedSuspect.id, dialogue.id, dialogue.revealedEvidenceIds)

    if (fresh.length > 0) {
      const names = fresh
        .map((id) => selectedCase.evidence.find((e) => e.id === id)?.name ?? id)
        .join(', ')
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => showNotification(dict.newEvidenceNotif(names)), 500)
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
        className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-3 sm:px-6"
      >
        <button
          onClick={() => goTo('crime-scene')}
          className="whitespace-nowrap text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
        >
          {dict.backToScene}
        </button>
        <p className="hidden whitespace-nowrap text-[10px] tracking-[0.2em] text-zinc-500 sm:block">
          {dict.title}
        </p>
        <button
          onClick={() => goTo('evidence-board')}
          className="whitespace-nowrap text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
        >
          {dict.toEvidence}
        </button>
      </motion.div>

      <div className="flex flex-1 flex-col-reverse md:flex-row">
        {/* Left: Suspect portrait + info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full md:w-64 md:flex-shrink-0 border-t md:border-t-0 md:border-r border-zinc-800 bg-zinc-900/30 p-5 flex flex-col items-center"
        >
          <SuspectPortrait
            suspect={selectedSuspect}
            emotionColor={emotionColor}
            emotionalState={currentDialogue?.emotionalState ?? null}
            locale={locale}
          />

          <p className="text-sm font-bold text-zinc-100 mb-0.5 text-center">{selectedSuspect.name}</p>
          <p className="text-[10px] text-zinc-400 mb-3 text-center">{selectedSuspect.occupation}</p>

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
                <span>{EMOTIONAL_STATE_LABEL[locale][currentDialogue.emotionalState]}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suspicion meter */}
          {asked.length > 0 && (
            <div className="w-full mb-3">
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>{dict.suspicion}</span>
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
              <div className="h-1.5 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
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
          <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs mb-3">
            <p className="text-[9px] tracking-[0.15em] text-zinc-400 mb-1">{dict.alibi}</p>
            <p className="text-zinc-400 leading-relaxed">{selectedSuspect.alibi}</p>
          </div>

          {/* Already asked */}
          {asked.length > 0 && (
            <div className="w-full">
              <p className="text-[9px] tracking-[0.15em] text-zinc-500 mb-2">{dict.alreadyAsked}</p>
              <div className="space-y-1">
                {asked.map((d) => (
                  <div key={d.id} className="flex items-center gap-1.5 text-[10px] text-zinc-500">
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
          <div className="mb-5">
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
                  <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                    <p className="text-[9px] tracking-[0.15em] text-zinc-400 mb-1">{dict.detective}</p>
                    <p className="text-sm text-zinc-300 italic">"{currentDialogue.question}"</p>
                  </div>

                  {/* Suspect answer */}
                  <div
                    className="rounded-lg border p-4 min-h-36"
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
                          className="text-[10px] text-zinc-400 hover:text-amber-400 transition-colors border border-zinc-800 hover:border-amber-700/60 px-2 py-0.5 rounded"
                        >
                          {dict.skip}
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
                  {done && newlyRevealed.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mt-3 flex items-center gap-2 rounded border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-400"
                      style={{ boxShadow: '0 0 18px rgba(200,130,0,0.12)' }}
                    >
                      <span>🔍</span>
                      <span>
                        {dict.newEvidenceRevealed}{' '}
                        <strong>
                          {newlyRevealed
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
                  <p className="text-sm text-zinc-500 italic">
                    {dict.selectQuestion}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Question list */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-zinc-400 mb-3">
              {dict.availableQuestions(available.length)}
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
                className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-center"
              >
                <p className="text-sm text-zinc-500 mb-1">{dict.interrogationComplete}</p>
                <p className="text-xs text-zinc-500">
                  {dict.askedEverything}
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
