import case001 from './cases/case001'
import case002 from './cases/case002'
import case003 from './cases/case003'
import case004 from './cases/case004'
import case001En from './cases/case001.en'
import case002En from './cases/case002.en'
import case003En from './cases/case003.en'
import case004En from './cases/case004.en'
import type { Case, Locale } from '../types'

export const ALL_CASES_ES: Case[] = [case001, case002, case003, case004]
export const ALL_CASES_EN: Case[] = [case001En, case002En, case003En, case004En]

/** Spanish is the canonical/default set — existing code and tests that don't
 *  care about locale keep working against it unchanged. */
export const ALL_CASES: Case[] = ALL_CASES_ES

export function getCasesForLocale(locale: Locale): Case[] {
  return locale === 'en' ? ALL_CASES_EN : ALL_CASES_ES
}

export function getCaseById(id: string, locale: Locale = 'es'): Case | undefined {
  return getCasesForLocale(locale).find((c) => c.id === id)
}

export { case001, case002, case003, case004 }
