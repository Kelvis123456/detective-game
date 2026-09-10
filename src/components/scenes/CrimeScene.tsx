import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { Hotspot, Evidence, DigitalDevice } from '../../types'
import GameHUD from '../ui/GameHUD'
import { SceneWindow, SceneCenterpiece } from './crimeSceneDecor'
import { PortraitAvatar } from '../ui/PortraitAvatar'
import { audioEngine } from '../../audio/AudioEngine'

export default function CrimeScene() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const collectEvidence = useGameStore((s) => s.collectEvidence)
  const discoverDevice = useGameStore((s) => s.discoverDevice)
  const goTo = useGameStore((s) => s.goTo)
  const showNotification = useGameStore((s) => s.showNotification)
  const startInterview = useGameStore((s) => s.startInterview)

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [activeEvidence, setActiveEvidence] = useState<Evidence | null>(null)
  const [activeDevice, setActiveDevice] = useState<DigitalDevice | null>(null)
  const [activeFlavorHotspot, setActiveFlavorHotspot] = useState<Hotspot | null>(null)
  const [viewedFlavorHotspotIds, setViewedFlavorHotspotIds] = useState<Set<string>>(new Set())

  if (!selectedCase || !caseProgress) return null

  const handleHotspotClick = (hotspot: Hotspot) => {
    audioEngine.playSfx('hotspot')
    setActiveHotspot(hotspot.id)
    if (hotspot.evidenceId) {
      const evidence = selectedCase.evidence.find((e) => e.id === hotspot.evidenceId)
      if (evidence) {
        setActiveDevice(null)
        setActiveFlavorHotspot(null)
        setActiveEvidence(evidence)
        if (!caseProgress.collectedEvidenceIds.has(evidence.id)) {
          collectEvidence(evidence.id)
          showNotification(`Evidencia recopilada: ${evidence.name}`)
        }
      }
    } else if (hotspot.deviceId) {
      const device = selectedCase.digitalDevices?.find((d) => d.id === hotspot.deviceId)
      if (device) {
        setActiveEvidence(null)
        setActiveFlavorHotspot(null)
        setActiveDevice(device)
        if (!caseProgress.discoveredDeviceIds.has(device.id)) {
          discoverDevice(device.id)
          showNotification(`Encontraste un dispositivo: ${device.label}`)
        }
      }
    } else {
      setActiveEvidence(null)
      setActiveDevice(null)
      setActiveFlavorHotspot(hotspot)
      setViewedFlavorHotspotIds((prev) => new Set(prev).add(hotspot.id))
    }
  }

  const collected = caseProgress.collectedEvidenceIds
  const isHotspotDone = (h: Hotspot) =>
    h.evidenceId
      ? collected.has(h.evidenceId)
      : h.deviceId
        ? caseProgress.discoveredDeviceIds.has(h.deviceId)
        : viewedFlavorHotspotIds.has(h.id)

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 pb-16">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 py-3 backdrop-blur"
      >
        <button
          onClick={() => goTo('case-selection')}
          className="text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
        >
          ← CASOS
        </button>
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 tracking-[0.2em]">ESCENA DEL CRIMEN</p>
          <p className="text-sm font-medium text-amber-400">{selectedCase.title}</p>
        </div>
        <div className="w-16" />
      </motion.div>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Scene canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex flex-col flex-1 overflow-hidden min-h-[340px]"
        >
          {/* Ambient color from case */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${selectedCase.color}20 0%, transparent 65%), #0a0a0f`,
            }}
          />

          {/* Scanline CRT effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] z-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
            }}
          />

          {/* Room art */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full" style={{ maxWidth: '680px', aspectRatio: '680 / 460' }}>
              {/* Floor */}
              <div
                className="absolute inset-0 rounded"
                style={{
                  background: 'linear-gradient(180deg, #1a1408 0%, #100e06 100%)',
                  border: '1px solid #2a2418',
                  boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)',
                }}
              />
              {/* Floor tiles */}
              <div
                className="absolute inset-0 rounded opacity-[0.07]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />
              {/* Back wall */}
              <div
                className="absolute top-0 left-0 right-0 rounded-t"
                style={{
                  height: '42%',
                  background: 'linear-gradient(180deg, #14110c 0%, #221d14 100%)',
                  borderBottom: '2px solid #2a2010',
                }}
              />
              {/* Wall texture */}
              <div
                className="absolute top-0 left-0 right-0 rounded-t opacity-[0.04]"
                style={{
                  height: '42%',
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(200,169,110,1) 18px, rgba(200,169,110,1) 19px)',
                }}
              />
              {/* Window — distinct per case so the room reads as a real place */}
              <SceneWindow caseId={selectedCase.id} />
              {/* Centerpiece prop — distinct per case */}
              <SceneCenterpiece caseId={selectedCase.id} />
              {/* Lamp glow */}
              <div
                className="absolute"
                style={{
                  top: '50px',
                  right: '60px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#c8a030',
                  boxShadow: '0 0 30px 15px rgba(200,160,48,0.12), 0 0 80px 40px rgba(200,160,48,0.04)',
                }}
              />
              {/* Crime tape */}
              <div
                className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b opacity-40"
                style={{ height: '22px' }}
              >
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 flex items-center justify-center text-[8px] font-black tracking-widest"
                    style={{
                      left: `${i * 7.15}%`,
                      width: '7.15%',
                      backgroundColor: i % 2 === 0 ? '#ca8a04' : '#1c1917',
                      color: i % 2 === 0 ? '#000' : '#ca8a04',
                      borderTop: '1px solid #ca8a04',
                      borderBottom: '1px solid #ca8a04',
                    }}
                  >
                    {i % 2 === 0 ? 'NO' : ''}
                  </div>
                ))}
              </div>

              {/* Hotspot buttons — positioning via wrapper div, animation via motion inside */}
              {selectedCase.hotspots.map((hotspot, idx) => {
                const hasEvidence = isHotspotDone(hotspot)
                const isActive = activeHotspot === hotspot.id
                return (
                  <div
                    key={hotspot.id}
                    className="absolute"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleHotspotClick(hotspot)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      {!hasEvidence && (
                        <span className="absolute inline-flex h-12 w-12 rounded-full bg-amber-400/10 animate-ping" />
                      )}
                      <div
                        className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 text-xl shadow-xl transition-all emoji-tone ${
                          hasEvidence
                            ? 'border-green-500/60 bg-green-950/70 text-green-300'
                            : isActive
                            ? 'border-amber-400 bg-amber-950/80 text-amber-200'
                            : 'border-amber-700/50 bg-zinc-900/90 text-amber-400 hover:border-amber-400 hover:bg-amber-950/60'
                        }`}
                        style={
                          !hasEvidence
                            ? { boxShadow: '0 0 18px rgba(200,169,110,0.3)' }
                            : { boxShadow: '0 0 12px rgba(34,197,94,0.25)' }
                        }
                      >
                        {hasEvidence ? '✓' : hotspot.icon}
                      </div>
                      <span className="max-w-[84px] text-center text-[10px] leading-tight tracking-wide text-zinc-300 group-hover:text-amber-300 transition-colors font-medium drop-shadow-lg bg-zinc-950/70 px-1 rounded">
                        {hotspot.label}
                      </span>
                    </motion.button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Scene description — flow element pinned to bottom, height-capped so it never covers hotspots */}
          <div className="relative z-20 mt-auto px-4 py-2 bg-gradient-to-t from-zinc-950/95 to-transparent">
            <p className="text-[11px] text-zinc-500 italic leading-relaxed line-clamp-2">
              {selectedCase.crimeSceneDescription}
            </p>
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full md:w-72 md:flex-shrink-0 border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-900/50 flex flex-col"
        >
          <AnimatePresence mode="wait">
            {activeEvidence ? (
              <motion.div
                key={activeEvidence.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.span
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-4xl"
                  >
                    {activeEvidence.icon}
                  </motion.span>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] text-zinc-400">EVIDENCIA</p>
                    <h4 className="font-bold text-amber-300 leading-tight">{activeEvidence.name}</h4>
                    {activeEvidence.isKey && (
                      <span className="text-[10px] text-amber-600">⭐ Evidencia clave</span>
                    )}
                  </div>
                </div>
                <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">{activeEvidence.description}</p>
                </div>
                <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-3">
                  <p className="text-[10px] tracking-[0.15em] text-amber-700 mb-2">ANÁLISIS FORENSE</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{activeEvidence.analysis}</p>
                </div>
                <button
                  onClick={() => setActiveEvidence(null)}
                  className="mt-4 w-full rounded border border-zinc-800 py-2 text-xs text-zinc-400 hover:text-zinc-300 hover:border-zinc-600 transition-all"
                >
                  ← Cerrar
                </button>
              </motion.div>
            ) : activeDevice ? (
              <motion.div
                key={activeDevice.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex-1 p-5"
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="text-3xl">📱</span>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] text-zinc-400">DISPOSITIVO ENCONTRADO</p>
                    <h4 className="font-bold text-amber-300 leading-tight">{activeDevice.label}</h4>
                  </div>
                </div>
                <p className="mb-4 text-xs text-zinc-400 leading-relaxed">
                  Este dispositivo puede contener mensajes, notas y archivos borrados. Ábrelo en la
                  sección de Forensia Digital para investigarlo a fondo.
                </p>
                <button
                  onClick={() => goTo('digital-forensics')}
                  className="w-full rounded border border-amber-700/60 bg-amber-950/40 py-2.5 text-xs tracking-widest uppercase text-amber-300 hover:bg-amber-900/50 transition-all"
                >
                  Abrir Forensia Digital →
                </button>
                <button
                  onClick={() => setActiveDevice(null)}
                  className="mt-3 w-full rounded border border-zinc-800 py-2 text-xs text-zinc-400 hover:text-zinc-300 hover:border-zinc-600 transition-all"
                >
                  ← Cerrar
                </button>
              </motion.div>
            ) : activeFlavorHotspot ? (
              <motion.div
                key={activeFlavorHotspot.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex-1 p-5"
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="text-3xl">{activeFlavorHotspot.icon}</span>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] text-zinc-400">PUNTO DE INTERÉS</p>
                    <h4 className="font-bold text-amber-300 leading-tight">{activeFlavorHotspot.label}</h4>
                  </div>
                </div>
                <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">{activeFlavorHotspot.description}</p>
                </div>
                <p className="text-xs text-zinc-400 italic">Nada que recolectar aquí, pero vale la pena mirar.</p>
                <button
                  onClick={() => setActiveFlavorHotspot(null)}
                  className="mt-4 w-full rounded border border-zinc-800 py-2 text-xs text-zinc-400 hover:text-zinc-300 hover:border-zinc-600 transition-all"
                >
                  ← Cerrar
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 p-5"
              >
                <p className="text-[10px] tracking-[0.15em] text-zinc-400 mb-4">PUNTOS DE INTERÉS</p>
                <div className="space-y-2">
                  {selectedCase.hotspots.map((h, i) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-2.5 text-xs p-2 rounded border border-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer"
                      onClick={() => handleHotspotClick(h)}
                    >
                      <span className="text-base emoji-tone">{isHotspotDone(h) ? '✅' : h.icon}</span>
                      <span className={isHotspotDone(h) ? 'text-zinc-400 line-through' : 'text-zinc-400'}>
                        {h.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suspects */}
          <div className="border-t border-zinc-800 p-4">
            <p className="text-[10px] tracking-[0.2em] text-zinc-400 mb-3">INTERROGAR SOSPECHOSOS</p>
            <div className="space-y-2">
              {selectedCase.suspects.map((suspect, i) => {
                const interviewed = caseProgress.interviewedSuspects[suspect.id]?.size ?? 0
                const total = suspect.dialogues.length
                const pct = total > 0 ? (interviewed / total) * 100 : 0
                return (
                  <motion.button
                    key={suspect.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    whileHover={{ x: 3 }}
                    onClick={() => startInterview(suspect)}
                    className="flex w-full items-center gap-3 rounded border border-zinc-800 bg-zinc-900/50 p-2.5 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-left"
                  >
                    <PortraitAvatar seed={suspect.id} size={28} className="flex-shrink-0 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-300 truncate">{suspect.name}</div>
                      <div className="text-[10px] text-zinc-400">{suspect.occupation}</div>
                      {/* Progress bar */}
                      <div className="mt-1 h-0.5 rounded-full bg-zinc-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          className="h-full rounded-full bg-amber-700/60"
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-400 flex-shrink-0">{interviewed}/{total}</div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <GameHUD activeTab="scene" />
    </div>
  )
}
