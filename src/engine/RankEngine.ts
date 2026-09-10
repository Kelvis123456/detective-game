import type { DetectiveRank, PlayerStats } from '../types'

/**
 * Detective rank derived purely from lifetime stats.
 *
 * Every threshold below compares raw, monotonically non-decreasing counters
 * (casesCompleted/correctAccusations/flawlessCases only ever go up within a
 * session) instead of a live accuracy ratio — a ratio can drop as the
 * denominator grows even though nothing about the player's play got worse,
 * which let an early lucky case put someone at the top rank and then demote
 * them after a single miss. Comparing counts keeps rank monotonic: it can
 * only hold steady or increase as more cases are played.
 */
export function getDetectiveRank(stats: PlayerStats): DetectiveRank {
  const { casesCompleted, correctAccusations, flawlessCases = 0 } = stats

  if (flawlessCases >= 3) return 'Mente Maestra'
  if (casesCompleted >= 4 && correctAccusations >= 3) return 'Detective Senior'
  if (casesCompleted >= 3 && correctAccusations >= 2) return 'Detective'
  if (casesCompleted >= 1) return 'Investigador'
  return 'Novato'
}
