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
})
