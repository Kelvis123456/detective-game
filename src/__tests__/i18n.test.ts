import { describe, it, expect } from 'vitest'
import { ALL_CASES_ES, ALL_CASES_EN, getCaseById, getCasesForLocale } from '../data'

/**
 * The English case files are hand-maintained siblings of the Spanish
 * originals, not derived at build time -- so nothing stops an edit to one
 * from drifting out of sync with the other. Every field the engine actually
 * reads by id (revealedEvidenceIds, hotspot evidenceId/deviceId, tension
 * lock targets, correctConnections, solution.proof, ...) has to match
 * byte-for-byte between locales, or the English game breaks silently
 * (evidence that never appears, a lock that never fires, a wrong verdict).
 * This suite is the safety net for that, checked structurally rather than
 * by reading the prose.
 */

function ids<T extends { id: string }>(arr: T[]): string[] {
  return [...arr.map((x) => x.id)].sort()
}

describe('English translation structural parity', () => {
  it('has the same number of cases in both locales', () => {
    expect(ALL_CASES_EN.length).toBe(ALL_CASES_ES.length)
    expect(ALL_CASES_EN.length).toBe(4)
  })

  it('getCasesForLocale returns the right set', () => {
    expect(getCasesForLocale('es')).toBe(ALL_CASES_ES)
    expect(getCasesForLocale('en')).toBe(ALL_CASES_EN)
  })

  it('getCaseById respects the locale param and defaults to Spanish', () => {
    const esCase = getCaseById('case-001')
    const enCase = getCaseById('case-001', 'en')
    expect(esCase?.id).toBe('case-001')
    expect(enCase?.id).toBe('case-001')
    expect(enCase?.title).not.toBe(esCase?.title)
  })

  describe.each(ALL_CASES_ES.map((es, i) => [es.title, es, ALL_CASES_EN[i]] as const))(
    'Case: %s',
    (_title, es, en) => {
      it('shares the same id and non-translatable identifier fields', () => {
        expect(en.id).toBe(es.id)
        expect(en.difficulty).toBe(es.difficulty)
        expect(en.thumbnail).toBe(es.thumbnail)
        expect(en.color).toBe(es.color)
      })

      it('has the same suspects, in the same order, with matching isGuilty/age', () => {
        expect(en.suspects.map((s) => s.id)).toEqual(es.suspects.map((s) => s.id))
        es.suspects.forEach((s, i) => {
          expect(en.suspects[i].isGuilty).toBe(s.isGuilty)
          expect(en.suspects[i].age).toBe(s.age)
          expect(en.suspects[i].avatar).toBe(s.avatar)
        })
      })

      it('keeps suspect proper names unchanged', () => {
        expect(en.suspects.map((s) => s.name)).toEqual(es.suspects.map((s) => s.name))
      })

      it('has matching dialogue ids/emotionalState/revealedEvidenceIds per suspect', () => {
        es.suspects.forEach((esSuspect, i) => {
          const enSuspect = en.suspects[i]
          expect(enSuspect.dialogues.map((d) => d.id)).toEqual(esSuspect.dialogues.map((d) => d.id))
          esSuspect.dialogues.forEach((esD, j) => {
            const enD = enSuspect.dialogues[j]
            expect(enD.emotionalState).toBe(esD.emotionalState)
            expect(enD.revealedEvidenceIds).toEqual(esD.revealedEvidenceIds)
          })
        })
      })

      it('has the same evidence ids with matching type/icon/isKey/digitalSourceId', () => {
        expect(ids(en.evidence)).toEqual(ids(es.evidence))
        es.evidence.forEach((esE) => {
          const enE = en.evidence.find((e) => e.id === esE.id)
          expect(enE).toBeDefined()
          expect(enE!.type).toBe(esE.type)
          expect(enE!.icon).toBe(esE.icon)
          expect(enE!.isKey).toBe(esE.isKey)
          expect(enE!.digitalSourceId).toBe(esE.digitalSourceId)
        })
      })

      it('has the same hotspots with matching coordinates and refs', () => {
        expect(ids(en.hotspots)).toEqual(ids(es.hotspots))
        es.hotspots.forEach((esH) => {
          const enH = en.hotspots.find((h) => h.id === esH.id)
          expect(enH).toBeDefined()
          expect(enH!.x).toBe(esH.x)
          expect(enH!.y).toBe(esH.y)
          expect(enH!.evidenceId).toBe(esH.evidenceId)
          expect(enH!.deviceId ?? null).toBe(esH.deviceId ?? null)
          expect(enH!.icon).toBe(esH.icon)
        })
      })

      it('has matching digital devices, threads, messages and notes', () => {
        const esDevices = es.digitalDevices ?? []
        const enDevices = en.digitalDevices ?? []
        expect(ids(enDevices)).toEqual(ids(esDevices))

        esDevices.forEach((esDev) => {
          const enDev = enDevices.find((d) => d.id === esDev.id)
          expect(enDev).toBeDefined()
          expect(enDev!.lockType).toBe(esDev.lockType)
          expect(enDev!.unlockCode).toBe(esDev.unlockCode)
          expect(enDev!.apps).toEqual(esDev.apps)

          expect(ids(enDev!.threads)).toEqual(ids(esDev.threads))
          esDev.threads.forEach((esT) => {
            const enT = enDev!.threads.find((t) => t.id === esT.id)
            expect(enT).toBeDefined()
            expect(enT!.appId).toBe(esT.appId)
            expect(enT!.isDeleted ?? false).toBe(esT.isDeleted ?? false)
            expect(ids(enT!.messages)).toEqual(ids(esT.messages))
            expect(enT!.participants.length).toBe(esT.participants.length)
            esT.messages.forEach((esM) => {
              const enM = enT!.messages.find((m) => m.id === esM.id)
              expect(enM).toBeDefined()
              expect(enM!.evidenceId).toBe(esM.evidenceId)
            })
          })

          expect(ids(enDev!.notes)).toEqual(ids(esDev.notes))
          esDev.notes.forEach((esN) => {
            const enN = enDev!.notes.find((n) => n.id === esN.id)
            expect(enN).toBeDefined()
            expect(enN!.appId).toBe(esN.appId)
            expect(enN!.isDeleted ?? false).toBe(esN.isDeleted ?? false)
            expect(enN!.evidenceId).toBe(esN.evidenceId)
          })
        })
      })

      it('has matching tensionEvents with the same trigger counts and lock targets', () => {
        const esEvents = es.tensionEvents ?? []
        const enEvents = en.tensionEvents ?? []
        expect(ids(enEvents)).toEqual(ids(esEvents))
        esEvents.forEach((esEv) => {
          const enEv = enEvents.find((e) => e.id === esEv.id)
          expect(enEv).toBeDefined()
          expect(enEv!.triggerActionCount).toBe(esEv.triggerActionCount)
          expect([...(enEv!.effect?.lockThreadIds ?? [])].sort()).toEqual(
            [...(esEv.effect?.lockThreadIds ?? [])].sort()
          )
          expect([...(enEv!.effect?.lockNoteIds ?? [])].sort()).toEqual(
            [...(esEv.effect?.lockNoteIds ?? [])].sort()
          )
        })
      })

      it('has the same correctConnections pairs', () => {
        const esConns = (es.correctConnections ?? []).map((c) => `${c.fromId}->${c.toId}`).sort()
        const enConns = (en.correctConnections ?? []).map((c) => `${c.fromId}->${c.toId}`).sort()
        expect(enConns).toEqual(esConns)
      })

      it('has the same solution guiltyId and proof id references', () => {
        expect(en.solution.guiltyId).toBe(es.solution.guiltyId)
        if (es.solution.proof) {
          expect(en.solution.proof).toBeDefined()
          expect([...en.solution.proof!.means].sort()).toEqual([...es.solution.proof.means].sort())
          expect([...en.solution.proof!.motive].sort()).toEqual([...es.solution.proof.motive].sort())
          expect([...en.solution.proof!.opportunity].sort()).toEqual(
            [...es.solution.proof.opportunity].sort()
          )
        } else {
          expect(en.solution.proof).toBeUndefined()
        }
      })

      it('has the same number of timeline entries', () => {
        expect(en.solution.timeline.length).toBe(es.solution.timeline.length)
      })

      it('actually translated the prose instead of copying the Spanish', () => {
        expect(en.title).not.toBe(es.title)
        expect(en.intro).not.toBe(es.intro)
        expect(en.crimeSceneDescription).not.toBe(es.crimeSceneDescription)
        expect(en.suspects[0].description).not.toBe(es.suspects[0].description)
        expect(en.solution.explanation).not.toBe(es.solution.explanation)
      })
    }
  )
})
