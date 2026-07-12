import { describe, it, expect } from 'vitest'
import { ALL_CASES, getCaseById } from '../data'

describe('Case Data Integrity', () => {
  it('has at least 3 cases', () => {
    expect(ALL_CASES.length).toBeGreaterThanOrEqual(3)
  })

  describe.each(ALL_CASES.map((c) => [c.title, c]))('Case: %s', (_, case_) => {
    it('has required fields', () => {
      expect(case_.id).toBeTruthy()
      expect(case_.title).toBeTruthy()
      expect(case_.difficulty).toMatch(/Fácil|Medio|Difícil/)
    })

    it('has at least 2 suspects', () => {
      expect(case_.suspects.length).toBeGreaterThanOrEqual(2)
    })

    it('has exactly one guilty suspect', () => {
      const guilty = case_.suspects.filter((s) => s.isGuilty)
      expect(guilty.length).toBe(1)
    })

    it('solution guiltyId matches a guilty suspect', () => {
      const guiltyId = case_.solution.guiltyId
      const suspect = case_.suspects.find((s) => s.id === guiltyId)
      expect(suspect).toBeDefined()
      expect(suspect?.isGuilty).toBe(true)
    })

    it('has at least 3 evidence items', () => {
      expect(case_.evidence.length).toBeGreaterThanOrEqual(3)
    })

    it('has at least one key evidence', () => {
      const key = case_.evidence.filter((e) => e.isKey)
      expect(key.length).toBeGreaterThanOrEqual(1)
    })

    it('all evidence ids are unique', () => {
      const ids = case_.evidence.map((e) => e.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })

    it('all suspect ids are unique', () => {
      const ids = case_.suspects.map((s) => s.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })

    it('each suspect has at least one dialogue', () => {
      for (const suspect of case_.suspects) {
        expect(suspect.dialogues.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('all dialogue ids are unique across suspects', () => {
      const allIds = case_.suspects.flatMap((s) => s.dialogues.map((d) => d.id))
      const unique = new Set(allIds)
      expect(unique.size).toBe(allIds.length)
    })

    it('revealedEvidenceIds in dialogues reference valid evidence', () => {
      const evidenceIds = new Set(case_.evidence.map((e) => e.id))
      for (const suspect of case_.suspects) {
        for (const dialogue of suspect.dialogues) {
          for (const id of dialogue.revealedEvidenceIds) {
            expect(evidenceIds.has(id)).toBe(true)
          }
        }
      }
    })

    it('solution timeline has at least one event', () => {
      expect(case_.solution.timeline.length).toBeGreaterThanOrEqual(1)
    })

    it('hotspot evidenceIds reference valid evidence or null', () => {
      const evidenceIds = new Set(case_.evidence.map((e) => e.id))
      for (const hotspot of case_.hotspots) {
        if (hotspot.evidenceId !== null) {
          expect(evidenceIds.has(hotspot.evidenceId)).toBe(true)
        }
      }
    })
  })

  describe('getCaseById', () => {
    it('finds existing case', () => {
      const c = getCaseById('case-001')
      expect(c).toBeDefined()
      expect(c?.id).toBe('case-001')
    })

    it('returns undefined for unknown id', () => {
      const c = getCaseById('unknown-id')
      expect(c).toBeUndefined()
    })
  })
})
