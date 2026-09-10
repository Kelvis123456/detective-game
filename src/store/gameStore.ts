import { create } from 'zustand'
import type {
  AccusationInput,
  GameState,
  Scene,
  Case,
  Suspect,
  CaseProgress,
  EndingType,
} from '../types'
import {
  createCaseProgress,
  collectEvidence,
  recordInterview,
  makeAccusation,
  evaluateAccusation,
  incrementActionCount,
  checkTensionEvents,
  applyTensionEvent,
} from '../engine/CaseEngine'
import {
  isUnlockCodeCorrect,
  getEvidenceIdsInThread,
  getEvidenceIdsInNote,
} from '../engine/DigitalForensicsEngine'
import { addConnection, removeConnection, normalizeConnection } from '../engine/EvidenceEngine'
import { audioEngine } from '../audio/AudioEngine'

interface GameStore extends GameState {
  goTo: (scene: Scene) => void
  selectCase: (case_: Case) => void
  collectEvidence: (evidenceId: string) => void
  startInterview: (suspect: Suspect) => void
  askQuestion: (suspectId: string, dialogueId: string, revealedEvidenceIds: string[]) => void
  submitAccusation: (input: AccusationInput) => void
  discoverDevice: (deviceId: string) => void
  unlockDevice: (deviceId: string, attempt: string) => boolean
  openDigitalThread: (deviceId: string, threadId: string) => void
  openDigitalNote: (deviceId: string, noteId: string) => void
  connectEvidence: (fromId: string, toId: string) => void
  disconnectEvidence: (fromId: string) => void
  resetCase: () => void
  showNotification: (message: string) => void
  clearNotification: () => void
}

/**
 * Bumps the narrative action counter and fires any tension events whose
 * threshold was just reached. Called from every store action that
 * represents player progress (collecting evidence, asking a question,
 * reading digital evidence). Never called from the pure engine functions
 * themselves, so tests exercising those directly see no behavior change.
 */
function advanceWithTension(
  progress: CaseProgress,
  case_: Case
): { progress: CaseProgress; message?: string } {
  let next = incrementActionCount(progress)
  const fired = checkTensionEvents(next, case_)
  let message: string | undefined
  for (const event of fired) {
    next = applyTensionEvent(next, event)
    message = event.effect?.revealHint ?? event.message
  }
  if (message) audioEngine.playSfx('tension')
  return { progress: next, message }
}

const RESOLUTION_SFX: Record<EndingType, 'resolution-win' | 'resolution-partial' | 'resolution-lose' | 'resolution-neutral'> = {
  'correct-full-case': 'resolution-win',
  'correct-partial-reasoning': 'resolution-partial',
  'wrong-suspect-culprit-escapes': 'resolution-lose',
  'insufficient-evidence': 'resolution-neutral',
}

export const useGameStore = create<GameStore>((set, get) => ({
  scene: 'main-menu',
  selectedCase: null,
  caseProgress: null,
  selectedSuspect: null,
  playerStats: {
    casesCompleted: 0,
    correctAccusations: 0,
    totalEvidenceFound: 0,
    flawlessCases: 0,
  },
  notifications: [],

  goTo: (scene) => set({ scene }),

  selectCase: (case_) =>
    set({
      selectedCase: case_,
      caseProgress: createCaseProgress(case_.id),
      scene: 'case-intro',
    }),

  collectEvidence: (evidenceId) => {
    const { caseProgress, selectedCase } = get()
    if (!caseProgress || !selectedCase || caseProgress.collectedEvidenceIds.has(evidenceId)) return

    const collected = collectEvidence(caseProgress, evidenceId)
    const { progress, message } = advanceWithTension(collected, selectedCase)
    audioEngine.playSfx('evidence')

    set((state) => ({
      caseProgress: progress,
      notifications: message ? [...state.notifications, message] : state.notifications,
      playerStats: {
        ...state.playerStats,
        totalEvidenceFound: state.playerStats.totalEvidenceFound + 1,
      },
    }))
  },

  startInterview: (suspect) =>
    set({ selectedSuspect: suspect, scene: 'interrogation' }),

  askQuestion: (suspectId, dialogueId, revealedEvidenceIds) => {
    const { caseProgress, selectedCase } = get()
    if (!caseProgress || !selectedCase) return

    let progress: CaseProgress = recordInterview(caseProgress, suspectId, dialogueId)

    const newEvidenceIds = revealedEvidenceIds.filter((eid) => !progress.collectedEvidenceIds.has(eid))
    for (const eid of newEvidenceIds) {
      progress = collectEvidence(progress, eid)
    }

    const advanced = advanceWithTension(progress, selectedCase)
    if (newEvidenceIds.length > 0) audioEngine.playSfx('evidence')

    set((state) => ({
      caseProgress: advanced.progress,
      notifications: advanced.message ? [...state.notifications, advanced.message] : state.notifications,
      playerStats:
        newEvidenceIds.length > 0
          ? {
              ...state.playerStats,
              totalEvidenceFound: state.playerStats.totalEvidenceFound + newEvidenceIds.length,
            }
          : state.playerStats,
    }))
  },

  discoverDevice: (deviceId) => {
    const { caseProgress } = get()
    if (!caseProgress || caseProgress.discoveredDeviceIds.has(deviceId)) return
    audioEngine.playSfx('device-found')
    set((state) => {
      const discoveredDeviceIds = new Set(state.caseProgress!.discoveredDeviceIds)
      discoveredDeviceIds.add(deviceId)
      return { caseProgress: { ...state.caseProgress!, discoveredDeviceIds } }
    })
  },

  unlockDevice: (deviceId, attempt) => {
    const { selectedCase, caseProgress } = get()
    if (!selectedCase || !caseProgress) return false
    const device = selectedCase.digitalDevices?.find((d) => d.id === deviceId)
    if (!device) return false

    const ok = isUnlockCodeCorrect(device, attempt)
    audioEngine.playSfx(ok ? 'unlock-success' : 'unlock-fail')
    if (ok && !caseProgress.unlockedDeviceIds.has(deviceId)) {
      set((state) => {
        const unlockedDeviceIds = new Set(state.caseProgress!.unlockedDeviceIds)
        unlockedDeviceIds.add(deviceId)
        return { caseProgress: { ...state.caseProgress!, unlockedDeviceIds } }
      })
    }
    return ok
  },

  openDigitalThread: (deviceId, threadId) => {
    const { caseProgress, selectedCase } = get()
    if (!caseProgress || !selectedCase) return
    const device = selectedCase.digitalDevices?.find((d) => d.id === deviceId)
    const thread = device?.threads.find((t) => t.id === threadId)
    if (!device || !thread) return

    const alreadyRead = caseProgress.readThreadIds.has(threadId)
    const readThreadIds = new Set(caseProgress.readThreadIds)
    readThreadIds.add(threadId)

    let progress: CaseProgress = { ...caseProgress, readThreadIds }
    const newEvidenceIds = alreadyRead
      ? []
      : getEvidenceIdsInThread(thread).filter((eid) => !progress.collectedEvidenceIds.has(eid))
    for (const eid of newEvidenceIds) {
      progress = collectEvidence(progress, eid)
    }

    const advanced = advanceWithTension(progress, selectedCase)
    if (newEvidenceIds.length > 0) audioEngine.playSfx('evidence')

    set((state) => ({
      caseProgress: advanced.progress,
      notifications: advanced.message ? [...state.notifications, advanced.message] : state.notifications,
      playerStats:
        newEvidenceIds.length > 0
          ? {
              ...state.playerStats,
              totalEvidenceFound: state.playerStats.totalEvidenceFound + newEvidenceIds.length,
            }
          : state.playerStats,
    }))
  },

  openDigitalNote: (deviceId, noteId) => {
    const { caseProgress, selectedCase } = get()
    if (!caseProgress || !selectedCase) return
    const device = selectedCase.digitalDevices?.find((d) => d.id === deviceId)
    const note = device?.notes.find((n) => n.id === noteId)
    if (!device || !note) return

    const alreadyRead = caseProgress.readNoteIds.has(noteId)
    const readNoteIds = new Set(caseProgress.readNoteIds)
    readNoteIds.add(noteId)

    let progress: CaseProgress = { ...caseProgress, readNoteIds }
    const newEvidenceIds = alreadyRead
      ? []
      : getEvidenceIdsInNote(note).filter((eid) => !progress.collectedEvidenceIds.has(eid))
    for (const eid of newEvidenceIds) {
      progress = collectEvidence(progress, eid)
    }

    const advanced = advanceWithTension(progress, selectedCase)
    if (newEvidenceIds.length > 0) audioEngine.playSfx('evidence')

    set((state) => ({
      caseProgress: advanced.progress,
      notifications: advanced.message ? [...state.notifications, advanced.message] : state.notifications,
      playerStats:
        newEvidenceIds.length > 0
          ? {
              ...state.playerStats,
              totalEvidenceFound: state.playerStats.totalEvidenceFound + newEvidenceIds.length,
            }
          : state.playerStats,
    }))
  },

  connectEvidence: (fromId, toId) => {
    const { caseProgress } = get()
    if (!caseProgress) return
    const playerConnections = addConnection(caseProgress.playerConnections, normalizeConnection(fromId, toId))
    set({ caseProgress: { ...caseProgress, playerConnections } })
  },

  disconnectEvidence: (fromId) => {
    const { caseProgress } = get()
    if (!caseProgress) return
    const playerConnections = removeConnection(caseProgress.playerConnections, fromId)
    set({ caseProgress: { ...caseProgress, playerConnections } })
  },

  submitAccusation: (input) => {
    const { caseProgress, selectedCase } = get()
    if (!caseProgress || !selectedCase) return

    const accused = makeAccusation(caseProgress, selectedCase, input.suspectId)
    const evaluation = evaluateAccusation(caseProgress, selectedCase, input)

    const updated: CaseProgress = {
      ...accused,
      ending: evaluation.ending,
      accusationProof: {
        means: input.meansEvidenceId,
        motive: input.motiveEvidenceId,
        opportunity: input.opportunityEvidenceId,
      },
    }

    audioEngine.playSfx('accuse')
    audioEngine.playSfx(RESOLUTION_SFX[evaluation.ending], 0.55)

    set((state) => ({
      caseProgress: updated,
      scene: 'resolution',
      // A toast from a hotspot click made minutes ago (a 3s auto-dismiss
      // timer can outlive an entire proof-form scroll) has no business
      // popping up over the verdict screen.
      notifications: [],
      playerStats: {
        ...state.playerStats,
        casesCompleted: state.playerStats.casesCompleted + 1,
        correctAccusations: updated.correct
          ? state.playerStats.correctAccusations + 1
          : state.playerStats.correctAccusations,
        flawlessCases:
          evaluation.ending === 'correct-full-case'
            ? (state.playerStats.flawlessCases ?? 0) + 1
            : state.playerStats.flawlessCases,
      },
    }))
  },

  resetCase: () =>
    set({
      selectedCase: null,
      caseProgress: null,
      selectedSuspect: null,
      scene: 'case-selection',
    }),

  showNotification: (message) => set((state) => ({ notifications: [...state.notifications, message] })),
  clearNotification: () => set((state) => ({ notifications: state.notifications.slice(1) })),
}))
