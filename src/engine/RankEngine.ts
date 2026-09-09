import type { DetectiveRank, PlayerStats } from '../types'

/**
 * Detective rank derived purely from lifetime stats. Thresholds are a v1
 * heuristic, intentionally simple and tunable later without touching the
 * call sites (MainMenu/CaseSelection just render whatever this returns).
 */
export function getDetectiveRank(stats: PlayerStats): DetectiveRank {
  const { casesCompleted, correctAccusations, flawlessCases = 0 } = stats
  const accuracy = casesCompleted > 0 ? correctAccusations / casesCompleted : 0

  if (casesCompleted === 0) return 'Novato'
  if (accuracy === 1 && flawlessCases >= 1) return 'Mente Maestra'
  if (casesCompleted >= 5 && accuracy >= 0.75) return 'Detective Senior'
  if (casesCompleted >= 3 && accuracy >= 0.5) return 'Detective'
  return 'Investigador'
}
