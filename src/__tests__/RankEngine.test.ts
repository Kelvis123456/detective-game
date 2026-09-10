import { describe, it, expect } from 'vitest'
import { getDetectiveRank } from '../engine/RankEngine'
import type { DetectiveRank, PlayerStats } from '../types'

function stats(overrides: Partial<PlayerStats>): PlayerStats {
  return {
    casesCompleted: 0,
    correctAccusations: 0,
    totalEvidenceFound: 0,
    flawlessCases: 0,
    ...overrides,
  }
}

// Rank thresholds moved from a live accuracy ratio (correctAccusations /
// casesCompleted) to raw counts. A ratio can drop as casesCompleted grows
// even though nothing the player did got worse — a visual-audit pass found
// this let a single flawless first case reach 'Mente Maestra' (the top
// rank) immediately, then demote to 'Detective' after one later miss. Raw
// counts only ever go up within a session, so rank can only hold or climb.
const RANK_ORDER: DetectiveRank[] = ['Novato', 'Investigador', 'Detective', 'Detective Senior', 'Mente Maestra']

describe('getDetectiveRank', () => {
  it('is Novato with zero cases completed', () => {
    expect(getDetectiveRank(stats({}))).toBe('Novato')
  })

  it('is Investigador after at least one case, regardless of accuracy', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 1, correctAccusations: 0 }))).toBe('Investigador')
    expect(getDetectiveRank(stats({ casesCompleted: 2, correctAccusations: 1 }))).toBe('Investigador')
  })

  it('is Detective at 3+ cases completed with at least 2 correct', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 3, correctAccusations: 2 }))).toBe('Detective')
    expect(getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 2 }))).toBe('Detective')
  })

  it('is not yet Detective at 3+ cases with fewer than 2 correct', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 3, correctAccusations: 1 }))).toBe('Investigador')
  })

  it('is Detective Senior at 4+ cases completed with at least 3 correct', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 3 }))).toBe('Detective Senior')
    expect(getDetectiveRank(stats({ casesCompleted: 6, correctAccusations: 5 }))).toBe('Detective Senior')
  })

  it('is not yet Detective Senior at 4+ cases with fewer than 3 correct', () => {
    expect(getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 2 }))).toBe('Detective')
  })

  it('is Mente Maestra once 3 cases have been solved flawlessly, regardless of overall accuracy', () => {
    expect(
      getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 3, flawlessCases: 3 }))
    ).toBe('Mente Maestra')
  })

  it('is not Mente Maestra with fewer than 3 flawless cases, even at perfect accuracy', () => {
    expect(
      getDetectiveRank(stats({ casesCompleted: 1, correctAccusations: 1, flawlessCases: 1 }))
    ).not.toBe('Mente Maestra')
    expect(
      getDetectiveRank(stats({ casesCompleted: 4, correctAccusations: 4, flawlessCases: 2 }))
    ).not.toBe('Mente Maestra')
  })

  it('treats a missing flawlessCases field as zero (backward compatibility)', () => {
    const legacyStats: PlayerStats = { casesCompleted: 4, correctAccusations: 4, totalEvidenceFound: 10 }
    expect(getDetectiveRank(legacyStats)).not.toBe('Mente Maestra')
  })

  it('never demotes: rank position never decreases as a session\'s stats only accumulate', () => {
    // The exact regression scenario found in review: nail case001 flawlessly
    // first (which used to jump straight to the top rank), then miss case002.
    const afterFlawlessFirstCase = stats({ casesCompleted: 1, correctAccusations: 1, flawlessCases: 1 })
    const afterAMiss = stats({ casesCompleted: 2, correctAccusations: 1, flawlessCases: 1 })
    const rank1 = RANK_ORDER.indexOf(getDetectiveRank(afterFlawlessFirstCase))
    const rank2 = RANK_ORDER.indexOf(getDetectiveRank(afterAMiss))
    expect(rank2).toBeGreaterThanOrEqual(rank1)
  })

  it('never demotes across a realistic full 4-case playthrough, case by case', () => {
    const progression = [
      stats({ casesCompleted: 1, correctAccusations: 1, flawlessCases: 1 }),
      stats({ casesCompleted: 2, correctAccusations: 1, flawlessCases: 1 }),
      stats({ casesCompleted: 3, correctAccusations: 2, flawlessCases: 2 }),
      stats({ casesCompleted: 4, correctAccusations: 3, flawlessCases: 3 }),
    ]
    const ranks = progression.map((s) => RANK_ORDER.indexOf(getDetectiveRank(s)))
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1])
    }
    expect(getDetectiveRank(progression[progression.length - 1])).toBe('Mente Maestra')
  })
})
