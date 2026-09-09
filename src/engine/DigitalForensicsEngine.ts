import type { CaseProgress, DigitalDevice, DigitalNote, DigitalThread } from '../types'

export function isUnlockCodeCorrect(device: DigitalDevice, attempt: string): boolean {
  if (device.lockType === 'none') return true
  return attempt === device.unlockCode
}

export function getVisibleThreads(device: DigitalDevice, progress: CaseProgress): DigitalThread[] {
  return device.threads.filter((t) => !progress.lockedThreadIds.has(t.id))
}

export function getVisibleNotes(device: DigitalDevice, progress: CaseProgress): DigitalNote[] {
  return device.notes.filter((n) => !progress.lockedNoteIds.has(n.id))
}

export function getEvidenceIdsInThread(thread: DigitalThread): string[] {
  return thread.messages
    .map((m) => m.evidenceId)
    .filter((id): id is string => Boolean(id))
}

export function getEvidenceIdsInNote(note: DigitalNote): string[] {
  return note.evidenceId ? [note.evidenceId] : []
}

export function isDeviceFullyExplored(device: DigitalDevice, progress: CaseProgress): boolean {
  const visibleThreads = getVisibleThreads(device, progress)
  const visibleNotes = getVisibleNotes(device, progress)
  const threadsRead = visibleThreads.every((t) => progress.readThreadIds.has(t.id))
  const notesRead = visibleNotes.every((n) => progress.readNoteIds.has(n.id))
  return threadsRead && notesRead
}
