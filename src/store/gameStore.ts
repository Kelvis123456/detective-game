import { create } from 'zustand'
import type { GameState, Scene, Case, Suspect, CaseProgress } from '../types'
import {
  createCaseProgress,
  collectEvidence,
  recordInterview,
  makeAccusation,
} from '../engine/CaseEngine'

interface GameStore extends GameState {
  goTo: (scene: Scene) => void
  selectCase: (case_: Case) => void
  collectEvidence: (evidenceId: string) => void
  startInterview: (suspect: Suspect) => void
  askQuestion: (suspectId: string, dialogueId: string, revealedEvidenceIds: string[]) => void
  accuseSuspect: (suspectId: string) => void
  resetCase: () => void
  showNotification: (message: string) => void
  clearNotification: () => void
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
    const { caseProgress } = get()
    if (!caseProgress || caseProgress.collectedEvidenceIds.has(evidenceId)) return
    set((state) => ({
      caseProgress: collectEvidence(state.caseProgress!, evidenceId),
      playerStats: {
        ...state.playerStats,
        totalEvidenceFound: state.playerStats.totalEvidenceFound + 1,
      },
    }))
  },

  startInterview: (suspect) =>
    set({ selectedSuspect: suspect, scene: 'interrogation' }),

  askQuestion: (suspectId, dialogueId, revealedEvidenceIds) => {
    const { caseProgress } = get()
    if (!caseProgress) return

    let progress: CaseProgress = recordInterview(caseProgress, suspectId, dialogueId)

    for (const eid of revealedEvidenceIds) {
      if (!progress.collectedEvidenceIds.has(eid)) {
        progress = collectEvidence(progress, eid)
      }
    }

    set((state) => ({
      caseProgress: progress,
      playerStats: revealedEvidenceIds.length > 0
        ? {
            ...state.playerStats,
            totalEvidenceFound:
              state.playerStats.totalEvidenceFound + revealedEvidenceIds.length,
          }
        : state.playerStats,
    }))
  },

  accuseSuspect: (suspectId) => {
    const { caseProgress, selectedCase } = get()
    if (!caseProgress || !selectedCase) return

    const updated = makeAccusation(caseProgress, selectedCase, suspectId)

    set((state) => ({
      caseProgress: updated,
      scene: 'resolution',
      playerStats: {
        ...state.playerStats,
        casesCompleted: state.playerStats.casesCompleted + 1,
        correctAccusations: updated.correct
          ? state.playerStats.correctAccusations + 1
          : state.playerStats.correctAccusations,
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
