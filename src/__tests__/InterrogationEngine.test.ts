import { describe, it, expect } from 'vitest'
import {
  getAvailableDialogues,
  getAskedDialogues,
  getEmotionalStateLabel,
  getEmotionalStateColor,
  getEmotionalStateIcon,
  isSuspectFullyInterviewed,
  getSuspectSuspicionLevel,
} from '../engine/InterrogationEngine'
import case001 from '../data/cases/case001'

const marco = case001.suspects.find((s) => s.id === 'marco-delgado')!
const valentina = case001.suspects.find((s) => s.id === 'valentina-cruz')!

describe('InterrogationEngine', () => {
  describe('getAvailableDialogues', () => {
    it('returns all dialogues when none asked', () => {
      const available = getAvailableDialogues(marco, new Set())
      expect(available.length).toBe(marco.dialogues.length)
    })

    it('excludes already asked dialogues', () => {
      const asked = new Set([marco.dialogues[0].id, marco.dialogues[1].id])
      const available = getAvailableDialogues(marco, asked)
      expect(available.length).toBe(marco.dialogues.length - 2)
    })

    it('returns empty when all asked', () => {
      const allIds = new Set(marco.dialogues.map((d) => d.id))
      const available = getAvailableDialogues(marco, allIds)
      expect(available.length).toBe(0)
    })
  })

  describe('getAskedDialogues', () => {
    it('returns only asked dialogues', () => {
      const asked = new Set([marco.dialogues[0].id])
      const result = getAskedDialogues(marco, asked)
      expect(result.length).toBe(1)
      expect(result[0].id).toBe(marco.dialogues[0].id)
    })

    it('returns empty when none asked', () => {
      const result = getAskedDialogues(marco, new Set())
      expect(result.length).toBe(0)
    })
  })

  describe('getEmotionalStateLabel', () => {
    it('returns spanish label for each state', () => {
      expect(getEmotionalStateLabel('calm')).toBe('Tranquilo/a')
      expect(getEmotionalStateLabel('nervous')).toBe('Nervioso/a')
      expect(getEmotionalStateLabel('angry')).toBe('Enojado/a')
      expect(getEmotionalStateLabel('sad')).toBe('Triste')
      expect(getEmotionalStateLabel('evasive')).toBe('Evasivo/a')
    })
  })

  describe('getEmotionalStateColor', () => {
    it('returns a hex color for each state', () => {
      const states = ['calm', 'nervous', 'angry', 'sad', 'evasive'] as const
      for (const state of states) {
        expect(getEmotionalStateColor(state)).toMatch(/^#[0-9a-f]{6}$/i)
      }
    })

    it('angry and calm have different colors', () => {
      expect(getEmotionalStateColor('angry')).not.toBe(getEmotionalStateColor('calm'))
    })
  })

  describe('getEmotionalStateIcon', () => {
    it('returns an emoji for each state', () => {
      const states = ['calm', 'nervous', 'angry', 'sad', 'evasive'] as const
      for (const state of states) {
        const icon = getEmotionalStateIcon(state)
        expect(typeof icon).toBe('string')
        expect(icon.length).toBeGreaterThan(0)
      }
    })
  })

  describe('isSuspectFullyInterviewed', () => {
    it('returns false when not all dialogues asked', () => {
      const partial = new Set([marco.dialogues[0].id])
      expect(isSuspectFullyInterviewed(marco, partial)).toBe(false)
    })

    it('returns true when all dialogues asked', () => {
      const all = new Set(marco.dialogues.map((d) => d.id))
      expect(isSuspectFullyInterviewed(marco, all)).toBe(true)
    })

    it('returns false when empty', () => {
      expect(isSuspectFullyInterviewed(valentina, new Set())).toBe(false)
    })
  })

  describe('getSuspectSuspicionLevel', () => {
    it('returns 0 when no questions asked', () => {
      expect(getSuspectSuspicionLevel(marco, new Set())).toBe(0)
    })

    it('returns a number between 0 and 100', () => {
      const ids = new Set(marco.dialogues.map((d) => d.id))
      const level = getSuspectSuspicionLevel(marco, ids)
      expect(level).toBeGreaterThanOrEqual(0)
      expect(level).toBeLessThanOrEqual(100)
    })

    it('guilty suspect has higher suspicion than innocent when fully questioned', () => {
      const marcoIds = new Set(marco.dialogues.map((d) => d.id))
      const valIds = new Set(valentina.dialogues.map((d) => d.id))
      const marcoLevel = getSuspectSuspicionLevel(marco, marcoIds)
      const valLevel = getSuspectSuspicionLevel(valentina, valIds)
      expect(marcoLevel).toBeGreaterThan(valLevel)
    })
  })
})
