import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useGameStore } from '../store/gameStore'
import { getVisibleThreads } from '../engine/DigitalForensicsEngine'
import { audioEngine } from '../audio/AudioEngine'
import case001 from '../data/cases/case001'
import type { Case, GameState } from '../types'

const INITIAL_STATE: GameState = JSON.parse(JSON.stringify(useGameStore.getState()))
// playerStats is the only plain-serializable slice we actually need reset between tests;
// the rest (scene/selectedCase/caseProgress/selectedSuspect/notifications) is reset to its
// real initial value below without going through JSON (Sets/functions wouldn't survive it).

function resetStore() {
  useGameStore.setState({
    scene: 'main-menu',
    selectedCase: null,
    caseProgress: null,
    selectedSuspect: null,
    playerStats: { ...INITIAL_STATE.playerStats },
    notifications: [],
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

    // "← Casos" y volver a tocar el mismo caso borraba todo el progreso sin aviso
    it('re-selecting the same unsolved case resumes it instead of wiping progress', () => {
      useGameStore.getState().selectCase(case001)
      useGameStore.getState().collectEvidence('recibo-materiales')
      useGameStore.getState().goTo('case-selection')
      useGameStore.getState().selectCase(case001)
      const state = useGameStore.getState()
      expect(state.caseProgress?.collectedEvidenceIds.has('recibo-materiales')).toBe(true)
      expect(state.scene).toBe('crime-scene')
    })

    it('a solved case starts over when selected again', () => {
      useGameStore.getState().selectCase(case001)
      useGameStore.getState().collectEvidence('recibo-materiales')
      useGameStore.getState().submitAccusation({ suspectId: 'marco-delgado' })
      useGameStore.getState().selectCase(case001)
      const state = useGameStore.getState()
      expect(state.caseProgress?.collectedEvidenceIds.size).toBe(0)
      expect(state.caseProgress?.solved).toBe(false)
      expect(state.scene).toBe('case-intro')
    })

    it('selecting a different case starts that one fresh', () => {
      useGameStore.getState().selectCase(case001)
      useGameStore.getState().collectEvidence('recibo-materiales')
      const other = { ...case001, id: 'otro-caso' } as Case
      useGameStore.getState().selectCase(other)
      expect(useGameStore.getState().caseProgress?.caseId).toBe('otro-caso')
      expect(useGameStore.getState().caseProgress?.collectedEvidenceIds.size).toBe(0)
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

  describe('askQuestion', () => {
    beforeEach(() => {
      useGameStore.getState().selectCase(case001)
    })

    it('records the interview and increments totalEvidenceFound for newly revealed evidence', () => {
      useGameStore.getState().askQuestion('valentina-cruz', 'v-q2', ['ficha-evaluacion'])
      const state = useGameStore.getState()
      expect(state.caseProgress?.interviewedSuspects['valentina-cruz']?.has('v-q2')).toBe(true)
      expect(state.caseProgress?.collectedEvidenceIds.has('ficha-evaluacion')).toBe(true)
      expect(state.playerStats.totalEvidenceFound).toBe(1)
    })

    it('does not double-count evidence already collected through another source (ficha-evaluacion via hotspot, then via dialogue)', () => {
      useGameStore.getState().collectEvidence('ficha-evaluacion')
      useGameStore.getState().askQuestion('valentina-cruz', 'v-q2', ['ficha-evaluacion'])
      expect(useGameStore.getState().playerStats.totalEvidenceFound).toBe(1)
    })

    it('does not double-count when the same evidence is revealed by two different suspects\' dialogues', () => {
      // ficha-evaluacion is revealed by both v-q2 (Valentina) and m-q1 (Marco) in case001.
      useGameStore.getState().askQuestion('valentina-cruz', 'v-q2', ['ficha-evaluacion'])
      useGameStore.getState().askQuestion('marco-delgado', 'm-q1', ['ficha-evaluacion'])
      expect(useGameStore.getState().playerStats.totalEvidenceFound).toBe(1)
    })

    it('only counts the evidence ids that are actually new when a dialogue reveals several at once', () => {
      useGameStore.getState().collectEvidence('camara-seguridad') // +1 (independent of the dialogue below)
      useGameStore.getState().askQuestion('sofia-reyes', 's-q4', ['camara-seguridad', 'maletin-fotos'])
      // camara-seguridad was already collected and must not be re-counted; maletin-fotos is genuinely new.
      expect(useGameStore.getState().playerStats.totalEvidenceFound).toBe(2)
      expect(useGameStore.getState().caseProgress?.collectedEvidenceIds.has('maletin-fotos')).toBe(true)
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

    // Ir y volver entre chats ya leídos adelantaba la cuenta de acciones y disparaba
    // la purga de evidencia antes de tiempo.
    it('re-opening an already-read thread does not advance the tension counter', () => {
      useGameStore.getState().openDigitalThread('phone-delgado', 'thread-comprador')
      const after1 = useGameStore.getState().caseProgress!.actionCount
      for (let i = 0; i < 10; i++) useGameStore.getState().openDigitalThread('phone-delgado', 'thread-comprador')
      expect(useGameStore.getState().caseProgress!.actionCount).toBe(after1)
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

    // La pantalla de acusación sigue montada y clickeable durante su animación de
    // salida: un doble clic contaba el caso dos veces (y dos "flawless" acercaban el rango tope).
    it('a second submit (double click) does not count the case again', () => {
      useGameStore.getState().collectEvidence('recibo-materiales')
      useGameStore.getState().collectEvidence('chat-comprador')
      useGameStore.getState().collectEvidence('ficha-evaluacion')
      const input = {
        suspectId: 'marco-delgado',
        meansEvidenceId: 'recibo-materiales',
        motiveEvidenceId: 'chat-comprador',
        opportunityEvidenceId: 'ficha-evaluacion',
      }
      useGameStore.getState().submitAccusation(input)
      useGameStore.getState().submitAccusation(input)
      useGameStore.getState().submitAccusation({ suspectId: 'valentina-cruz' })

      const state = useGameStore.getState()
      expect(state.playerStats).toMatchObject({ casesCompleted: 1, correctAccusations: 1, flawlessCases: 1 })
      expect(state.caseProgress?.accusedSuspectId).toBe('marco-delgado')
    })
  })

  describe('audio side effects', () => {
    let sfxSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      useGameStore.getState().selectCase(case001)
      sfxSpy = vi.spyOn(audioEngine, 'playSfx').mockImplementation(() => {})
    })

    afterEach(() => {
      sfxSpy.mockRestore()
    })

    it('collectEvidence plays the evidence chime', () => {
      useGameStore.getState().collectEvidence('fragmento-cristal')
      expect(sfxSpy).toHaveBeenCalledWith('evidence')
    })

    it('collectEvidence does not re-play the chime for an already-collected item', () => {
      useGameStore.getState().collectEvidence('fragmento-cristal')
      sfxSpy.mockClear()
      useGameStore.getState().collectEvidence('fragmento-cristal')
      expect(sfxSpy).not.toHaveBeenCalled()
    })

    it('askQuestion only plays the chime when it actually reveals new evidence', () => {
      useGameStore.getState().askQuestion('valentina-cruz', 'v-q1', [])
      expect(sfxSpy).not.toHaveBeenCalledWith('evidence')
      useGameStore.getState().askQuestion('valentina-cruz', 'v-q2', ['ficha-evaluacion'])
      expect(sfxSpy).toHaveBeenCalledWith('evidence')
    })

    it('discoverDevice plays a distinct device-found sound', () => {
      useGameStore.getState().discoverDevice('phone-delgado')
      expect(sfxSpy).toHaveBeenCalledWith('device-found')
    })

    it('unlockDevice plays unlock-success on the right code and unlock-fail on the wrong one', () => {
      useGameStore.getState().unlockDevice('phone-delgado', '0000')
      expect(sfxSpy).toHaveBeenCalledWith('unlock-fail')
      sfxSpy.mockClear()
      useGameStore.getState().unlockDevice('phone-delgado', '1103')
      expect(sfxSpy).toHaveBeenCalledWith('unlock-success')
    })

    it('a fired tension event plays the tension sting', () => {
      const caseWithTension: Case = {
        ...case001,
        tensionEvents: [{ id: 't', triggerActionCount: 1, message: 'hint', effect: { revealHint: 'hint' } }],
      }
      useGameStore.getState().selectCase(caseWithTension)
      useGameStore.getState().collectEvidence('fragmento-cristal')
      expect(sfxSpy).toHaveBeenCalledWith('tension')
    })

    it('submitAccusation plays the accuse thud immediately and schedules the matching resolution sting via the audio clock (no JS timer)', () => {
      useGameStore.getState().submitAccusation({ suspectId: 'marco-delgado' })
      expect(sfxSpy).toHaveBeenCalledWith('accuse')
      expect(sfxSpy).toHaveBeenCalledWith('resolution-partial', 0.55)
    })

    it('submitAccusation plays resolution-lose for a wrong accusation with meaningful progress made', () => {
      // Push progress above the 25% "insufficient-evidence" floor so this
      // actually exercises wrong-suspect-culprit-escapes -> resolution-lose.
      for (const id of ['fragmento-cristal', 'ficha-evaluacion', 'recibo-materiales', 'camara-seguridad', 'guante-trabajo', 'nota-amenaza']) {
        useGameStore.getState().collectEvidence(id)
      }
      useGameStore.getState().submitAccusation({ suspectId: 'valentina-cruz' })
      expect(sfxSpy).toHaveBeenCalledWith('resolution-lose', 0.55)
    })

    it('submitAccusation plays resolution-neutral for an accusation with almost no progress made', () => {
      useGameStore.getState().submitAccusation({ suspectId: 'valentina-cruz' })
      expect(sfxSpy).toHaveBeenCalledWith('resolution-neutral', 0.55)
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
      expect(useGameStore.getState().notifications).toEqual([])

      useGameStore.getState().collectEvidence('ficha-evaluacion')
      expect(useGameStore.getState().notifications).toEqual(['Revisa el teléfono.'])
      expect(useGameStore.getState().caseProgress?.firedTensionEventIds.has('tension-test')).toBe(true)

      useGameStore.getState().clearNotification()
      useGameStore.getState().collectEvidence('recibo-materiales')
      // Already fired once — must not fire again and re-show the hint.
      expect(useGameStore.getState().notifications).toEqual([])
    })

    it('queues a hint notification instead of clobbering one already pending (the CrimeScene/Interrogation clobber bug)', () => {
      const caseWithTension: Case = {
        ...case001,
        tensionEvents: [
          { id: 'tension-test', triggerActionCount: 1, message: 'fallback', effect: { revealHint: 'Pista de tensión.' } },
        ],
      }
      useGameStore.getState().selectCase(caseWithTension)

      // Same sequence CrimeScene.handleHotspotClick runs: the store action
      // fires the tension hint, then the scene calls showNotification for
      // "evidence collected" right after, in the same synchronous tick.
      useGameStore.getState().collectEvidence('fragmento-cristal')
      useGameStore.getState().showNotification('Evidencia recopilada: Fragmento de Cristal')

      // Both must survive, in the order they actually happened — neither
      // silently overwrites the other.
      expect(useGameStore.getState().notifications).toEqual([
        'Pista de tensión.',
        'Evidencia recopilada: Fragmento de Cristal',
      ])
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

    it('showNotification appends to the queue; clearNotification dismisses the oldest', () => {
      useGameStore.getState().showNotification('hola')
      expect(useGameStore.getState().notifications).toEqual(['hola'])
      useGameStore.getState().showNotification('mundo')
      expect(useGameStore.getState().notifications).toEqual(['hola', 'mundo'])
      useGameStore.getState().clearNotification()
      expect(useGameStore.getState().notifications).toEqual(['mundo'])
      useGameStore.getState().clearNotification()
      expect(useGameStore.getState().notifications).toEqual([])
    })

    it('clearAllNotifications empties the whole queue at once, not just the oldest', () => {
      useGameStore.getState().showNotification('uno')
      useGameStore.getState().showNotification('dos')
      useGameStore.getState().showNotification('tres')
      expect(useGameStore.getState().notifications).toHaveLength(3)
      useGameStore.getState().clearAllNotifications()
      expect(useGameStore.getState().notifications).toEqual([])
    })
  })
})
