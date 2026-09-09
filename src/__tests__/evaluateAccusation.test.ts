import { describe, it, expect } from 'vitest'
import { createCaseProgress, collectEvidence, evaluateAccusation } from '../engine/CaseEngine'
import type { Case, CaseProgress } from '../types'
import case001 from '../data/cases/case001'

function freshProgress(): CaseProgress {
  return createCaseProgress(case001.id)
}

describe('evaluateAccusation', () => {
  describe('wrong suspect', () => {
    it('returns insufficient-evidence when very little progress has been made', () => {
      const progress = freshProgress()
      const result = evaluateAccusation(progress, case001, { suspectId: 'valentina-cruz' })
      expect(result.correct).toBe(false)
      expect(result.ending).toBe('insufficient-evidence')
      expect(result.proofScore).toBe(0)
    })

    it('returns wrong-suspect-culprit-escapes once meaningful progress has been made', () => {
      let progress = freshProgress()
      for (const id of case001.evidence.map((e) => e.id)) {
        progress = collectEvidence(progress, id)
      }
      const result = evaluateAccusation(progress, case001, { suspectId: 'valentina-cruz' })
      expect(result.correct).toBe(false)
      expect(result.ending).toBe('wrong-suspect-culprit-escapes')
      expect(result.proofScore).toBe(0)
    })
  })

  describe('correct suspect, case with solution.proof defined (case001)', () => {
    it('returns correct-full-case when all three proof categories are satisfied', () => {
      let progress = freshProgress()
      progress = collectEvidence(progress, 'recibo-materiales')
      progress = collectEvidence(progress, 'guante-trabajo')
      progress = collectEvidence(progress, 'chat-comprador')
      progress = collectEvidence(progress, 'ficha-evaluacion')

      const result = evaluateAccusation(progress, case001, {
        suspectId: 'marco-delgado',
        meansEvidenceId: 'recibo-materiales',
        motiveEvidenceId: 'chat-comprador',
        opportunityEvidenceId: 'ficha-evaluacion',
      })

      expect(result.correct).toBe(true)
      expect(result.ending).toBe('correct-full-case')
      expect(result.proofScore).toBe(3)
      expect(result.proofDetail).toEqual({ means: true, motive: true, opportunity: true })
    })

    it('returns correct-partial-reasoning when a category is missing', () => {
      let progress = freshProgress()
      progress = collectEvidence(progress, 'ficha-evaluacion')

      const result = evaluateAccusation(progress, case001, {
        suspectId: 'marco-delgado',
        opportunityEvidenceId: 'ficha-evaluacion',
      })

      expect(result.correct).toBe(true)
      expect(result.ending).toBe('correct-partial-reasoning')
      expect(result.proofScore).toBe(1)
      expect(result.proofDetail).toEqual({ means: false, motive: false, opportunity: true })
    })

    it('does not credit evidence the player never actually collected', () => {
      const progress = freshProgress() // nothing collected
      const result = evaluateAccusation(progress, case001, {
        suspectId: 'marco-delgado',
        opportunityEvidenceId: 'ficha-evaluacion', // valid category id, but not collected
      })
      expect(result.proofDetail.opportunity).toBe(false)
      expect(result.proofScore).toBe(0)
      expect(result.ending).toBe('correct-partial-reasoning')
    })

    it('rejects an evidence id that is collected but not listed for that category', () => {
      let progress = freshProgress()
      progress = collectEvidence(progress, 'nota-amenaza') // real evidence, wrong category
      const result = evaluateAccusation(progress, case001, {
        suspectId: 'marco-delgado',
        opportunityEvidenceId: 'nota-amenaza',
      })
      expect(result.proofDetail.opportunity).toBe(false)
    })
  })

  describe('correct suspect, case without solution.proof (unmigrated legacy case)', () => {
    const legacyCase: Case = { ...case001, solution: { ...case001.solution, proof: undefined } }

    it('reaches correct-full-case vacuously when no proof categories are authored', () => {
      const progress = freshProgress()
      const result = evaluateAccusation(progress, legacyCase, { suspectId: 'marco-delgado' })
      expect(result.correct).toBe(true)
      expect(result.ending).toBe('correct-full-case')
      expect(result.proofScore).toBe(3)
      expect(result.proofDetail).toEqual({ means: true, motive: true, opportunity: true })
    })
  })
})
