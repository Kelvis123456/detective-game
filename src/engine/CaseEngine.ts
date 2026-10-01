import type {
  AccusationInput,
  Case,
  CaseProgress,
  EndingType,
  ProofCategory,
  Suspect,
  TensionEvent,
  Evidence,
} from '../types'

export function createCaseProgress(caseId: string): CaseProgress {
  return {
    caseId,
    collectedEvidenceIds: new Set<string>(),
    interviewedSuspects: {},
    accusedSuspectId: null,
    solved: false,
    correct: false,
    discoveredDeviceIds: new Set<string>(),
    unlockedDeviceIds: new Set<string>(),
    readThreadIds: new Set<string>(),
    readNoteIds: new Set<string>(),
    lockedThreadIds: new Set<string>(),
    lockedNoteIds: new Set<string>(),
    actionCount: 0,
    firedTensionEventIds: new Set<string>(),
    playerConnections: [],
  }
}

export function collectEvidence(progress: CaseProgress, evidenceId: string): CaseProgress {
  const next = { ...progress, collectedEvidenceIds: new Set(progress.collectedEvidenceIds) }
  next.collectedEvidenceIds.add(evidenceId)
  return next
}

export function recordInterview(
  progress: CaseProgress,
  suspectId: string,
  dialogueId: string
): CaseProgress {
  const prev = progress.interviewedSuspects[suspectId] ?? new Set<string>()
  return {
    ...progress,
    interviewedSuspects: {
      ...progress.interviewedSuspects,
      [suspectId]: new Set([...prev, dialogueId]),
    },
  }
}

export function makeAccusation(
  progress: CaseProgress,
  case_: Case,
  suspectId: string
): CaseProgress {
  // Un caso se acusa una sola vez: un doble clic durante la animación de salida
  // de la pantalla de acusación volvía a contar el caso en las estadísticas.
  if (progress.solved) return progress
  // Solo se puede acusar a alguien del caso
  if (!case_.suspects.some((s) => s.id === suspectId)) return progress
  const correct = case_.solution.guiltyId === suspectId
  return {
    ...progress,
    accusedSuspectId: suspectId,
    solved: true,
    correct,
  }
}

export function getCollectedEvidence(progress: CaseProgress, case_: Case): Evidence[] {
  return case_.evidence.filter((e) => progress.collectedEvidenceIds.has(e.id))
}

export function getInterviewedDialogueIds(progress: CaseProgress, suspectId: string): Set<string> {
  return progress.interviewedSuspects[suspectId] ?? new Set()
}

export function getSuspectById(case_: Case, suspectId: string): Suspect | undefined {
  return case_.suspects.find((s) => s.id === suspectId)
}

export function getProgressPercent(progress: CaseProgress, case_: Case): number {
  const totalEvidence = case_.evidence.length
  const totalDialogues = case_.suspects.reduce((acc, s) => acc + s.dialogues.length, 0)
  const total = totalEvidence + totalDialogues

  const foundEvidence = progress.collectedEvidenceIds.size
  const foundDialogues = Object.values(progress.interviewedSuspects).reduce(
    (acc, set) => acc + set.size,
    0
  )
  const found = foundEvidence + foundDialogues

  return total > 0 ? Math.round((found / total) * 100) : 0
}

export function hasKeyEvidence(progress: CaseProgress, case_: Case): boolean {
  const keyEvidence = case_.evidence.filter((e) => e.isKey)
  return keyEvidence.every((e) => progress.collectedEvidenceIds.has(e.id))
}

export function getEvidenceRevealedByDialogue(case_: Case, dialogueId: string): Evidence[] {
  for (const suspect of case_.suspects) {
    for (const dialogue of suspect.dialogues) {
      if (dialogue.id === dialogueId) {
        return case_.evidence.filter((e) => dialogue.revealedEvidenceIds.includes(e.id))
      }
    }
  }
  return []
}

/* ─────────────────────────────────────────────────────────────────
 * Means/motive/opportunity deduction + multiple endings
 *
 * This is purely additive — `makeAccusation` above is untouched and keeps
 * driving `caseProgress.correct`/`solved`/`accusedSuspectId` exactly as
 * before. `evaluateAccusation` layers richer scoring on top of that,
 * without which existing tests calling `makeAccusation` directly would
 * see no behavior change.
 * ───────────────────────────────────────────────────────────────── */

export interface AccusationEvaluation {
  correct: boolean
  ending: EndingType
  proofScore: number
  proofDetail: Record<ProofCategory, boolean>
}

function isProofCategorySatisfied(
  case_: Case,
  progress: CaseProgress,
  category: ProofCategory,
  suppliedEvidenceId: string | undefined
): boolean {
  const required = case_.solution.proof?.[category]
  // No `proof` data at all, or an empty list for this category, means the
  // case hasn't been authored with that category in mind yet — it passes
  // vacuously so unmigrated/partially-migrated cases still reach
  // 'correct-full-case' rather than being stuck below it forever.
  if (!required || required.length === 0) return true
  if (!suppliedEvidenceId) return false
  // You cannot cite evidence you never actually found.
  if (!progress.collectedEvidenceIds.has(suppliedEvidenceId)) return false
  return required.includes(suppliedEvidenceId)
}

export function evaluateAccusation(
  progress: CaseProgress,
  case_: Case,
  input: AccusationInput
): AccusationEvaluation {
  const suspectCorrect = input.suspectId === case_.solution.guiltyId

  if (!suspectCorrect) {
    const ending: EndingType =
      getProgressPercent(progress, case_) < 25
        ? 'insufficient-evidence'
        : 'wrong-suspect-culprit-escapes'
    return {
      correct: false,
      ending,
      proofScore: 0,
      proofDetail: { means: false, motive: false, opportunity: false },
    }
  }

  const proofDetail: Record<ProofCategory, boolean> = {
    means: isProofCategorySatisfied(case_, progress, 'means', input.meansEvidenceId),
    motive: isProofCategorySatisfied(case_, progress, 'motive', input.motiveEvidenceId),
    opportunity: isProofCategorySatisfied(case_, progress, 'opportunity', input.opportunityEvidenceId),
  }
  const proofScore = Object.values(proofDetail).filter(Boolean).length

  return {
    correct: true,
    ending: proofScore === 3 ? 'correct-full-case' : 'correct-partial-reasoning',
    proofScore,
    proofDetail,
  }
}

/* ─────────────────────────────────────────────────────────────────
 * Narrative tension mechanic — lives as pure functions here, but is only
 * ever invoked from the store (see gameStore.ts), never from the other
 * pure engine functions above, so existing tests that call
 * collectEvidence/recordInterview/makeAccusation directly are unaffected.
 * ───────────────────────────────────────────────────────────────── */

export function incrementActionCount(progress: CaseProgress): CaseProgress {
  return { ...progress, actionCount: progress.actionCount + 1 }
}

export function checkTensionEvents(progress: CaseProgress, case_: Case): TensionEvent[] {
  const events = case_.tensionEvents ?? []
  return events.filter(
    (e) => e.triggerActionCount <= progress.actionCount && !progress.firedTensionEventIds.has(e.id)
  )
}

export function applyTensionEvent(progress: CaseProgress, event: TensionEvent): CaseProgress {
  const next: CaseProgress = {
    ...progress,
    firedTensionEventIds: new Set(progress.firedTensionEventIds).add(event.id),
  }
  if (event.effect?.lockThreadIds?.length) {
    next.lockedThreadIds = new Set(progress.lockedThreadIds)
    for (const id of event.effect.lockThreadIds) next.lockedThreadIds.add(id)
  }
  if (event.effect?.lockNoteIds?.length) {
    next.lockedNoteIds = new Set(progress.lockedNoteIds)
    for (const id of event.effect.lockNoteIds) next.lockedNoteIds.add(id)
  }
  return next
}
