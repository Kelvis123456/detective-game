import { create } from 'zustand'
import type {
  AccusationInput,
  GameState,
  Scene,
  Case,
  Suspect,
  CaseProgress,
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
  return { progress: next, message }
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
  notification: null,

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

    set((state) => ({
      caseProgress: progress,
      notification: message ?? state.notification,
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

    for (const eid of revealedEvidenceIds) {
      if (!progress.collectedEvidenceIds.has(eid)) {
        progress = collectEvidence(progress, eid)
      }
    }

    const advanced = advanceWithTension(progress, selectedCase)

    set((state) => ({
      caseProgress: advanced.progress,
      notification: advanced.message ?? state.notification,
      playerStats:
        revealedEvidenceIds.length > 0
          ? {
              ...state.playerStats,
              totalEvidenceFound:
                state.playerStats.totalEvidenceFound + revealedEvidenceIds.length,
            }
          : state.playerStats,
    }))
  },

  discoverDevice: (deviceId) => {
    const { caseProgress } = get()
    if (!caseProgress || caseProgress.discoveredDeviceIds.has(deviceId)) return
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

    set((state) => ({
      caseProgress: advanced.progress,
      notification: advanced.message ?? state.notification,
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

    set((state) => ({
      caseProgress: advanced.progress,
      notification: advanced.message ?? state.notification,
      playerStats:
        newEvidenceIds.length > 0
          ? {
              ...state.playerStats,
              totalEvidenceFound: state.playerStats.totalEvidenceFound + newEvidenceIds.length,
            }
          : state.playerStats,
    }))
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

    set((state) => ({
      caseProgress: updated,
      scene: 'resolution',
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

  showNotification: (message) => set({ notification: message }),
  clearNotification: () => set({ notification: null }),
}))
