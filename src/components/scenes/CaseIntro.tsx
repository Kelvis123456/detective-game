import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { PortraitAvatar } from '../ui/PortraitAvatar'
import { useLanguage } from '../../i18n/LanguageContext'
import { getDictionary, DIFFICULTY_LABEL } from '../../i18n/dictionary'

export default function CaseIntro() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const goTo = useGameStore((s) => s.goTo)
  const [phase, setPhase] = useState<'intro' | 'suspects'>('intro')
  const { locale } = useLanguage()
  const dict = getDictionary(locale).caseIntro

  if (!selectedCase) return null

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6">
      {/* Animated background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${selectedCase.color}22 0%, transparent 65%)`,
        }}
      />
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-2xl w-full"
      >
        {phase === 'intro' ? (
          <>
            {/* Case badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 flex items-center gap-4"
            >
              <motion.div
                animate={{ boxShadow: [`0 0 12px ${selectedCase.color}30`, `0 0 30px ${selectedCase.color}60`, `0 0 12px ${selectedCase.color}30`] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="flex h-14 w-14 items-center justify-center rounded text-3xl"
                style={{ backgroundColor: `${selectedCase.color}25`, border: `1px solid ${selectedCase.color}50` }}
              >
                {selectedCase.thumbnail}
              </motion.div>
              <div>
                <p className="text-xs tracking-[0.25em] text-zinc-400 mb-0.5">{dict.newCase}</p>
                <h2 className="text-2xl font-bold text-amber-400">{selectedCase.title}</h2>
                <p className="text-xs text-zinc-400">{selectedCase.location} · {selectedCase.date}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{ originX: 0 }}
              className="mb-6 h-px bg-gradient-to-r from-amber-700/60 via-amber-900/30 to-transparent"
            />

            {/* Briefing — shown instantly */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-6 rounded-lg bg-zinc-900/70 p-6 border border-zinc-800/80"
              style={{ boxShadow: `inset 0 0 40px rgba(0,0,0,0.4)` }}
            >
              <p className="text-[10px] tracking-[0.2em] text-zinc-400 mb-4">{dict.briefing}</p>
              <p className="text-sm leading-8 text-zinc-300">{selectedCase.intro}</p>
            </motion.div>

            {/* Case details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-3 mb-6"
            >
              {[
                { label: dict.location, value: selectedCase.location, icon: '📍' },
                { label: dict.date, value: selectedCase.date, icon: '📅' },
                { label: dict.difficulty, value: DIFFICULTY_LABEL[locale][selectedCase.difficulty], icon: '⚠️' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center"
                  style={{ boxShadow: `0 0 0 1px ${selectedCase.color}08` }}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-[10px] tracking-widest text-zinc-400 mb-0.5">{item.label}</div>
                  <div className="text-xs font-medium text-zinc-300">{item.value}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <button
                onClick={() => setPhase('suspects')}
                className="flex-1 rounded border border-amber-700/60 bg-amber-950/40 px-6 py-3 text-sm tracking-widest uppercase text-amber-300 hover:bg-amber-900/50 hover:text-amber-100 transition-all"
              >
                {dict.viewSuspects}
              </button>
              <button
                onClick={() => goTo('crime-scene')}
                className="flex-1 rounded border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm tracking-widest uppercase text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-all"
              >
                {dict.goToScene}
              </button>
            </motion.div>
          </>
        ) : (
          <SuspectsOverview suspects={selectedCase.suspects} color={selectedCase.color} onContinue={() => goTo('crime-scene')} dict={dict} />
        )}
      </motion.div>
    </div>
  )
}

function SuspectsOverview({
  suspects,
  color,
  onContinue,
  dict,
}: {
  suspects: { id: string; name: string; occupation: string; avatar: string; description: string; alibi: string }[]
  color: string
  onContinue: () => void
  dict: ReturnType<typeof getDictionary>['caseIntro']
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
      <h3 className="text-xl font-bold text-amber-400 mb-1">{dict.suspectsIdentified}</h3>
      <p className="text-sm text-zinc-400 mb-6 italic">
        {dict.suspectsHint}
      </p>

      <div className="space-y-3 mb-8">
        {suspects.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="flex items-start gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition-colors"
            style={{ boxShadow: `0 0 0 1px ${color}08` }}
          >
            {/* Portrait mini */}
            <div
              className="flex-shrink-0 flex h-14 w-14 items-center justify-center overflow-hidden rounded"
              style={{
                background: `radial-gradient(circle at 40% 35%, ${color}30 0%, #0a0a0f 100%)`,
                border: `1px solid ${color}30`,
              }}
            >
              <PortraitAvatar seed={s.id} size={52} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-zinc-100">{s.name}</div>
              <div className="text-xs text-amber-600 mb-1">{s.occupation}</div>
              <div className="text-sm text-zinc-400 leading-relaxed">{s.description}</div>
              <div className="mt-2 text-xs text-zinc-400">
                <span className="text-zinc-400">{dict.alibi}</span>
                {s.alibi}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full rounded border border-amber-700/60 bg-amber-950/40 px-6 py-3 text-sm tracking-widest uppercase text-amber-300 hover:bg-amber-900/50 hover:text-amber-100 transition-all"
      >
        {dict.goToCrimeScene}
      </button>
    </motion.div>
  )
}
