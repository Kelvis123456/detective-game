import case001 from './cases/case001'
import case002 from './cases/case002'
import case003 from './cases/case003'
import case004 from './cases/case004'
import type { Case } from '../types'

export const ALL_CASES: Case[] = [case001, case002, case003, case004]

export function getCaseById(id: string): Case | undefined {
  return ALL_CASES.find((c) => c.id === id)
}

export { case001, case002, case003, case004 }
