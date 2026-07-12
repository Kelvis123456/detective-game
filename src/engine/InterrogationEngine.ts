import type { Suspect, Dialogue, EmotionalState } from '../types'

export function getAvailableDialogues(
  suspect: Suspect,
  askedIds: Set<string>
): Dialogue[] {
  return suspect.dialogues.filter((d) => !askedIds.has(d.id))
}

export function getAskedDialogues(
  suspect: Suspect,
  askedIds: Set<string>
): Dialogue[] {
  return suspect.dialogues.filter((d) => askedIds.has(d.id))
}

export function getEmotionalStateLabel(state: EmotionalState): string {
  const labels: Record<EmotionalState, string> = {
    calm: 'Tranquilo/a',
    nervous: 'Nervioso/a',
    angry: 'Enojado/a',
    sad: 'Triste',
    evasive: 'Evasivo/a',
  }
  return labels[state]
}

export function getEmotionalStateColor(state: EmotionalState): string {
  const colors: Record<EmotionalState, string> = {
    calm: '#4a9eff',
    nervous: '#f0a830',
    angry: '#e05555',
    sad: '#8080c0',
    evasive: '#80a860',
  }
  return colors[state]
}

export function getEmotionalStateIcon(state: EmotionalState): string {
  const icons: Record<EmotionalState, string> = {
    calm: '😐',
    nervous: '😰',
    angry: '😡',
    sad: '😢',
    evasive: '🙄',
  }
  return icons[state]
}

export function isSuspectFullyInterviewed(
  suspect: Suspect,
  askedIds: Set<string>
): boolean {
  return suspect.dialogues.every((d) => askedIds.has(d.id))
}

export function getSuspectSuspicionLevel(
  suspect: Suspect,
  askedIds: Set<string>
): number {
  const angryOrEvasiveAnswers = getAskedDialogues(suspect, askedIds).filter(
    (d) => d.emotionalState === 'angry' || d.emotionalState === 'evasive'
  ).length
  const total = Math.max(askedIds.size, 1)
  return Math.round((angryOrEvasiveAnswers / total) * 100)
}
