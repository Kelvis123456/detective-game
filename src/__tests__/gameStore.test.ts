import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../store/gameStore'
import { getVisibleThreads } from '../engine/DigitalForensicsEngine'
import case001 from '../data/cases/case001'
import type { Case, GameState } from '../types'

const INITIAL_STATE: GameState = JSON.parse(JSON.stringify(useGameStore.getState()))
// playerStats is the only plain-serializable slice we actually need reset between tests;
// the rest (scene/selectedCase/caseProgress/selectedSuspect/notification) is reset to its
// real initial value below without going through JSON (Sets/functions wouldn't survive it).

function resetStore() {
  useGameStore.setState({
    scene: 'main-menu',
    selectedCase: null,
    caseProgress: null,
    selectedSuspect: null,
    playerStats: { ...INITIAL_STATE.playerStats },
    notification: null,
  })
}

describe('gameStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('selectCase', () => {
    it('creates fresh progress and moves to case-intro', () => {
      useGameStore.getState().selectCase(case001)
      const state = useGameStore.getState()
      expect(state.scene).toBe('case-intro')
      expect(state.selectedCase).toBe(case001)
      expect(state.caseProgress?.caseId).toBe(case001.id)
      expect(state.caseProgress?.collectedEvidenceIds.size).toBe(0)
    })
  })

  describe('collectEvidence', () => {
    beforeEach(() => {
      useGameStore.getState().selectCase(case001)
    })

    it('adds the evidence id and increments totalEvidenceFound', () => {
      useGameStore.getState().collectEvidence('fragmento-cristal')
      const state = useGameStore.getState()
      expect(state.caseProgress?.collectedEvidenceIds.has('fragmento-cristal')).toBe(true)
      expect(state.playerStats.totalEvidenceFound).toBe(1)
    })

    it('bumps the tension actionCount as a side effect', () => {
      useGameStore.getState().collectEvidence('fragmento-cristal')
      expect(useGameStore.getState().caseProgress?.actionCount).toBe(1)
    })

    it('is idempotent: collecting the same evidence twice only counts once', () => {
      useGameStore.getState().collectEvidence('fragmento-cristal')
      useGameStore.getState().collectEvidence('fragmento-cristal')
      expect(useGameStore.getState().playerStats.totalEvidenceFound).toBe(1)
      expect(useGameStore.getState().caseProgress?.actionCount).toBe(1)
    })

    it('does nothing when no case is selected', () => {
      resetStore()
      useGameStore.getState().collectEvidence('fragmento-cristal')
      expect(useGameStore.getState().caseProgress).toBeNull()
      expect(useGameStore.getState().playerStats.totalEvidenceFound).toBe(0)
    })
  })

  describe('discoverDevice / unlockDevice', () => {
    beforeEach(() => {
      useGameStore.getState().selectCase(case001)
    })

    it('discoverDevice adds the device id to discoveredDeviceIds', () => {
      useGameStore.getState().discoverDevice('phone-delgado')
      expect(useGameStore.getState().caseProgress?.discoveredDeviceIds.has('phone-delgado')).toBe(true)
    })

    it('unlockDevice returns true and unlocks with the correct code', () => {
      const ok = useGameStore.getState().unlockDevice('phone-delgado', '1103')
      expect(ok).toBe(true)
      expect(useGameStore.getState().caseProgress?.unlockedDeviceIds.has('phone-delgado')).toBe(true)
    })

    it('unlockDevice returns false and does not unlock with a wrong code', () => {
      const ok = useGameStore.getState().unlockDevice('phone-delgado', '0000')
      expect(ok).toBe(false)
      expect(useGameStore.getState().caseProgress?.unlockedDeviceIds.has('phone-delgado')).toBe(false)
    })

    it('unlockDevice returns false for an unknown device id', () => {
      const ok = useGameStore.getState().unlockDevice('does-not-exist', '1103')
      expect(ok).toBe(false)
    })

    it('unlockDevice returns false when no case is selected', () => {
      resetStore()
      const ok = useGameStore.getState().unlockDevice('phone-delgado', '1103')
      expect(ok).toBe(false)
    })
  })

  describe('openDigitalThread / openDigitalNote', () => {
    beforeEach(() => {
      useGameStore.getState().selectCase(case001)
    })

    it('openDigitalThread marks the thread read and collects evidence tied to its messages', () => {
      useGameStore.getState().openDigitalThread('phone-delgado', 'thread-comprador')
      const state = useGameStore.getState()
      expect(state.caseProgress?.readThreadIds.has('thread-comprador')).toBe(true)
      expect(state.caseProgress?.collectedEvidenceIds.has('chat-comprador')).toBe(true)
      expect(state.playerStats.totalEvidenceFound).toBe(1)
    })

    it('re-opening the same thread does not double-count evidence', () => {
      useGameStore.getState().openDigitalThread('phone-delgado', 'thread-comprador')
      useGameStore.getState().openDigitalThread('phone-delgado', 'thread-comprador')
      expect(useGameStore.getState().playerStats.totalEvidenceFound).toBe(1)
    })

    it('openDigitalNote marks a note read without affecting evidence when it reveals none', () => {
      useGameStore.getState().openDigitalNote('phone-delgado', 'nota-borrador-delgado')
      const state = useGameStore.getState()
      expect(state.caseProgress?.readNoteIds.has('nota-borrador-delgado')).toBe(true)
      expect(state.playerStats.totalEvidenceFound).toBe(0)
    })

    it('openDigitalNote collects evidence when the note does reveal one', () => {
      const caseWithNoteEvidence: Case = {
        ...case001,
        digitalDevices: [
          {
            ...case001.digitalDevices![0],
            notes: [{ ...case001.digitalDevices![0].notes[0], evidenceId: 'guante-trabajo' }],
          },
        ],
      }
      useGameStore.getState().selectCase(caseWithNoteEvidence)
      useGameStore.getState().openDigitalNote('phone-delgado', 'nota-borrador-delgado')
      const state = useGameStore.getState()
      expect(state.caseProgress?.collectedEvidenceIds.has('guante-trabajo')).toBe(true)
      expect(state.playerStats.totalEvidenceFound).toBe(1)
    })

    it('does nothing for an unknown device/thread combination', () => {
      useGameStore.getState().openDigitalThread('phone-delgado', 'does-not-exist')
      expect(useGameStore.getState().caseProgress?.readThreadIds.size).toBe(0)
    })
  })

  describe('submitAccusation', () => {
    beforeEach(() => {
      useGameStore.getState().selectCase(case001)
    })

    it('correct suspect with full proof reaches correct-full-case and updates all stats', () => {
      useGameStore.getState().collectEvidence('recibo-materiales')
      useGameStore.getState().collectEvidence('guante-trabajo')
      useGameStore.getState().collectEvidence('chat-comprador')
      useGameStore.getState().collectEvidence('ficha-evaluacion')

      useGameStore.getState().submitAccusation({
        suspectId: 'marco-delgado',
        meansEvidenceId: 'recibo-materiales',
        motiveEvidenceId: 'chat-comprador',
        opportunityEvidenceId: 'ficha-evaluacion',
      })

      const state = useGameStore.getState()
      expect(state.scene).toBe('resolution')
      expect(state.caseProgress?.correct).toBe(true)
      expect(state.caseProgress?.ending).toBe('correct-full-case')
      expect(state.playerStats.casesCompleted).toBe(1)
      expect(state.playerStats.correctAccusations).toBe(1)
      expect(state.playerStats.flawlessCases).toBe(1)
    })

    it('wrong suspect increments casesCompleted but not correctAccusations/flawlessCases', () => {
      useGameStore.getState().submitAccusation({ suspectId: 'valentina-cruz' })
      const state = useGameStore.getState()
      expect(state.caseProgress?.correct).toBe(false)
      expect(state.playerStats.casesCompleted).toBe(1)
      expect(state.playerStats.correctAccusations).toBe(0)
      expect(state.playerStats.flawlessCases).toBe(0)
    })

    it('correct suspect without proof selections reaches correct-partial-reasoning', () => {
      useGameStore.getState().submitAccusation({ suspectId: 'marco-delgado' })
      const state = useGameStore.getState()
      expect(state.caseProgress?.correct).toBe(true)
      expect(state.caseProgress?.ending).toBe('correct-partial-reasoning')
      expect(state.playerStats.flawlessCases).toBe(0)
    })
  })

  describe('narrative tension events', () => {
    it('fires a hint notification once the action threshold is reached, and only once', () => {
      const caseWithTension: Case = {
        ...case001,
        tensionEvents: [
          { id: 'tension-test', triggerActionCount: 2, message: 'fallback', effect: { revealHint: 'Revisa el teléfono.' } },
        ],
      }
      useGameStore.getState().selectCase(caseWithTension)

      useGameStore.getState().collectEvidence('fragmento-cristal')
      expect(useGameStore.getState().notification).toBeNull()

      useGameStore.getState().collectEvidence('ficha-evaluacion')
      expect(useGameStore.getState().notification).toBe('Revisa el teléfono.')
      expect(useGameStore.getState().caseProgress?.firedTensionEventIds.has('tension-test')).toBe(true)

      useGameStore.getState().clearNotification()
      useGameStore.getState().collectEvidence('recibo-materiales')
      // Already fired once — must not fire again and re-show the hint.
      expect(useGameStore.getState().notification).toBeNull()
    })

    it("case001's real lock event hides the comprador thread once triggered, but the evidence stays reachable through dialogue redundancy", () => {
      useGameStore.getState().selectCase(case001)

      // Ask every dialogue for every suspect — 4 + 6 + 4 = 14 actions, exactly
      // case001's real tension-001-lock threshold.
      for (const suspect of case001.suspects) {
        for (const dialogue of suspect.dialogues) {
          useGameStore.getState().askQuestion(suspect.id, dialogue.id, dialogue.revealedEvidenceIds)
        }
      }

      const progress = useGameStore.getState().caseProgress!
      expect(progress.actionCount).toBe(14)
      expect(progress.firedTensionEventIds.has('tension-001-lock')).toBe(true)
      expect(progress.lockedThreadIds.has('thread-comprador')).toBe(true)
      expect(progress.lockedNoteIds.has('nota-borrador-delgado')).toBe(true)

      const device = case001.digitalDevices!.find((d) => d.id === 'phone-delgado')!
      const visibleThreads = getVisibleThreads(device, progress)
      expect(visibleThreads.find((t) => t.id === 'thread-comprador')).toBeUndefined()

      // The redundant dialogue path (m-q6) already secured the evidence
      // before the lock fired, so losing the thread doesn't break the case.
      expect(progress.collectedEvidenceIds.has('chat-comprador')).toBe(true)
    })
  })

  describe('connectEvidence / disconnectEvidence', () => {
    it('connectEvidence adds a connection to caseProgress.playerConnections', () => {
      useGameStore.getState().selectCase(case001)
      useGameStore.getState().connectEvidence('ficha-evaluacion', 'marco-delgado')
      expect(useGameStore.getState().caseProgress?.playerConnections).toEqual([
        { fromId: 'ficha-evaluacion', toId: 'marco-delgado' },
      ])
    })

    it('reconnecting the same evidence to a different suspect moves the string', () => {
      useGameStore.getState().selectCase(case001)
      useGameStore.getState().connectEvidence('ficha-evaluacion', 'marco-delgado')
      useGameStore.getState().connectEvidence('ficha-evaluacion', 'sofia-reyes')
      expect(useGameStore.getState().caseProgress?.playerConnections).toEqual([
        { fromId: 'ficha-evaluacion', toId: 'sofia-reyes' },
      ])
    })

    it('disconnectEvidence removes only that evidence\'s connection', () => {
      useGameStore.getState().selectCase(case001)
      useGameStore.getState().connectEvidence('ficha-evaluacion', 'marco-delgado')
      useGameStore.getState().connectEvidence('recibo-materiales', 'marco-delgado')
      useGameStore.getState().disconnectEvidence('ficha-evaluacion')
      expect(useGameStore.getState().caseProgress?.playerConnections).toEqual([
        { fromId: 'recibo-materiales', toId: 'marco-delgado' },
      ])
    })

    it('is a no-op with no active case', () => {
      useGameStore.getState().resetCase()
      expect(() => useGameStore.getState().connectEvidence('a', 'b')).not.toThrow()
      expect(() => useGameStore.getState().disconnectEvidence('a')).not.toThrow()
    })
  })

  describe('resetCase / showNotification / clearNotification', () => {
    it('resetCase clears the active case and returns to case-selection', () => {
      useGameStore.getState().selectCase(case001)
      useGameStore.getState().resetCase()
      const state = useGameStore.getState()
      expect(state.scene).toBe('case-selection')
      expect(state.selectedCase).toBeNull()
      expect(state.caseProgress).toBeNull()
    })

    it('showNotification/clearNotification set and clear the message', () => {
      useGameStore.getState().showNotification('hola')
      expect(useGameStore.getState().notification).toBe('hola')
      useGameStore.getState().clearNotification()
      expect(useGameStore.getState().notification).toBeNull()
    })
  })
})
