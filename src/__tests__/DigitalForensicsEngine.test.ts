import { describe, it, expect } from 'vitest'
import {
  isUnlockCodeCorrect,
  getVisibleThreads,
  getVisibleNotes,
  getEvidenceIdsInThread,
  getEvidenceIdsInNote,
  isDeviceFullyExplored,
} from '../engine/DigitalForensicsEngine'
import { createCaseProgress } from '../engine/CaseEngine'
import type { DigitalDevice, DigitalNote, DigitalThread } from '../types'
import case001 from '../data/cases/case001'

const device = case001.digitalDevices?.[0] as DigitalDevice

describe('DigitalForensicsEngine', () => {
  describe('isUnlockCodeCorrect', () => {
    it('accepts the correct PIN', () => {
      expect(isUnlockCodeCorrect(device, device.unlockCode!)).toBe(true)
    })

    it('rejects a wrong PIN', () => {
      expect(isUnlockCodeCorrect(device, '0000')).toBe(false)
    })

    it('always unlocks a lockType "none" device regardless of the attempt', () => {
      const openDevice: DigitalDevice = { ...device, lockType: 'none' }
      expect(isUnlockCodeCorrect(openDevice, 'whatever')).toBe(true)
      expect(isUnlockCodeCorrect(openDevice, '')).toBe(true)
    })
  })

  describe('getVisibleThreads / getVisibleNotes', () => {
    it('returns all threads/notes when nothing is locked', () => {
      const progress = createCaseProgress(case001.id)
      expect(getVisibleThreads(device, progress)).toHaveLength(device.threads.length)
      expect(getVisibleNotes(device, progress)).toHaveLength(device.notes.length)
    })

    it('filters out threads/notes present in lockedThreadIds/lockedNoteIds', () => {
      const progress = createCaseProgress(case001.id)
      const someThreadId = device.threads[0].id
      const someNoteId = device.notes[0].id
      progress.lockedThreadIds.add(someThreadId)
      progress.lockedNoteIds.add(someNoteId)

      expect(getVisibleThreads(device, progress).find((t) => t.id === someThreadId)).toBeUndefined()
      expect(getVisibleNotes(device, progress).find((n) => n.id === someNoteId)).toBeUndefined()
    })
  })

  describe('getEvidenceIdsInThread / getEvidenceIdsInNote', () => {
    it('collects only the message evidenceIds that are actually set', () => {
      const thread: DigitalThread = {
        id: 't1',
        appId: 'chatvia',
        title: 'Test',
        participants: ['A', 'B'],
        messages: [
          { id: 'm1', sender: 'A', timestamp: 'now', text: 'hi' },
          { id: 'm2', sender: 'B', timestamp: 'now', text: 'hey', evidenceId: 'ev-1' },
          { id: 'm3', sender: 'A', timestamp: 'now', text: 'bye', evidenceId: 'ev-2' },
        ],
      }
      expect(getEvidenceIdsInThread(thread)).toEqual(['ev-1', 'ev-2'])
    })

    it('returns an empty array for a note with no evidenceId', () => {
      const note: DigitalNote = { id: 'n1', appId: 'anotta', title: 'x', body: 'y' }
      expect(getEvidenceIdsInNote(note)).toEqual([])
    })

    it('returns the single evidenceId for a note that has one', () => {
      const note: DigitalNote = { id: 'n1', appId: 'anotta', title: 'x', body: 'y', evidenceId: 'ev-3' }
      expect(getEvidenceIdsInNote(note)).toEqual(['ev-3'])
    })
  })

  describe('isDeviceFullyExplored', () => {
    it('is false when nothing has been read yet', () => {
      const progress = createCaseProgress(case001.id)
      expect(isDeviceFullyExplored(device, progress)).toBe(false)
    })

    it('is true once every visible thread and note has been read', () => {
      const progress = createCaseProgress(case001.id)
      for (const t of device.threads) progress.readThreadIds.add(t.id)
      for (const n of device.notes) progress.readNoteIds.add(n.id)
      expect(isDeviceFullyExplored(device, progress)).toBe(true)
    })

    it('ignores locked threads/notes when deciding full exploration', () => {
      const progress = createCaseProgress(case001.id)
      // Lock everything without reading anything — should count as fully explored
      // since a locked item is no longer something the player can read.
      for (const t of device.threads) progress.lockedThreadIds.add(t.id)
      for (const n of device.notes) progress.lockedNoteIds.add(n.id)
      expect(isDeviceFullyExplored(device, progress)).toBe(true)
    })
  })
})
