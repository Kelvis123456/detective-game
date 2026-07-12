import { describe, it, expect } from 'vitest'
import {
  getEvidenceTypeLabel,
  getEvidenceTypeColor,
  groupEvidenceByType,
  filterKeyEvidence,
  countByType,
  evidencePointsToSuspect,
} from '../engine/EvidenceEngine'
import case001 from '../data/cases/case001'

describe('EvidenceEngine', () => {
  describe('getEvidenceTypeLabel', () => {
    it('returns correct label for each type', () => {
      expect(getEvidenceTypeLabel('physical')).toBe('Evidencia Física')
      expect(getEvidenceTypeLabel('testimony')).toBe('Testimonio')
      expect(getEvidenceTypeLabel('document')).toBe('Documento')
      expect(getEvidenceTypeLabel('digital')).toBe('Digital')
    })
  })

  describe('getEvidenceTypeColor', () => {
    it('returns a hex color for each type', () => {
      const types = ['physical', 'testimony', 'document', 'digital'] as const
      for (const type of types) {
        const color = getEvidenceTypeColor(type)
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      }
    })
  })

  describe('groupEvidenceByType', () => {
    it('groups evidence by type', () => {
      const grouped = groupEvidenceByType(case001.evidence)
      const types = Object.keys(grouped)
      expect(types.length).toBeGreaterThan(0)
    })

    it('each group contains correct type', () => {
      const grouped = groupEvidenceByType(case001.evidence)
      for (const [type, items] of Object.entries(grouped)) {
        for (const item of items) {
          expect(item.type).toBe(type)
        }
      }
    })

    it('all evidence is accounted for', () => {
      const grouped = groupEvidenceByType(case001.evidence)
      const total = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0)
      expect(total).toBe(case001.evidence.length)
    })
  })

  describe('filterKeyEvidence', () => {
    it('returns only key evidence', () => {
      const key = filterKeyEvidence(case001.evidence)
      expect(key.length).toBeGreaterThan(0)
      for (const e of key) {
        expect(e.isKey).toBe(true)
      }
    })

    it('all non-key evidence is excluded', () => {
      const key = filterKeyEvidence(case001.evidence)
      const nonKey = case001.evidence.filter((e) => !e.isKey)
      for (const e of nonKey) {
        expect(key.some((k) => k.id === e.id)).toBe(false)
      }
    })
  })

  describe('countByType', () => {
    it('returns counts for all 4 types', () => {
      const counts = countByType(case001.evidence)
      expect(counts).toHaveProperty('physical')
      expect(counts).toHaveProperty('testimony')
      expect(counts).toHaveProperty('document')
      expect(counts).toHaveProperty('digital')
    })

    it('total counts match evidence length', () => {
      const counts = countByType(case001.evidence)
      const total = Object.values(counts).reduce((s, n) => s + n, 0)
      expect(total).toBe(case001.evidence.length)
    })

    it('returns zero for types not present', () => {
      const counts = countByType(case001.evidence)
      expect(counts.testimony).toBe(0)
    })
  })

  describe('evidencePointsToSuspect', () => {
    it('returns true when evidence mentions suspect name', () => {
      const result = evidencePointsToSuspect(case001.evidence, 'Delgado')
      expect(result).toBe(true)
    })

    it('returns false when evidence does not mention suspect', () => {
      const result = evidencePointsToSuspect(case001.evidence, 'XyzUnknownPerson')
      expect(result).toBe(false)
    })

    it('is case-insensitive', () => {
      const upper = evidencePointsToSuspect(case001.evidence, 'DELGADO')
      const lower = evidencePointsToSuspect(case001.evidence, 'delgado')
      expect(upper).toBe(lower)
    })
  })
})
