import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import {
  getVisibleThreads,
  getVisibleNotes,
} from '../../engine/DigitalForensicsEngine'
import type { DigitalAppId, DigitalDevice, DigitalNote, DigitalThread } from '../../types'
import GameHUD from '../ui/GameHUD'

const APP_META: Record<DigitalAppId, { name: string; icon: string; kind: 'threads' | 'notes' }> = {
  chatvia: { name: 'ChatVía', icon: '💬', kind: 'threads' },
  anotta: { name: 'Anotta', icon: '🗒️', kind: 'notes' },
  vozal: { name: 'Vozal', icon: '☎️', kind: 'threads' },
  nubeplus: { name: 'NubePlus', icon: '📷', kind: 'notes' },
}

type ViewState =
  | { level: 'devices' }
  | { level: 'home'; deviceId: string }
  | { level: 'app'; deviceId: string; appId: DigitalAppId }
  | { level: 'thread'; deviceId: string; threadId: string }
  | { level: 'note'; deviceId: string; noteId: string }

export default function DigitalForensics() {
  const selectedCase = useGameStore((s) => s.selectedCase)
  const caseProgress = useGameStore((s) => s.caseProgress)
  const goTo = useGameStore((s) => s.goTo)
  const unlockDevice = useGameStore((s) => s.unlockDevice)
  const openDigitalThread = useGameStore((s) => s.openDigitalThread)
  const openDigitalNote = useGameStore((s) => s.openDigitalNote)

  const [view, setView] = useState<ViewState>({ level: 'devices' })
  const [pinAttempt, setPinAttempt] = useState('')
  const [pinError, setPinError] = useState(false)

  if (!selectedCase || !caseProgress) return null

  const devices = (selectedCase.digitalDevices ?? []).filter((d) =>
    caseProgress.discoveredDeviceIds.has(d.id)
  )

  const openDevice = (device: DigitalDevice) => {
    if (device.lockType !== 'none' && !caseProgress.unlockedDeviceIds.has(device.id)) {
      setView({ level: 'home', deviceId: device.id })
      setPinAttempt('')
      setPinError(false)
    } else {
      setView({ level: 'home', deviceId: device.id })
    }
  }

  const handleUnlock = (device: DigitalDevice) => {
    const ok = unlockDevice(device.id, pinAttempt)
    if (!ok) {
      setPinError(true)
    } else {
      setPinError(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 py-3 backdrop-blur">
        <button
          onClick={() => {
            if (view.level === 'devices') goTo('crime-scene')
            else if (view.level === 'home') setView({ level: 'devices' })
            else if (view.level === 'app') setView({ level: 'home', deviceId: view.deviceId })
            else setView({ level: 'app', deviceId: view.deviceId, appId: currentAppId(view, devices) })
          }}
          className="text-xs tracking-widest text-zinc-600 hover:text-amber-400 transition-colors"
        >
          ← {view.level === 'devices' ? 'ESCENA' : 'ATRÁS'}
        </button>
        <div className="text-center">
          <p className="text-[10px] text-zinc-600 tracking-[0.2em]">FORENSIA DIGITAL</p>
          <p className="text-sm font-medium text-amber-400">{selectedCase.title}</p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 mx-auto w-full max-w-md px-6 py-8">
        <AnimatePresence mode="wait">
          {view.level === 'devices' && (
            <motion.div key="devices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-lg font-bold text-amber-400 mb-1">Dispositivos Recuperados</h3>
              <p className="text-xs text-zinc-600 mb-6">
                Todo lo que hay aquí puede haberse borrado — no significa que haya desaparecido.
              </p>
              {devices.length === 0 && (
                <p className="text-sm text-zinc-600 italic">
                  Aún no encuentras ningún dispositivo. Revisa la escena del crimen.
                </p>
              )}
              <div className="space-y-3">
                {devices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => openDevice(device)}
                    className="w-full flex items-center gap-3 rounded border border-zinc-800 bg-zinc-900/60 p-4 text-left hover:border-amber-800/50 transition-colors"
                  >
                    <span className="text-2xl">📱</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-100">{device.label}</div>
                      <div className="text-[10px] text-zinc-600">
                        {caseProgress.unlockedDeviceIds.has(device.id) || device.lockType === 'none'
                          ? 'Desbloqueado'
                          : 'Bloqueado'}
                      </div>
                    </div>
                    <span className="text-zinc-700">→</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view.level === 'home' &&
            (() => {
              const device = devices.find((d) => d.id === view.deviceId)
              if (!device) return null
              const isLocked = device.lockType !== 'none' && !caseProgress.unlockedDeviceIds.has(device.id)

              if (isLocked) {
                return (
                  <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="text-lg font-bold text-amber-400 mb-1">{device.label}</h3>
                    <p className="text-xs text-zinc-600 mb-6">
                      Dispositivo bloqueado ({device.lockType === 'pin' ? 'PIN' : 'patrón'}).
                    </p>
                    {device.unlockHint && (
                      <div className="mb-4 rounded border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-500">
                        💡 {device.unlockHint}
                      </div>
                    )}
                    <input
                      value={pinAttempt}
                      onChange={(e) => setPinAttempt(e.target.value)}
                      placeholder={device.lockType === 'pin' ? 'PIN' : 'Código de patrón'}
                      className="w-full mb-3 rounded border border-zinc-800 bg-zinc-900 px-4 py-3 text-center text-lg tracking-[0.3em] text-zinc-100 focus:border-amber-700 focus:outline-none"
                    />
                    {pinError && (
                      <p className="mb-3 text-center text-xs text-red-400">Código incorrecto.</p>
                    )}
                    <button
                      onClick={() => handleUnlock(device)}
                      className="w-full rounded border border-amber-700/60 bg-amber-950/40 py-3 text-sm tracking-widest uppercase text-amber-300 hover:bg-amber-900/50 transition-all"
                    >
                      Desbloquear
                    </button>
                  </motion.div>
                )
              }

              return (
                <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3 className="text-lg font-bold text-amber-400 mb-1">{device.label}</h3>
                  <p className="text-xs text-zinc-600 mb-6">Selecciona una aplicación.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {device.apps.map((appId) => {
                      const meta = APP_META[appId]
                      return (
                        <button
                          key={appId}
                          onClick={() => setView({ level: 'app', deviceId: device.id, appId })}
                          className="flex flex-col items-center gap-2 rounded border border-zinc-800 bg-zinc-900/60 p-5 hover:border-amber-800/50 transition-colors"
                        >
                          <span className="text-3xl">{meta.icon}</span>
                          <span className="text-xs text-zinc-300">{meta.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })()}

          {view.level === 'app' &&
            (() => {
              const device = devices.find((d) => d.id === view.deviceId)
              if (!device) return null
              const meta = APP_META[view.appId]
              const threads = getVisibleThreads(device, caseProgress).filter((t) => t.appId === view.appId)
              const notes = getVisibleNotes(device, caseProgress).filter((n) => n.appId === view.appId)

              return (
                <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <span>{meta.icon}</span> {meta.name}
                  </h3>
                  <div className="space-y-2">
                    {threads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => {
                          openDigitalThread(device.id, thread.id)
                          setView({ level: 'thread', deviceId: device.id, threadId: thread.id })
                        }}
                        className="w-full text-left rounded border border-zinc-800 bg-zinc-900/60 p-3 hover:border-amber-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-200">{thread.title}</span>
                          {!caseProgress.readThreadIds.has(thread.id) && (
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                          )}
                        </div>
                        {thread.isDeleted && (
                          <span className="text-[10px] text-red-500">Recuperado — eliminado originalmente</span>
                        )}
                      </button>
                    ))}
                    {notes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => {
                          openDigitalNote(device.id, note.id)
                          setView({ level: 'note', deviceId: device.id, noteId: note.id })
                        }}
                        className="w-full text-left rounded border border-zinc-800 bg-zinc-900/60 p-3 hover:border-amber-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-200">{note.title}</span>
                          {!caseProgress.readNoteIds.has(note.id) && (
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                          )}
                        </div>
                        {note.isDeleted && (
                          <span className="text-[10px] text-red-500">Recuperado — eliminado originalmente</span>
                        )}
                      </button>
                    ))}
                    {threads.length === 0 && notes.length === 0 && (
                      <p className="text-sm text-zinc-600 italic">Nada aquí.</p>
                    )}
                  </div>
                </motion.div>
              )
            })()}

          {view.level === 'thread' && (
            <ThreadView
              key="thread"
              device={devices.find((d) => d.id === view.deviceId)}
              threadId={view.threadId}
            />
          )}

          {view.level === 'note' && (
            <NoteView
              key="note"
              device={devices.find((d) => d.id === view.deviceId)}
              noteId={view.noteId}
            />
          )}
        </AnimatePresence>
      </div>

      <GameHUD activeTab="digital" />
    </div>
  )
}

function currentAppId(
  view: ViewState,
  devices: DigitalDevice[]
): DigitalAppId {
  if (view.level === 'thread') {
    const device = devices.find((d) => d.id === view.deviceId)
    const thread = device?.threads.find((t) => t.id === view.threadId)
    return thread?.appId ?? 'chatvia'
  }
  if (view.level === 'note') {
    const device = devices.find((d) => d.id === view.deviceId)
    const note = device?.notes.find((n) => n.id === view.noteId)
    return note?.appId ?? 'anotta'
  }
  return 'chatvia'
}

function ThreadView({ device, threadId }: { device: DigitalDevice | undefined; threadId: string }) {
  const thread: DigitalThread | undefined = device?.threads.find((t) => t.id === threadId)
  if (!thread) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 className="text-base font-bold text-amber-400 mb-1">{thread.title}</h3>
      <p className="text-[10px] text-zinc-600 mb-4">{thread.participants.join(', ')}</p>
      <div className="space-y-3">
        {thread.messages.map((m) => (
          <div key={m.id} className="rounded border border-zinc-800 bg-zinc-900/60 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-zinc-300">{m.sender}</span>
              <span className="text-[10px] text-zinc-600">{m.timestamp}</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{m.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function NoteView({ device, noteId }: { device: DigitalDevice | undefined; noteId: string }) {
  const note: DigitalNote | undefined = device?.notes.find((n) => n.id === noteId)
  if (!note) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 className="text-base font-bold text-amber-400 mb-4">{note.title}</h3>
      <div className="rounded border border-zinc-800 bg-zinc-900/60 p-4">
        <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{note.body}</p>
      </div>
    </motion.div>
  )
}
