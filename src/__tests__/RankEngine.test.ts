import { describe, it, expect } from 'vitest'
import { getDetectiveRank } from '../engine/RankEngine'
import type { PlayerStats } from '../types'

function stats(overrides: Partial<PlayerStats>): PlayerStats {
  return {
    casesCompleted: 0,
    correctAccusations: 0,
    totalEvidenceFound: 0,
    flawlessCases: 0,
    ...overrides,
  }
}

describe('getDetectiveRank', () => {
  it('is Novato with zero cases completed', () => {
    expect(getDetectiveRank(stats({}))).toBe('Novato')
  })

  it('is Investigador after at least one case with low accuracy', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 1, correctAccusations: 0 }))).toBe('Investigador')
    expect(getDetectiveRank(stats({ casesCompleted: 2, correctAccusations: 1 }))).toBe('Investigador')
  })

  it('is Detective at 3+ cases with at least 50% accuracy', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 3, correctAccusations: 2 }))).toBe('Detective')
    expect(getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 2 }))).toBe('Detective')
  })

  it('is not yet Detective at 3+ cases with under 50% accuracy', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 3, correctAccusations: 1 }))).toBe('Investigador')
  })

  it('is Detective Senior at 5+ cases with at least 75% accuracy', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 5, correctAccusations: 4 }))).toBe('Detective Senior')
  })

  it('is not yet Detective Senior at 5+ cases with under 75% accuracy', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 5, correctAccusations: 3 }))).toBe('Detective')
  })

  it('is Mente Maestra at 100% accuracy with at least one flawless case', () => {
    expect(
      getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 4, flawlessCases: 1 }))
    ).toBe('Mente Maestra')
  })

  it('is not Mente Maestra at 100% accuracy without any flawless case', () => {
    expect(
      getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 4, flawlessCases: 0 }))
    ).not.toBe('Mente Maestra')
  })

  it('treats a missing flawlessCases field as zero (backward compatibility)', () => {
    const legacyStats: PlayerStats = { casesCompleted: 4, correctAccusations: 4, totalEvidenceFound: 10 }
    expect(getDetectiveRank(legacyStats)).not.toBe('Mente Maestra')
  })
})
