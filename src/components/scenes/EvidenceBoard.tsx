import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { Evidence } from '../../types'
import { getEvidenceTypeLabel, getEvidenceTypeColor } from '../../engine/EvidenceEngine'
import GameHUD from '../ui/GameHUD'
import ConnectionsBoard from './ConnectionsBoard'
import { PortraitAvatar } from '../ui/PortraitAvatar'

type BoardMode = 'grid' | 'connections'

export default function EvidenceBoard() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const goTo = useGameStore((s) => s.goTo)

  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [boardMode, setBoardMode] = useState<BoardMode>('grid')

  if (!selectedCase || !caseProgress) return null

  const collected = selectedCase.evidence.filter((e) =>
    caseProgress.collectedEvidenceIds.has(e.id)
  )
  const missing = selectedCase.evidence.filter(
    (e) => !caseProgress.collectedEvidenceIds.has(e.id)
  )

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 py-3">
        <button
          onClick={() => goTo('crime-scene')}
          className="text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
        >
          ← ESCENA
        </button>
        <div className="text-center">
          <p className="text-xs text-zinc-400 tracking-widest">TABLERO DE EVIDENCIAS</p>
          <p className="text-sm font-medium text-amber-400">{selectedCase.title}</p>
        </div>
        <button
          onClick={() => goTo('accusation')}
          className="rounded border border-red-900/60 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/30 transition-all"
        >
          ⚖️ Acusar
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center border-b border-zinc-800 bg-zinc-900/40 px-6 py-2.5">
        <div className="inline-flex rounded-lg bg-zinc-900 p-1">
          <button
            onClick={() => setBoardMode('grid')}
            className={`rounded-md px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
              boardMode === 'grid' ? 'bg-amber-900/50 text-amber-300' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📋 Corcho
          </button>
          <button
            onClick={() => setBoardMode('connections')}
            className={`rounded-md px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
              boardMode === 'connections' ? 'bg-amber-900/50 text-amber-300' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🧵 Conexiones
          </button>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col md:flex-row"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #1a1208 0%, #0a0a0f 100%),
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(200,169,110,0.04) 39px, rgba(200,169,110,0.04) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(200,169,110,0.04) 39px, rgba(200,169,110,0.04) 40px)
          `,
        }}
      >
        {boardMode === 'connections' ? (
          <ConnectionsBoard />
        ) : (
          <>
        {/* Main board */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-amber-400 mb-1">
              Evidencias Recopiladas ({collected.length}/{selectedCase.evidence.length})
            </h3>
            <div className="h-px bg-gradient-to-r from-amber-800/40 to-transparent" />
          </div>

          {collected.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-zinc-500 text-sm italic">
              Todavía no has recopilado ninguna evidencia. Regresa a la escena del crimen.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {collected.map((evidence, i) => (
                <EvidenceCard
                  key={evidence.id}
                  evidence={evidence}
                  index={i}
                  isSelected={selectedEvidence?.id === evidence.id}
                  onClick={() =>
                    setSelectedEvidence(selectedEvidence?.id === evidence.id ? null : evidence)
                  }
                />
              ))}
            </div>
          )}

          {/* Missing evidence hint */}
          {missing.length > 0 && (
            <div className="mt-8">
              <p className="text-xs text-zinc-500 tracking-widest mb-3">
                EVIDENCIA PENDIENTE ({missing.length})
              </p>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
                {missing.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-col items-center gap-1 rounded border border-zinc-800/50 bg-zinc-900/20 p-2 opacity-30"
                  >
                    <span className="text-xl grayscale emoji-tone">{e.icon}</span>
                    <span className="text-[9px] text-zinc-500 text-center">???</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="w-full md:w-72 md:flex-shrink-0 border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-900/50">
          <AnimatePresence mode="wait">
            {selectedEvidence ? (
              <motion.div
                key={selectedEvidence.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl emoji-tone">{selectedEvidence.icon}</span>
                  <div>
                    <div
                      className="text-[9px] tracking-widest mb-0.5"
                      style={{ color: getEvidenceTypeColor(selectedEvidence.type) }}
                    >
                      {getEvidenceTypeLabel(selectedEvidence.type).toUpperCase()}
                    </div>
                    <h4 className="font-bold text-zinc-100 leading-tight">{selectedEvidence.name}</h4>
                  </div>
                </div>

                {selectedEvidence.isKey && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-amber-500">
                    <span>⭐</span>
                    <span>Evidencia clave del caso</span>
                  </div>
                )}

                <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                  <p className="text-[10px] text-zinc-400 mb-1">DESCRIPCIÓN</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{selectedEvidence.description}</p>
                </div>

                <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                  <p className="text-[10px] text-zinc-400 mb-1">ENCONTRADO EN</p>
                  <p className="text-xs text-zinc-400">{selectedEvidence.location}</p>
                </div>

                <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-3">
                  <p className="text-[10px] text-amber-700 tracking-widest mb-1">ANÁLISIS FORENSE</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedEvidence.analysis}</p>
                </div>

                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="mt-4 w-full rounded border border-zinc-700 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Cerrar
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 flex flex-col gap-4"
              >
                <p className="text-xs text-zinc-400 italic">
                  Selecciona una evidencia para ver el análisis forense completo.
                </p>

                {/* Suspects summary */}
                <div>
                  <p className="text-[10px] tracking-widest text-zinc-500 mb-2">SOSPECHOSOS</p>
                  {selectedCase.suspects.map((suspect) => {
                    const interviewed = caseProgress.interviewedSuspects[suspect.id]?.size ?? 0
                    const total = suspect.dialogues.length
                    const pct = total > 0 ? (interviewed / total) * 100 : 0
                    return (
                      <div key={suspect.id} className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <PortraitAvatar seed={suspect.id} size={18} className="rounded-full" />
                          <span className="text-xs text-zinc-400">{suspect.name}</span>
                          <span className="ml-auto text-[10px] text-zinc-400">
                            {interviewed}/{total}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-amber-700 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => goTo('accusation')}
                  className="mt-auto w-full rounded border border-red-900/60 bg-red-950/20 py-2 text-xs tracking-widest uppercase text-red-400 hover:bg-red-950/40 transition-all"
                >
                  Realizar Acusación
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
          </>
        )}
      </div>
      <GameHUD activeTab="evidence" />
    </div>
  )
}

function EvidenceCard({
  evidence,
  index,
  isSelected,
  onClick,
}: {
  evidence: Evidence
  index: number
  isSelected: boolean
  onClick: () => void
}) {
  const typeColor = getEvidenceTypeColor(evidence.type)

  return (
    <motion.button
      initial={{ opacity: 0, y: 15, rotate: (Math.random() - 0.5) * 4 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: isSelected ? 0 : (index % 3 - 1) * 1.5,
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.08, rotate: 0 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 rounded bg-zinc-900 p-3 text-center shadow-lg transition-shadow"
      style={{
        border: isSelected ? `1px solid ${typeColor}60` : '1px solid #27272a',
        boxShadow: isSelected ? `0 0 15px ${typeColor}30` : undefined,
      }}
    >
      {/* Thumbtack */}
      <div
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full border"
        style={{ backgroundColor: typeColor, borderColor: `${typeColor}80` }}
      />

      {evidence.isKey && (
        <div className="absolute top-2 right-2 text-[10px] text-amber-500">⭐</div>
      )}

      <span className="text-2xl mt-1 emoji-tone">{evidence.icon}</span>
      <span className="text-[10px] font-medium text-zinc-300 leading-tight">{evidence.name}</span>
      <span
        className="text-[9px] rounded px-1 py-0.5"
        style={{ color: typeColor, backgroundColor: `${typeColor}15` }}
      >
        {getEvidenceTypeLabel(evidence.type)}
      </span>
    </motion.button>
  )
}
