import { describe, it, expect } from 'vitest'
import {
  getEvidenceTypeLabel,
  getEvidenceTypeColor,
  groupEvidenceByType,
  filterKeyEvidence,
  countByType,
  evidencePointsToSuspect,
  normalizeConnection,
  addConnection,
  removeConnection,
  isConnectionCorrect,
  getConnectionAccuracy,
} from '../engine/EvidenceEngine'
import case001 from '../data/cases/case001'
import type { EvidenceConnection } from '../types'

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

  describe('normalizeConnection', () => {
    it('builds a plain fromId/toId connection', () => {
      expect(normalizeConnection('ev-1', 'sus-1')).toEqual({ fromId: 'ev-1', toId: 'sus-1' })
    })
  })

  describe('addConnection', () => {
    it('appends a new connection to an empty list', () => {
      const result = addConnection([], { fromId: 'ev-1', toId: 'sus-1' })
      expect(result).toEqual([{ fromId: 'ev-1', toId: 'sus-1' }])
    })

    it('appends alongside connections from other evidence', () => {
      const existing: EvidenceConnection[] = [{ fromId: 'ev-1', toId: 'sus-1' }]
      const result = addConnection(existing, { fromId: 'ev-2', toId: 'sus-2' })
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ fromId: 'ev-1', toId: 'sus-1' })
      expect(result).toContainEqual({ fromId: 'ev-2', toId: 'sus-2' })
    })

    it('moving the same evidence to a new suspect replaces the old connection instead of stacking it', () => {
      const existing: EvidenceConnection[] = [{ fromId: 'ev-1', toId: 'sus-1' }]
      const result = addConnection(existing, { fromId: 'ev-1', toId: 'sus-2' })
      expect(result).toEqual([{ fromId: 'ev-1', toId: 'sus-2' }])
    })

    it('does not mutate the original array', () => {
      const existing: EvidenceConnection[] = [{ fromId: 'ev-1', toId: 'sus-1' }]
      addConnection(existing, { fromId: 'ev-2', toId: 'sus-2' })
      expect(existing).toEqual([{ fromId: 'ev-1', toId: 'sus-1' }])
    })
  })

  describe('removeConnection', () => {
    it('removes the connection for the given evidence id', () => {
      const existing: EvidenceConnection[] = [
        { fromId: 'ev-1', toId: 'sus-1' },
        { fromId: 'ev-2', toId: 'sus-2' },
      ]
      expect(removeConnection(existing, 'ev-1')).toEqual([{ fromId: 'ev-2', toId: 'sus-2' }])
    })

    it('is a no-op when the evidence id has no connection', () => {
      const existing: EvidenceConnection[] = [{ fromId: 'ev-1', toId: 'sus-1' }]
      expect(removeConnection(existing, 'unknown')).toEqual(existing)
    })
  })

  describe('isConnectionCorrect', () => {
    it('returns true for a pair that matches the case solution', () => {
      const correct = case001.correctConnections![0]
      expect(isConnectionCorrect(case001, correct)).toBe(true)
    })

    it('returns false for a pair not in the case solution', () => {
      expect(isConnectionCorrect(case001, { fromId: 'ficha-evaluacion', toId: 'sofia-reyes' })).toBe(false)
    })

    it('returns false when the case has no correctConnections at all', () => {
      const caseWithout = { ...case001, correctConnections: undefined }
      expect(isConnectionCorrect(caseWithout, { fromId: 'ficha-evaluacion', toId: 'marco-delgado' })).toBe(false)
    })
  })

  describe('getConnectionAccuracy', () => {
    it('returns 0/0 when the case has no correctConnections', () => {
      const caseWithout = { ...case001, correctConnections: undefined }
      expect(getConnectionAccuracy(caseWithout, [])).toEqual({ correct: 0, total: 0, percent: 0 })
    })

    it('counts only the player connections that match, out of the full solution size', () => {
      const total = case001.correctConnections!.length
      const oneCorrect = [case001.correctConnections![0]]
      expect(getConnectionAccuracy(case001, oneCorrect)).toEqual({
        correct: 1,
        total,
        percent: Math.round((1 / total) * 100),
      })
    })

    it('ignores incorrect player connections when counting correct ones', () => {
      const wrong: EvidenceConnection = { fromId: 'ficha-evaluacion', toId: 'sofia-reyes' }
      expect(getConnectionAccuracy(case001, [wrong]).correct).toBe(0)
    })

    it('is 100% when every correct connection has been found', () => {
      const result = getConnectionAccuracy(case001, case001.correctConnections!)
      expect(result.percent).toBe(100)
      expect(result.correct).toBe(result.total)
    })
  })
})
