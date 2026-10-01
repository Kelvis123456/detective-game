import { describe, it, expect } from 'vitest'
import { portraitTraits } from '../components/ui/PortraitAvatar'
import { getCasesForLocale } from '../data'

// Los tres sospechosos del caso 1 se veían iguales: el retrato es lo único que los
// distingue de un vistazo en el tablero, la escena y la acusación.
describe('portraitTraits', () => {
  it('is deterministic for the same suspect', () => {
    expect(portraitTraits('marco-delgado')).toEqual(portraitTraits('marco-delgado'))
  })

  for (const case_ of getCasesForLocale('es')) {
    it(`gives every suspect in "${case_.id}" a different face`, () => {
      const faces = case_.suspects.map((s) => {
        const t = portraitTraits(s.id)
        // misma piel + pelo + ropa se lee como la misma persona a 28-52px
        return `${t.skin}|${t.hairColor}|${t.hairStyle}|${t.clothing}`
      })
      expect(new Set(faces).size).toBe(faces.length)
    })

    it(`does not repeat the same skin and hairstyle pair in "${case_.id}"`, () => {
      const looks = case_.suspects.map((s) => {
        const t = portraitTraits(s.id)
        return `${t.skin}|${t.hairStyle}`
      })
      expect(new Set(looks).size).toBe(looks.length)
    })
  }
})
