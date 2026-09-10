import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
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

/** The phone chrome — bezel, notch, status bar — shared by every screen once
 * the player is "inside" a specific device (lock screen through note view). */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div
        className="relative rounded-[36px] border-[3px] border-zinc-700 bg-zinc-950 p-2"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.03)' }}
      >
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-4 w-24 -translate-x-1/2 rounded-full bg-zinc-950" />
        <div
          className="relative min-h-[540px] overflow-hidden rounded-[28px]"
          style={{ background: 'linear-gradient(165deg, #101014 0%, #1a1a20 60%, #14141a 100%)' }}
        >
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[10px] text-zinc-400">
            <span>23:58</span>
            <span className="tracking-wider">●●●● 🔋</span>
          </div>
          <div className="px-4 pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

function PinPad({
  device,
  pinAttempt,
  pinError,
  onKey,
}: {
  device: DigitalDevice
  pinAttempt: string
  pinError: boolean
  onKey: (key: string) => void
}) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']
  return (
    <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-6 flex flex-col items-center pt-4">
        <span className="mb-3 text-3xl">🔒</span>
        <p className="text-sm font-medium text-zinc-100">{device.label}</p>
        <p className="mb-4 text-[10px] tracking-widest text-zinc-500">
          {device.lockType === 'pin' ? 'INGRESA EL PIN' : 'INGRESA EL PATRÓN'}
        </p>
        <div className="mb-1 flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full border transition-colors ${
                i < pinAttempt.length ? 'border-amber-400 bg-amber-400' : 'border-zinc-600 bg-transparent'
              } ${pinError ? '!border-red-500 !bg-red-500' : ''}`}
            />
          ))}
        </div>
        {pinError && <p className="mt-2 text-xs text-red-400">Código incorrecto</p>}
      </div>

      {device.unlockHint && (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-400">
          💡 {device.unlockHint}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {keys.map((key, i) =>
          key === '' ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() => onKey(key)}
              className="flex h-12 items-center justify-center rounded-full bg-zinc-800/70 text-lg text-zinc-100 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
            >
              {key}
            </button>
          )
        )}
      </div>
    </motion.div>
  )
}

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
    setView({ level: 'home', deviceId: device.id })
    setPinAttempt('')
    setPinError(false)
  }

  const handlePinKey = (device: DigitalDevice, key: string) => {
    if (key === '⌫') {
      setPinAttempt((p) => p.slice(0, -1))
      setPinError(false)
      return
    }
    if (pinAttempt.length >= 4) return
    const next = pinAttempt + key
    setPinAttempt(next)
    if (next.length === 4) {
      const ok = unlockDevice(device.id, next)
      setPinError(!ok)
      if (!ok) setTimeout(() => setPinAttempt(''), 400)
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
          className="text-xs tracking-widest text-zinc-400 hover:text-amber-400 transition-colors"
        >
          ← {view.level === 'devices' ? 'ESCENA' : 'ATRÁS'}
        </button>
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 tracking-[0.2em]">FORENSIA DIGITAL</p>
          <p className="text-sm font-medium text-amber-400">{selectedCase.title}</p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 mx-auto w-full max-w-md px-6 py-8">
        <AnimatePresence mode="wait">
          {view.level === 'devices' && (
            <motion.div key="devices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-lg font-bold text-amber-400 mb-1">Dispositivos Recuperados</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Todo lo que hay aquí puede haberse borrado — no significa que haya desaparecido.
              </p>
              {devices.length === 0 && (
                <p className="text-sm text-zinc-400 italic">
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
                      <div className="text-[10px] text-zinc-400">
                        {caseProgress.unlockedDeviceIds.has(device.id) || device.lockType === 'none'
                          ? 'Desbloqueado'
                          : 'Bloqueado'}
                      </div>
                    </div>
                    <span className="text-zinc-500">→</span>
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
                  <PhoneFrame>
                    <PinPad
                      device={device}
                      pinAttempt={pinAttempt}
                      pinError={pinError}
                      onKey={(key) => handlePinKey(device, key)}
                    />
                  </PhoneFrame>
                )
              }

              return (
                <PhoneFrame>
                  <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="mb-5 text-center text-[10px] tracking-widest text-zinc-500">
                      {device.label.toUpperCase()}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {device.apps.map((appId) => {
                        const meta = APP_META[appId]
                        return (
                          <button
                            key={appId}
                            onClick={() => setView({ level: 'app', deviceId: device.id, appId })}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div
                              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                              style={{
                                background: 'linear-gradient(160deg, #3f3f46 0%, #18181b 100%)',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                              }}
                            >
                              {meta.icon}
                            </div>
                            <span className="text-[10px] text-zinc-300">{meta.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                </PhoneFrame>
              )
            })()}

          {view.level === 'app' &&
            (() => {
              const device = devices.find((d) => d.id === view.deviceId)
              if (!device) return null
              const meta = APP_META[view.appId]
              const allThreads = device.threads.filter((t) => t.appId === view.appId)
              const allNotes = device.notes.filter((n) => n.appId === view.appId)

              return (
                <PhoneFrame>
                  <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-zinc-100">
                      <span>{meta.icon}</span> {meta.name}
                    </h3>
                    <div className="space-y-1.5">
                      {allThreads.map((thread) => {
                        const locked = caseProgress.lockedThreadIds.has(thread.id)
                        const unread = !locked && !caseProgress.readThreadIds.has(thread.id)
                        const lastMessage = thread.messages[thread.messages.length - 1]
                        return (
                          <button
                            key={thread.id}
                            disabled={locked}
                            onClick={() => {
                              openDigitalThread(device.id, thread.id)
                              setView({ level: 'thread', deviceId: device.id, threadId: thread.id })
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors ${
                              locked ? 'opacity-50' : 'hover:bg-zinc-800/60'
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${
                                locked ? 'bg-red-950/50' : 'bg-zinc-800'
                              }`}
                            >
                              {locked ? '🔒' : '💬'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`truncate text-sm ${
                                    locked ? 'text-zinc-500 line-through' : 'text-zinc-100'
                                  }`}
                                >
                                  {thread.title}
                                </span>
                                {unread && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />}
                              </div>
                              <p className={`truncate text-xs ${locked ? 'text-red-400/70' : 'text-zinc-500'}`}>
                                {locked ? 'Purgado del respaldo' : lastMessage?.text}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                      {allNotes.map((note) => {
                        const locked = caseProgress.lockedNoteIds.has(note.id)
                        const unread = !locked && !caseProgress.readNoteIds.has(note.id)
                        return (
                          <button
                            key={note.id}
                            disabled={locked}
                            onClick={() => {
                              openDigitalNote(device.id, note.id)
                              setView({ level: 'note', deviceId: device.id, noteId: note.id })
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors ${
                              locked ? 'opacity-50' : 'hover:bg-zinc-800/60'
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${
                                locked ? 'bg-red-950/50' : 'bg-zinc-800'
                              }`}
                            >
                              {locked ? '🔒' : '🗒️'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`truncate text-sm ${
                                    locked ? 'text-zinc-500 line-through' : 'text-zinc-100'
                                  }`}
                                >
                                  {note.title}
                                </span>
                                {unread && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />}
                              </div>
                              <p className={`truncate text-xs ${locked ? 'text-red-400/70' : 'text-zinc-500'}`}>
                                {locked ? 'Purgado del respaldo' : note.body}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                      {allThreads.length === 0 && allNotes.length === 0 && (
                        <p className="py-8 text-center text-sm text-zinc-500 italic">Nada aquí.</p>
                      )}
                    </div>
                  </motion.div>
                </PhoneFrame>
              )
            })()}

          {view.level === 'thread' && (
            <PhoneFrame>
              <ThreadView key="thread" device={devices.find((d) => d.id === view.deviceId)} threadId={view.threadId} />
            </PhoneFrame>
          )}

          {view.level === 'note' && (
            <PhoneFrame>
              <NoteView key="note" device={devices.find((d) => d.id === view.deviceId)} noteId={view.noteId} />
            </PhoneFrame>
          )}
        </AnimatePresence>
      </div>

      <GameHUD activeTab="digital" />
    </div>
  )
}

function currentAppId(view: ViewState, devices: DigitalDevice[]): DigitalAppId {
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
  // Authoring convention across every case: the device owner is always
  // participants[0], so their messages render on the right like a real app.
  const ownerName = thread.participants[0]
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-3 border-b border-zinc-800 pb-3">
        <p className="text-sm font-bold text-zinc-100">{thread.title}</p>
        <p className="text-[9px] text-zinc-500">{thread.participants.join(' · ')}</p>
      </div>
      <div className="space-y-2">
        {thread.messages.map((m) => {
          const isOwn = m.sender === ownerName
          return (
            <div key={m.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                  isOwn ? 'rounded-br-sm bg-amber-900/40' : 'rounded-bl-sm bg-zinc-800'
                }`}
              >
                <p className={`text-[13px] leading-snug whitespace-pre-line ${isOwn ? 'text-amber-50' : 'text-zinc-200'}`}>
                  {m.text}
                </p>
                <p className={`mt-1 text-[9px] ${isOwn ? 'text-amber-400/60' : 'text-zinc-500'}`}>{m.timestamp}</p>
              </div>
            </div>
          )
        })}
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
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{note.body}</p>
      </div>
    </motion.div>
  )
}

