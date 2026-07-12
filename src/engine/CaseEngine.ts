import type { Case, CaseProgress, Suspect, Evidence } from '../types'

export function createCaseProgress(caseId: string): CaseProgress {
  return {
    caseId,
    collectedEvidenceIds: new Set<string>(),
    interviewedSuspects: {},
    accusedSuspectId: null,
    solved: false,
    correct: false,
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
