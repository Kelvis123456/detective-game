import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getEvidenceTypeColor } from '../../engine/EvidenceEngine'
import type { EvidenceConnection } from '../../types'

interface Line {
  fromId: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export default function ConnectionsBoard() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const connectEvidence = useGameStore((s) => s.connectEvidence)
  const disconnectEvidence = useGameStore((s) => s.disconnectEvidence)

  const [pickedId, setPickedId] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({})

  const playerConnections: EvidenceConnection[] = caseProgress?.playerConnections ?? []

  const recomputeLines = useCallback(() => {
    const next: Line[] = []
    for (const conn of playerConnections) {
      const fromEl = nodeRefs.current[`ev-${conn.fromId}`]
      const toEl = nodeRefs.current[`sus-${conn.toId}`]
      if (!fromEl || !toEl) continue
      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()
      next.push({
        fromId: conn.fromId,
        // Anchor to the thumbtack (top-center), not the card's geometric
        // center, so the string doesn't bisect the icon underneath it.
        x1: fromRect.left + fromRect.width / 2,
        y1: fromRect.top + 4,
        x2: toRect.left + toRect.width / 2,
        y2: toRect.top + 6,
      })
    }
    setLines(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(playerConnections)])

  useLayoutEffect(() => {
    recomputeLines()
    const handle = () => recomputeLines()
    window.addEventListener('resize', handle)
    window.addEventListener('scroll', handle, true)
    return () => {
      window.removeEventListener('resize', handle)
      window.removeEventListener('scroll', handle, true)
    }
  }, [recomputeLines])

  if (!selectedCase || !caseProgress) return null

  const collected = selectedCase.evidence.filter((e) => caseProgress.collectedEvidenceIds.has(e.id))
  const connectionByEvidence = new Map(playerConnections.map((c) => [c.fromId, c.toId]))

  const handleEvidenceClick = (evidenceId: string) => {
    setPickedId((prev) => (prev === evidenceId ? null : evidenceId))
  }

  const handleSuspectClick = (suspectId: string) => {
    if (!pickedId) return
    connectEvidence(pickedId, suspectId)
    setPickedId(null)
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-amber-400 mb-1">Tablero de Conexiones</h3>
          <p className="text-xs text-zinc-400">
            Toca una evidencia y luego al sospechoso que crees que implica.
          </p>
        </div>
        {playerConnections.length > 0 && (
          <div className="flex-shrink-0 rounded border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-center">
            <div className="text-sm font-bold text-amber-400">{playerConnections.length}</div>
            <div className="text-[9px] tracking-widest text-zinc-400">HILOS PUESTOS</div>
          </div>
        )}
      </div>

      {collected.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-zinc-500 text-sm italic">
          Todavía no has recopilado evidencia para conectar.
        </div>
      ) : (
        <>
          {/* Evidence cards */}
          <p className="text-[10px] tracking-widest text-zinc-500 mb-2">EVIDENCIA</p>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {collected.map((evidence, i) => {
              const typeColor = getEvidenceTypeColor(evidence.type)
              const isPicked = pickedId === evidence.id
              const connectedTo = connectionByEvidence.get(evidence.id)
              const rotation = isPicked ? 0 : ((i % 3) - 1) * 1.5
              return (
                <button
                  key={evidence.id}
                  ref={(el) => {
                    nodeRefs.current[`ev-${evidence.id}`] = el
                  }}
                  onClick={() => handleEvidenceClick(evidence.id)}
                  className="relative flex flex-col items-center gap-1.5 rounded bg-zinc-900 p-3 text-center shadow-lg transition-all"
                  style={{
                    border: isPicked ? `1px solid ${typeColor}` : '1px solid #27272a',
                    boxShadow: isPicked ? `0 0 16px ${typeColor}50` : '0 4px 10px rgba(0,0,0,0.4)',
                    transform: `rotate(${rotation}deg) ${isPicked ? 'translateY(-2px)' : ''}`,
                  }}
                >
                  <div
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full border"
                    style={{ backgroundColor: typeColor, borderColor: `${typeColor}80` }}
                  />
                  {evidence.isKey && (
                    <div className="absolute top-1.5 right-1.5 text-[10px] text-amber-500">⭐</div>
                  )}
                  <span className="text-2xl mt-1">{evidence.icon}</span>
                  <span className="text-[10px] font-medium text-zinc-300 leading-tight">{evidence.name}</span>
                  {connectedTo && (
                    <span className="text-[9px] text-amber-600">🧵 conectado</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Suspects */}
          <p className="text-[10px] tracking-widest text-zinc-500 mb-2">SOSPECHOSOS</p>
          <div className="flex flex-wrap gap-3">
            {selectedCase.suspects.map((suspect) => {
              const isTarget = pickedId !== null
              return (
                <button
                  key={suspect.id}
                  ref={(el) => {
                    nodeRefs.current[`sus-${suspect.id}`] = el
                  }}
                  onClick={() => handleSuspectClick(suspect.id)}
                  disabled={!isTarget}
                  className="flex min-w-28 flex-col items-center gap-1 rounded border p-3 transition-all disabled:opacity-60"
                  style={{
                    borderColor: isTarget ? '#b45309' : '#27272a',
                    boxShadow: isTarget ? '0 0 14px rgba(180,83,9,0.35)' : undefined,
                  }}
                >
                  <span className="text-2xl">{suspect.avatar}</span>
                  <span className="max-w-24 truncate text-[10px] text-zinc-400">{suspect.name}</span>
                </button>
              )
            })}
          </div>

          {pickedId && (
            <button
              onClick={() => disconnectEvidence(pickedId)}
              className="mt-4 w-full rounded border border-zinc-800 py-2 text-xs text-zinc-400 hover:text-red-400 hover:border-red-900/50 transition-colors"
            >
              Quitar hilo de esta evidencia
            </button>
          )}
        </>
      )}

      {/* String overlay — a slight quadratic sag reads as yarn, not a debug line */}
      <svg className="pointer-events-none fixed inset-0 z-30" style={{ width: '100vw', height: '100vh' }}>
        {lines.map((line) => {
          const midX = (line.x1 + line.x2) / 2
          const midY = (line.y1 + line.y2) / 2 + 22
          const d = `M ${line.x1} ${line.y1} Q ${midX} ${midY} ${line.x2} ${line.y2}`
          return (
            <g key={line.fromId}>
              <motion.path
                d={d}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 0.3 }}
                stroke="#000"
                strokeWidth={4}
              />
              <motion.path
                d={d}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                stroke="#b91c1c"
                strokeWidth={2.5}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
