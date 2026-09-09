import { describe, it, expect, beforeEach } from 'vitest'
import {
  createCaseProgress,
  collectEvidence,
  recordInterview,
  makeAccusation,
  getCollectedEvidence,
  getProgressPercent,
  hasKeyEvidence,
  getEvidenceRevealedByDialogue,
  getSuspectById,
  incrementActionCount,
  checkTensionEvents,
  applyTensionEvent,
} from '../engine/CaseEngine'
import { CaseProgress } from '../types'
import case001 from '../data/cases/case001'

describe('CaseEngine', () => {
  let progress: CaseProgress

  beforeEach(() => {
    progress = createCaseProgress(case001.id)
  })

  describe('createCaseProgress', () => {
    it('creates progress with empty collections', () => {
      expect(progress.caseId).toBe(case001.id)
      expect(progress.collectedEvidenceIds.size).toBe(0)
      expect(Object.keys(progress.interviewedSuspects).length).toBe(0)
      expect(progress.accusedSuspectId).toBeNull()
      expect(progress.solved).toBe(false)
      expect(progress.correct).toBe(false)
    })
  })

  describe('collectEvidence', () => {
    it('adds evidence id to collected set', () => {
      const updated = collectEvidence(progress, 'fragmento-cristal')
      expect(updated.collectedEvidenceIds.has('fragmento-cristal')).toBe(true)
    })

    it('does not mutate original progress', () => {
      collectEvidence(progress, 'fragmento-cristal')
      expect(progress.collectedEvidenceIds.size).toBe(0)
    })

    it('can collect multiple evidences', () => {
      let p = collectEvidence(progress, 'fragmento-cristal')
      p = collectEvidence(p, 'ficha-evaluacion')
      p = collectEvidence(p, 'recibo-materiales')
      expect(p.collectedEvidenceIds.size).toBe(3)
    })
  })

  describe('recordInterview', () => {
    it('records a dialogue question for a suspect', () => {
      const updated = recordInterview(progress, 'valentina-cruz', 'v-q1')
      expect(updated.interviewedSuspects['valentina-cruz'].has('v-q1')).toBe(true)
    })

    it('accumulates multiple questions for same suspect', () => {
      let p = recordInterview(progress, 'marco-delgado', 'm-q1')
      p = recordInterview(p, 'marco-delgado', 'm-q2')
      p = recordInterview(p, 'marco-delgado', 'm-q3')
      expect(p.interviewedSuspects['marco-delgado'].size).toBe(3)
    })

    it('tracks questions for different suspects independently', () => {
      let p = recordInterview(progress, 'valentina-cruz', 'v-q1')
      p = recordInterview(p, 'marco-delgado', 'm-q1')
      expect(p.interviewedSuspects['valentina-cruz'].size).toBe(1)
      expect(p.interviewedSuspects['marco-delgado'].size).toBe(1)
    })
  })

  describe('makeAccusation', () => {
    it('marks case solved with correct accusation', () => {
      const updated = makeAccusation(progress, case001, 'marco-delgado')
      expect(updated.solved).toBe(true)
      expect(updated.correct).toBe(true)
      expect(updated.accusedSuspectId).toBe('marco-delgado')
    })

    it('marks case solved with incorrect accusation', () => {
      const updated = makeAccusation(progress, case001, 'valentina-cruz')
      expect(updated.solved).toBe(true)
      expect(updated.correct).toBe(false)
    })

    it('does not mutate original progress', () => {
      makeAccusation(progress, case001, 'marco-delgado')
      expect(progress.solved).toBe(false)
    })
  })

  describe('getCollectedEvidence', () => {
    it('returns only collected evidence objects', () => {
      let p = collectEvidence(progress, 'fragmento-cristal')
      p = collectEvidence(p, 'ficha-evaluacion')
      const collected = getCollectedEvidence(p, case001)
      expect(collected.length).toBe(2)
      expect(collected.map((e) => e.id)).toContain('fragmento-cristal')
      expect(collected.map((e) => e.id)).toContain('ficha-evaluacion')
    })

    it('returns empty array when nothing collected', () => {
      const collected = getCollectedEvidence(progress, case001)
      expect(collected.length).toBe(0)
    })
  })

  describe('getProgressPercent', () => {
    it('returns 0 when no progress', () => {
      expect(getProgressPercent(progress, case001)).toBe(0)
    })

    it('increases as evidence is collected', () => {
      const p = collectEvidence(progress, 'fragmento-cristal')
      expect(getProgressPercent(p, case001)).toBeGreaterThan(0)
    })

    it('is higher with more evidence', () => {
      let p1 = collectEvidence(progress, 'fragmento-cristal')
      let p2 = collectEvidence(p1, 'ficha-evaluacion')
      expect(getProgressPercent(p2, case001)).toBeGreaterThan(getProgressPercent(p1, case001))
    })
  })

  describe('hasKeyEvidence', () => {
    it('returns false when key evidence not collected', () => {
      expect(hasKeyEvidence(progress, case001)).toBe(false)
    })

    it('returns true only when all key evidence collected', () => {
      const keyIds = case001.evidence.filter((e) => e.isKey).map((e) => e.id)
      let p = progress
      for (const id of keyIds) {
        p = collectEvidence(p, id)
      }
      expect(hasKeyEvidence(p, case001)).toBe(true)
    })
  })

  describe('getEvidenceRevealedByDialogue', () => {
    it('returns evidence revealed by a specific dialogue', () => {
      const revealed = getEvidenceRevealedByDialogue(case001, 'v-q2')
      expect(revealed.map((e) => e.id)).toContain('ficha-evaluacion')
    })

    it('returns empty array for dialogue that reveals nothing', () => {
      const revealed = getEvidenceRevealedByDialogue(case001, 'v-q1')
      expect(revealed.length).toBe(0)
    })

    it('returns empty array for unknown dialogue id', () => {
      const revealed = getEvidenceRevealedByDialogue(case001, 'nonexistent')
      expect(revealed.length).toBe(0)
    })
  })

  describe('getSuspectById', () => {
    it('finds suspect by id', () => {
      const suspect = getSuspectById(case001, 'marco-delgado')
      expect(suspect).toBeDefined()
      expect(suspect?.name).toBe('Marco Delgado')
    })

    it('returns undefined for unknown id', () => {
      const suspect = getSuspectById(case001, 'unknown')
      expect(suspect).toBeUndefined()
    })
  })

  describe('createCaseProgress — new digital/tension/connection fields', () => {
    it('initializes every new collection field empty and actionCount at 0', () => {
      expect(progress.discoveredDeviceIds.size).toBe(0)
      expect(progress.unlockedDeviceIds.size).toBe(0)
      expect(progress.readThreadIds.size).toBe(0)
      expect(progress.readNoteIds.size).toBe(0)
      expect(progress.lockedThreadIds.size).toBe(0)
      expect(progress.lockedNoteIds.size).toBe(0)
      expect(progress.firedTensionEventIds.size).toBe(0)
      expect(progress.actionCount).toBe(0)
      expect(progress.playerConnections).toEqual([])
      expect(progress.ending).toBeUndefined()
      expect(progress.accusationProof).toBeUndefined()
    })
  })

  describe('incrementActionCount', () => {
    it('increments actionCount by 1', () => {
      const next = incrementActionCount(progress)
      expect(next.actionCount).toBe(1)
      expect(incrementActionCount(next).actionCount).toBe(2)
    })

    it('does not mutate the original progress', () => {
      incrementActionCount(progress)
      expect(progress.actionCount).toBe(0)
    })
  })

  describe('checkTensionEvents', () => {
    it('returns an empty array when the case has no tensionEvents', () => {
      expect(checkTensionEvents(progress, case001Base({ tensionEvents: undefined }))).toEqual([])
    })

    it('returns an empty array when actionCount has not reached the trigger yet', () => {
      const case_ = case001Base({
        tensionEvents: [{ id: 't1', triggerActionCount: 5, message: 'hint' }],
      })
      let p = progress
      for (let i = 0; i < 4; i++) p = incrementActionCount(p)
      expect(checkTensionEvents(p, case_)).toEqual([])
    })

    it('returns the event once actionCount reaches its trigger', () => {
      const case_ = case001Base({
        tensionEvents: [{ id: 't1', triggerActionCount: 3, message: 'hint' }],
      })
      let p = progress
      for (let i = 0; i < 3; i++) p = incrementActionCount(p)
      const fired = checkTensionEvents(p, case_)
      expect(fired).toHaveLength(1)
      expect(fired[0].id).toBe('t1')
    })

    it('does not return an event already present in firedTensionEventIds', () => {
      const case_ = case001Base({
        tensionEvents: [{ id: 't1', triggerActionCount: 1, message: 'hint' }],
      })
      let p = incrementActionCount(progress)
      p = { ...p, firedTensionEventIds: new Set(['t1']) }
      expect(checkTensionEvents(p, case_)).toEqual([])
    })

    it('can return multiple events whose thresholds were all reached at once', () => {
      const case_ = case001Base({
        tensionEvents: [
          { id: 't1', triggerActionCount: 1, message: 'a' },
          { id: 't2', triggerActionCount: 2, message: 'b' },
        ],
      })
      let p = progress
      for (let i = 0; i < 2; i++) p = incrementActionCount(p)
      const fired = checkTensionEvents(p, case_)
      expect(fired.map((e) => e.id).sort()).toEqual(['t1', 't2'])
    })
  })

  describe('applyTensionEvent', () => {
    it('marks the event id as fired', () => {
      const event = { id: 't1', triggerActionCount: 1, message: 'hint' }
      const next = applyTensionEvent(progress, event)
      expect(next.firedTensionEventIds.has('t1')).toBe(true)
    })

    it('does not mutate the original progress', () => {
      const event = { id: 't1', triggerActionCount: 1, message: 'hint' }
      applyTensionEvent(progress, event)
      expect(progress.firedTensionEventIds.has('t1')).toBe(false)
    })

    it('locks threads listed in effect.lockThreadIds', () => {
      const event = {
        id: 't1',
        triggerActionCount: 1,
        message: 'hint',
        effect: { lockThreadIds: ['thread-a', 'thread-b'] },
      }
      const next = applyTensionEvent(progress, event)
      expect(next.lockedThreadIds.has('thread-a')).toBe(true)
      expect(next.lockedThreadIds.has('thread-b')).toBe(true)
    })

    it('locks notes listed in effect.lockNoteIds', () => {
      const event = {
        id: 't1',
        triggerActionCount: 1,
        message: 'hint',
        effect: { lockNoteIds: ['note-a'] },
      }
      const next = applyTensionEvent(progress, event)
      expect(next.lockedNoteIds.has('note-a')).toBe(true)
    })

    it('handles an event with no effect at all without throwing', () => {
      const event = { id: 't1', triggerActionCount: 1, message: 'hint' }
      expect(() => applyTensionEvent(progress, event)).not.toThrow()
    })

    it('preserves previously locked threads/notes when applying another event', () => {
      let p = applyTensionEvent(progress, {
        id: 't1',
        triggerActionCount: 1,
        message: 'a',
        effect: { lockThreadIds: ['thread-a'] },
      })
      p = applyTensionEvent(p, {
        id: 't2',
        triggerActionCount: 2,
        message: 'b',
        effect: { lockThreadIds: ['thread-b'] },
      })
      expect(p.lockedThreadIds.has('thread-a')).toBe(true)
      expect(p.lockedThreadIds.has('thread-b')).toBe(true)
    })
  })
})

function case001Base(overrides: Partial<typeof case001>): typeof case001 {
  return { ...case001, ...overrides }
}
