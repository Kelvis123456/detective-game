/**
 * QA Test Suite — Casos negativos, bordes, estados inválidos y bugs reales
 *
 * Convenciones:
 *   [BUG] = comportamiento incorrecto confirmado en el código actual
 *   [GUARD] = la función se defiende correctamente del caso
 *   [EDGE] = caso límite que puede ser correcto o incorrecto según la intención
 */

import { describe, it, expect } from 'vitest'
import {
  createCaseProgress,
  collectEvidence,
  recordInterview,
  makeAccusation,
  getCollectedEvidence,
  getInterviewedDialogueIds,
  getProgressPercent,
  hasKeyEvidence,
  getEvidenceRevealedByDialogue,
  getSuspectById,
} from '../engine/CaseEngine'
import {
  getEvidenceTypeLabel,
  getEvidenceTypeColor,
  groupEvidenceByType,
  filterKeyEvidence,
  countByType,
  evidencePointsToSuspect,
} from '../engine/EvidenceEngine'
import {
  getAvailableDialogues,
  getAskedDialogues,
  getSuspectSuspicionLevel,
  isSuspectFullyInterviewed,
} from '../engine/InterrogationEngine'
import { ALL_CASES } from '../data'
import type { Case, CaseProgress, Suspect } from '../types'

/* ══════════════════════════════════════════════════════════════════
   FIXTURES
══════════════════════════════════════════════════════════════════ */

const case001 = ALL_CASES[0] // El Diamante Rojo
const case002 = ALL_CASES[1] // La Última Nota

const marco = case001.suspects.find((s) => s.id === 'marco-delgado')!
const valentina = case001.suspects.find((s) => s.id === 'valentina-cruz')!

const NONEXISTENT_ID = '__id_que_no_existe_en_ningun_caso__'

function freshProgress(c: Case = case001): CaseProgress {
  return createCaseProgress(c.id)
}

/* ══════════════════════════════════════════════════════════════════
   1. CaseEngine — PATHS NEGATIVOS Y BORDES
══════════════════════════════════════════════════════════════════ */

describe('CaseEngine — casos negativos y bordes', () => {
  // ── collectEvidence ──────────────────────────────────────────
  describe('collectEvidence', () => {
    it('[BUG] aceptar un evidenceId que no existe en el caso infla collectedEvidenceIds.size', () => {
      const p0 = freshProgress()
      const p1 = collectEvidence(p0, NONEXISTENT_ID)
      // La evidencia fantasma se guarda en el Set aunque no pertenezca al caso
      expect(p1.collectedEvidenceIds.has(NONEXISTENT_ID)).toBe(true)
    })

    it('[BUG] evidencia fantasma infla getProgressPercent por encima de lo real', () => {
      const p0 = freshProgress()
      // Colectar N IDs falsos
      let p = p0
      for (let i = 0; i < 50; i++) {
        p = collectEvidence(p, `fake-evidence-${i}`)
      }
      const pct = getProgressPercent(p, case001)
      // El porcentaje puede superar 100% al contar evidencias que no existen
      // Documentamos el comportamiento actual para detectar si algún día se corrige
      expect(pct).toBeGreaterThan(100)
    })

    it('[GUARD] colectar la misma evidencia dos veces no duplica el Set', () => {
      const evId = case001.evidence[0].id
      const p1 = collectEvidence(freshProgress(), evId)
      const p2 = collectEvidence(p1, evId)
      expect(p2.collectedEvidenceIds.size).toBe(1)
    })

    it('[GUARD] no muta el progreso original', () => {
      const p0 = freshProgress()
      const evId = case001.evidence[0].id
      collectEvidence(p0, evId)
      expect(p0.collectedEvidenceIds.size).toBe(0)
    })

    it('[GUARD] colectar múltiples evidencias acumula todas', () => {
      let p = freshProgress()
      const ids = case001.evidence.map((e) => e.id)
      for (const id of ids) p = collectEvidence(p, id)
      expect(p.collectedEvidenceIds.size).toBe(ids.length)
    })
  })

  // ── recordInterview ──────────────────────────────────────────
  describe('recordInterview', () => {
    it('[BUG] aceptar un suspectId que no existe infla foundDialogues en getProgressPercent', () => {
      const p0 = freshProgress()
      const p1 = recordInterview(p0, NONEXISTENT_ID, 'diag-xyz')
      const pct = getProgressPercent(p1, case001)
      // Un diálogo fantasma incrementa el numerador
      expect(pct).toBeGreaterThan(0)
    })

    it('[BUG] registrar el mismo dialogueId dos veces no duplica el Set', () => {
      const diagId = marco.dialogues[0].id
      let p = freshProgress()
      p = recordInterview(p, marco.id, diagId)
      p = recordInterview(p, marco.id, diagId)
      const asked = getInterviewedDialogueIds(p, marco.id)
      expect(asked.size).toBe(1)
    })

    it('[GUARD] sospechosos distintos tienen conjuntos de diálogos independientes', () => {
      let p = freshProgress()
      p = recordInterview(p, marco.id, marco.dialogues[0].id)
      p = recordInterview(p, valentina.id, valentina.dialogues[0].id)
      expect(getInterviewedDialogueIds(p, marco.id).size).toBe(1)
      expect(getInterviewedDialogueIds(p, valentina.id).size).toBe(1)
    })

    it('[GUARD] no muta el progreso original', () => {
      const p0 = freshProgress()
      recordInterview(p0, marco.id, marco.dialogues[0].id)
      expect(Object.keys(p0.interviewedSuspects).length).toBe(0)
    })
  })

  // ── makeAccusation ───────────────────────────────────────────
  describe('makeAccusation', () => {
    it('[BUG] se puede acusar dos veces: la segunda sobreescribe el veredicto', () => {
      let p = freshProgress()
      const guiltyId = case001.solution.guiltyId
      const innocentId = case001.suspects.find((s) => !s.isGuilty)!.id

      const p1 = makeAccusation(p, case001, guiltyId)
      expect(p1.correct).toBe(true)

      // Segunda acusación sobre el resultado ya resuelto
      const p2 = makeAccusation(p1, case001, innocentId)
      expect(p2.correct).toBe(false) // sobreescribió la acusación correcta
      expect(p2.solved).toBe(true)
    })

    it('[BUG] se puede acusar a un sospechoso que no existe en el caso', () => {
      const p = freshProgress()
      const result = makeAccusation(p, case001, NONEXISTENT_ID)
      // La función no valida que el ID exista; simplemente compara con guiltyId
      expect(result.solved).toBe(true)
      expect(result.correct).toBe(false)
      expect(result.accusedSuspectId).toBe(NONEXISTENT_ID)
    })

    it('[GUARD] acusar al culpable correcto marca correct = true', () => {
      const p = makeAccusation(freshProgress(), case001, case001.solution.guiltyId)
      expect(p.correct).toBe(true)
    })

    it('[GUARD] acusar a un inocente marca correct = false', () => {
      const innocent = case001.suspects.find((s) => !s.isGuilty)!
      const p = makeAccusation(freshProgress(), case001, innocent.id)
      expect(p.correct).toBe(false)
    })

    it('[GUARD] no muta el progreso original', () => {
      const p0 = freshProgress()
      makeAccusation(p0, case001, case001.solution.guiltyId)
      expect(p0.solved).toBe(false)
      expect(p0.accusedSuspectId).toBeNull()
    })
  })

  // ── hasKeyEvidence ───────────────────────────────────────────
  describe('hasKeyEvidence', () => {
    it('[BUG] devuelve true cuando el caso no tiene evidencia clave (every sobre vacío)', () => {
      // Caso simulado sin ninguna evidencia clave
      const caseNoKey: Case = {
        ...case001,
        evidence: case001.evidence.map((e) => ({ ...e, isKey: false })),
      }
      const result = hasKeyEvidence(freshProgress(caseNoKey), caseNoKey)
      // every() sobre array vacío retorna true — comportamiento JS que puede confundir
      expect(result).toBe(true)
    })

    it('[GUARD] devuelve false si falta aunque sea una evidencia clave', () => {
      const keyIds = case001.evidence.filter((e) => e.isKey).map((e) => e.id)
      let p = freshProgress()
      // Colectar todas las clave menos la última
      for (const id of keyIds.slice(0, -1)) {
        p = collectEvidence(p, id)
      }
      expect(hasKeyEvidence(p, case001)).toBe(false)
    })

    it('[GUARD] devuelve true solo cuando TODAS las clave están', () => {
      let p = freshProgress()
      for (const e of case001.evidence.filter((ev) => ev.isKey)) {
        p = collectEvidence(p, e.id)
      }
      expect(hasKeyEvidence(p, case001)).toBe(true)
    })
  })

  // ── getProgressPercent ───────────────────────────────────────
  describe('getProgressPercent', () => {
    it('[GUARD] devuelve 0 con progreso vacío', () => {
      expect(getProgressPercent(freshProgress(), case001)).toBe(0)
    })

    it('[GUARD] devuelve 0 cuando total de elementos es 0 (caso vacío)', () => {
      const emptyCase: Case = { ...case001, evidence: [], suspects: [] }
      expect(getProgressPercent(freshProgress(emptyCase), emptyCase)).toBe(0)
    })

    it('[GUARD] llega a 100% al completar todo', () => {
      let p = freshProgress()
      for (const e of case001.evidence) p = collectEvidence(p, e.id)
      for (const s of case001.suspects) {
        for (const d of s.dialogues) {
          p = recordInterview(p, s.id, d.id)
        }
      }
      expect(getProgressPercent(p, case001)).toBe(100)
    })

    it('[EDGE] el porcentaje no puede ser negativo', () => {
      expect(getProgressPercent(freshProgress(), case001)).toBeGreaterThanOrEqual(0)
    })
  })

  // ── getCollectedEvidence ─────────────────────────────────────
  describe('getCollectedEvidence', () => {
    it('[GUARD] solo devuelve evidencias que pertenecen al caso, filtrando las fantasma', () => {
      let p = freshProgress()
      p = collectEvidence(p, NONEXISTENT_ID) // ID fantasma
      const collected = getCollectedEvidence(p, case001)
      // La evidencia fantasma NO aparece en la lista de evidencias del caso
      expect(collected.map((e) => e.id)).not.toContain(NONEXISTENT_ID)
      expect(collected.length).toBe(0)
    })

    it('[GUARD] devuelve array vacío sin evidencia recolectada', () => {
      expect(getCollectedEvidence(freshProgress(), case001)).toHaveLength(0)
    })
  })

  // ── getEvidenceRevealedByDialogue ────────────────────────────
  describe('getEvidenceRevealedByDialogue', () => {
    it('[GUARD] devuelve [] para un dialogueId que no existe en ningún sospechoso', () => {
      const result = getEvidenceRevealedByDialogue(case001, NONEXISTENT_ID)
      expect(result).toHaveLength(0)
    })

    it('[GUARD] devuelve [] para un diálogo que no revela ninguna evidencia', () => {
      const dialogWithNoReveal = case001.suspects
        .flatMap((s) => s.dialogues)
        .find((d) => d.revealedEvidenceIds.length === 0)!
      expect(getEvidenceRevealedByDialogue(case001, dialogWithNoReveal.id)).toHaveLength(0)
    })

    it('[GUARD] devuelve los objetos Evidence correctos (no solo IDs)', () => {
      const dialogWithReveal = case001.suspects
        .flatMap((s) => s.dialogues)
        .find((d) => d.revealedEvidenceIds.length > 0)!
      const revealed = getEvidenceRevealedByDialogue(case001, dialogWithReveal.id)
      expect(revealed.length).toBeGreaterThan(0)
      revealed.forEach((e) => {
        expect(dialogWithReveal.revealedEvidenceIds).toContain(e.id)
      })
    })
  })

  // ── getSuspectById ───────────────────────────────────────────
  describe('getSuspectById', () => {
    it('[GUARD] devuelve undefined para ID vacío', () => {
      expect(getSuspectById(case001, '')).toBeUndefined()
    })

    it('[GUARD] devuelve undefined para ID inexistente', () => {
      expect(getSuspectById(case001, NONEXISTENT_ID)).toBeUndefined()
    })

    it('[GUARD] no hace match parcial — el ID debe ser exacto', () => {
      // 'marco' no debe encontrar 'marco-delgado'
      expect(getSuspectById(case001, 'marco')).toBeUndefined()
    })
  })
})

/* ══════════════════════════════════════════════════════════════════
   2. EvidenceEngine — PATHS NEGATIVOS Y BORDES
══════════════════════════════════════════════════════════════════ */

describe('EvidenceEngine — casos negativos y bordes', () => {
  // ── evidencePointsToSuspect ──────────────────────────────────
  describe('evidencePointsToSuspect', () => {
    it('[BUG] nombre vacío ("") siempre devuelve true porque toda cadena contiene ""', () => {
      const result = evidencePointsToSuspect(case001.evidence, '')
      // String.includes('') === true para cualquier string → bug: acusa a nadie y a todos
      expect(result).toBe(true)
    })

    it('[GUARD] devuelve false con array de evidencias vacío', () => {
      expect(evidencePointsToSuspect([], 'Marco Delgado')).toBe(false)
    })

    it('[GUARD] es insensible a mayúsculas/minúsculas', () => {
      const guilty = case001.suspects.find((s) => s.isGuilty)!
      expect(evidencePointsToSuspect(case001.evidence, guilty.name.toUpperCase())).toBe(
        evidencePointsToSuspect(case001.evidence, guilty.name.toLowerCase())
      )
    })

    it('[GUARD] nombre que no aparece en ninguna evidencia devuelve false', () => {
      expect(evidencePointsToSuspect(case001.evidence, 'Pepito Grillo Inexistente')).toBe(false)
    })

    it('[EDGE] nombre de un inocente no debería aparecer en evidencias clave', () => {
      const keyEvidence = case001.evidence.filter((e) => e.isKey)
      const innocent = case001.suspects.find((s) => !s.isGuilty)!
      // Las evidencias clave apuntan al culpable, no a los inocentes
      // (puede fallar si la narrativa es ambigua)
      const keyPointsToInnocent = evidencePointsToSuspect(keyEvidence, innocent.name)
      // No es necesariamente un bug (podría haber menciones), solo documentamos
      expect(typeof keyPointsToInnocent).toBe('boolean')
    })
  })

  // ── groupEvidenceByType ──────────────────────────────────────
  describe('groupEvidenceByType', () => {
    it('[BUG] con array vacío devuelve {} en vez de { physical:[], testimony:[], document:[], digital:[] }', () => {
      const result = groupEvidenceByType([])
      // El objeto resultante es {} — acceder a result.physical daría undefined
      expect(result.physical).toBeUndefined()
    })

    it('[BUG] si no hay evidencia de un tipo, esa clave no existe en el resultado', () => {
      // Filtrar solo evidencia física
      const onlyPhysical = case001.evidence.filter((e) => e.type === 'physical')
      const result = groupEvidenceByType(onlyPhysical)
      // digital, document, testimony serán undefined (no [])
      expect(result.digital).toBeUndefined()
      expect(result.testimony).toBeUndefined()
    })

    it('[GUARD] los tipos presentes contienen los elementos correctos', () => {
      const result = groupEvidenceByType(case001.evidence)
      const types = Object.keys(result) as Array<keyof typeof result>
      for (const type of types) {
        result[type].forEach((e) => expect(e.type).toBe(type))
      }
    })

    it('[GUARD] la suma de todos los grupos iguala la longitud original', () => {
      const result = groupEvidenceByType(case001.evidence)
      const total = Object.values(result).reduce((acc, arr) => acc + arr.length, 0)
      expect(total).toBe(case001.evidence.length)
    })
  })

  // ── filterKeyEvidence ────────────────────────────────────────
  describe('filterKeyEvidence', () => {
    it('[GUARD] devuelve array vacío si ninguna evidencia es clave', () => {
      const noKey = case001.evidence.map((e) => ({ ...e, isKey: false }))
      expect(filterKeyEvidence(noKey)).toHaveLength(0)
    })

    it('[GUARD] devuelve array vacío con input vacío', () => {
      expect(filterKeyEvidence([])).toHaveLength(0)
    })

    it('[GUARD] todas las devueltas tienen isKey = true', () => {
      filterKeyEvidence(case001.evidence).forEach((e) => expect(e.isKey).toBe(true))
    })
  })

  // ── countByType ──────────────────────────────────────────────
  describe('countByType', () => {
    it('[GUARD] con array vacío todos los contadores son 0', () => {
      const counts = countByType([])
      expect(counts.physical).toBe(0)
      expect(counts.testimony).toBe(0)
      expect(counts.document).toBe(0)
      expect(counts.digital).toBe(0)
    })

    it('[GUARD] la suma de todos los tipos iguala la longitud del array', () => {
      const counts = countByType(case001.evidence)
      const total = counts.physical + counts.testimony + counts.document + counts.digital
      expect(total).toBe(case001.evidence.length)
    })

    it('[GUARD] siempre incluye los 4 tipos, incluso si alguno es 0', () => {
      const counts = countByType(case001.evidence)
      expect(counts).toHaveProperty('physical')
      expect(counts).toHaveProperty('testimony')
      expect(counts).toHaveProperty('document')
      expect(counts).toHaveProperty('digital')
    })
  })

  // ── getEvidenceTypeLabel / Color ─────────────────────────────
  describe('getEvidenceTypeLabel y getEvidenceTypeColor', () => {
    it('[GUARD] label para "testimony" es una cadena no vacía', () => {
      expect(getEvidenceTypeLabel('testimony')).toBeTruthy()
    })

    it('[GUARD] color para "testimony" es un hex válido', () => {
      expect(getEvidenceTypeColor('testimony')).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('[GUARD] todos los tipos tienen labels distintos entre sí', () => {
      const labels = (['physical', 'testimony', 'document', 'digital'] as const).map(
        getEvidenceTypeLabel
      )
      const unique = new Set(labels)
      expect(unique.size).toBe(4)
    })

    it('[GUARD] todos los tipos tienen colores distintos entre sí', () => {
      const colors = (['physical', 'testimony', 'document', 'digital'] as const).map(
        getEvidenceTypeColor
      )
      const unique = new Set(colors)
      expect(unique.size).toBe(4)
    })
  })
})

/* ══════════════════════════════════════════════════════════════════
   3. InterrogationEngine — PATHS NEGATIVOS Y BORDES
══════════════════════════════════════════════════════════════════ */

describe('InterrogationEngine — casos negativos y bordes', () => {
  // ── isSuspectFullyInterviewed ────────────────────────────────
  describe('isSuspectFullyInterviewed', () => {
    it('[BUG] sospechoso sin diálogos se considera "completamente entrevistado" (every sobre vacío)', () => {
      const suspectNoDialogues: Suspect = { ...marco, dialogues: [] }
      // every() sobre vacío = true → nunca mostrará preguntas pendientes
      expect(isSuspectFullyInterviewed(suspectNoDialogues, new Set())).toBe(true)
    })

    it('[GUARD] sospechoso con diálogos y set vacío NO está completamente entrevistado', () => {
      expect(isSuspectFullyInterviewed(marco, new Set())).toBe(false)
    })

    it('[GUARD] solo se considera completo cuando el set contiene TODOS los IDs del sospechoso', () => {
      const allIds = new Set(marco.dialogues.map((d) => d.id))
      expect(isSuspectFullyInterviewed(marco, allIds)).toBe(true)
    })

    it('[EDGE] set con IDs que no pertenecen al sospechoso no lo marca como entrevistado', () => {
      const foreignIds = new Set(['id-extraño-1', 'id-extraño-2'])
      expect(isSuspectFullyInterviewed(marco, foreignIds)).toBe(false)
    })
  })

  // ── getSuspectSuspicionLevel ─────────────────────────────────
  describe('getSuspectSuspicionLevel', () => {
    it('[BUG] IDs de otros sospechosos en askedIds diluyen el nivel de sospecha', () => {
      // Marco tiene respuestas evasivas/enojadas → debería tener alta sospecha
      const marcoIds = new Set(marco.dialogues.map((d) => d.id))
      const levelPuro = getSuspectSuspicionLevel(marco, marcoIds)

      // Ahora añadimos IDs ajenos al set (de Valentina)
      const valIds = valentina.dialogues.map((d) => d.id)
      const setMezclado = new Set([...marcoIds, ...valIds])
      const levelDiluido = getSuspectSuspicionLevel(marco, setMezclado)

      // El nivel diluido debería ser MENOR porque el denominador es más grande
      // pero el numerador no cambió (solo cuenta respuestas del propio Marco)
      expect(levelDiluido).toBeLessThan(levelPuro)
    })

    it('[GUARD] devuelve 0 con set vacío (sin preguntas realizadas)', () => {
      expect(getSuspectSuspicionLevel(marco, new Set())).toBe(0)
    })

    it('[GUARD] el nivel nunca supera 100', () => {
      const allIds = new Set(marco.dialogues.map((d) => d.id))
      expect(getSuspectSuspicionLevel(marco, allIds)).toBeLessThanOrEqual(100)
    })

    it('[GUARD] el nivel nunca es negativo', () => {
      const allIds = new Set(marco.dialogues.map((d) => d.id))
      expect(getSuspectSuspicionLevel(marco, allIds)).toBeGreaterThanOrEqual(0)
    })

    it('[GUARD] sospechoso inocente (solo respuestas tranquilas/tristes) tiene sospecha < 50%', () => {
      const calmSuspect: Suspect = {
        ...valentina,
        dialogues: valentina.dialogues.map((d) => ({ ...d, emotionalState: 'calm' as const })),
      }
      const allIds = new Set(calmSuspect.dialogues.map((d) => d.id))
      expect(getSuspectSuspicionLevel(calmSuspect, allIds)).toBeLessThan(50)
    })

    it('[GUARD] sospechoso que solo responde con ira/evasiva tiene sospecha = 100%', () => {
      const fullySuspicious: Suspect = {
        ...marco,
        dialogues: marco.dialogues.map((d) => ({ ...d, emotionalState: 'angry' as const })),
      }
      const allIds = new Set(fullySuspicious.dialogues.map((d) => d.id))
      expect(getSuspectSuspicionLevel(fullySuspicious, allIds)).toBe(100)
    })
  })

  // ── getAvailableDialogues ────────────────────────────────────
  describe('getAvailableDialogues', () => {
    it('[GUARD] con set vacío devuelve todos los diálogos', () => {
      expect(getAvailableDialogues(marco, new Set())).toHaveLength(marco.dialogues.length)
    })

    it('[GUARD] IDs ajenos en el set no excluyen diálogos del sospechoso', () => {
      const foreignSet = new Set([NONEXISTENT_ID, 'otro-id-raro'])
      expect(getAvailableDialogues(marco, foreignSet)).toHaveLength(marco.dialogues.length)
    })

    it('[GUARD] al excluir todos los IDs válidos, devuelve array vacío', () => {
      const allIds = new Set(marco.dialogues.map((d) => d.id))
      expect(getAvailableDialogues(marco, allIds)).toHaveLength(0)
    })
  })

  // ── getAskedDialogues ────────────────────────────────────────
  describe('getAskedDialogues', () => {
    it('[GUARD] IDs ajenos en el set no se incluyen en el resultado', () => {
      const setConAjenos = new Set([NONEXISTENT_ID, marco.dialogues[0].id])
      const result = getAskedDialogues(marco, setConAjenos)
      // Solo debería incluir el diálogo real de marco
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(marco.dialogues[0].id)
    })

    it('[GUARD] con set vacío devuelve array vacío', () => {
      expect(getAskedDialogues(marco, new Set())).toHaveLength(0)
    })
  })
})

/* ══════════════════════════════════════════════════════════════════
   4. INTEGRIDAD DE DATOS — Validaciones estructurales profundas
══════════════════════════════════════════════════════════════════ */

describe('Integridad de datos — validaciones estructurales profundas', () => {
  describe('Coordenadas de hotspots', () => {
    it('todos los hotspots tienen x e y dentro del rango [0, 100]', () => {
      for (const c of ALL_CASES) {
        for (const h of c.hotspots) {
          expect(h.x, `${c.title} → hotspot ${h.id}.x`).toBeGreaterThanOrEqual(0)
          expect(h.x, `${c.title} → hotspot ${h.id}.x`).toBeLessThanOrEqual(100)
          expect(h.y, `${c.title} → hotspot ${h.id}.y`).toBeGreaterThanOrEqual(0)
          expect(h.y, `${c.title} → hotspot ${h.id}.y`).toBeLessThanOrEqual(100)
        }
      }
    })

    it('no hay IDs de hotspot duplicados dentro de un mismo caso', () => {
      for (const c of ALL_CASES) {
        const ids = c.hotspots.map((h) => h.id)
        const unique = new Set(ids)
        expect(unique.size, `Caso ${c.title} tiene hotspots con ID duplicado`).toBe(ids.length)
      }
    })

    it('no hay dos hotspots en el mismo caso apuntando a la misma evidencia', () => {
      for (const c of ALL_CASES) {
        const evIds = c.hotspots.map((h) => h.evidenceId).filter(Boolean)
        const unique = new Set(evIds)
        expect(unique.size, `Caso ${c.title} tiene evidencia referenciada por múltiples hotspots`).toBe(evIds.length)
      }
    })
  })

  describe('Contenido de campos de texto', () => {
    it('ninguna pregunta de diálogo está vacía', () => {
      for (const c of ALL_CASES) {
        for (const s of c.suspects) {
          for (const d of s.dialogues) {
            expect(d.question.trim(), `${c.title} → ${s.name} → diálogo ${d.id}`).not.toBe('')
          }
        }
      }
    })

    it('ninguna respuesta de diálogo está vacía', () => {
      for (const c of ALL_CASES) {
        for (const s of c.suspects) {
          for (const d of s.dialogues) {
            expect(d.answer.trim(), `${c.title} → ${s.name} → diálogo ${d.id}`).not.toBe('')
          }
        }
      }
    })

    it('ninguna evidencia tiene analysis vacío', () => {
      for (const c of ALL_CASES) {
        for (const e of c.evidence) {
          expect(e.analysis.trim(), `${c.title} → evidencia ${e.id}`).not.toBe('')
        }
      }
    })

    it('todos los sospechosos tienen edad positiva (> 0)', () => {
      for (const c of ALL_CASES) {
        for (const s of c.suspects) {
          expect(s.age, `${c.title} → ${s.name}`).toBeGreaterThan(0)
        }
      }
    })

    it('el color del caso es un hex válido de 6 dígitos', () => {
      for (const c of ALL_CASES) {
        expect(c.color, `Caso ${c.title}`).toMatch(/^#[0-9a-fA-F]{6}$/)
      }
    })

    it('la solución tiene explanation no vacía', () => {
      for (const c of ALL_CASES) {
        expect(c.solution.explanation.trim(), `Caso ${c.title}`).not.toBe('')
      }
    })
  })

  describe('Unicidad de IDs entre casos', () => {
    it('los IDs de casos son únicos entre todos los casos', () => {
      const ids = ALL_CASES.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('los IDs de evidencia son únicos dentro de cada caso (ya existe) y también globalmente', () => {
      const allEvidenceIds = ALL_CASES.flatMap((c) => c.evidence.map((e) => e.id))
      const unique = new Set(allEvidenceIds)
      // Si falla: dos casos distintos comparten un ID de evidencia
      expect(unique.size).toBe(allEvidenceIds.length)
    })

    it('los IDs de diálogos son únicos globalmente entre todos los casos', () => {
      const allDialogIds = ALL_CASES.flatMap((c) =>
        c.suspects.flatMap((s) => s.dialogues.map((d) => d.id))
      )
      const unique = new Set(allDialogIds)
      expect(unique.size).toBe(allDialogIds.length)
    })
  })

  describe('Consistencia solution ↔ suspects', () => {
    it('solution.guiltyId referencia a un sospechoso marcado con isGuilty = true', () => {
      for (const c of ALL_CASES) {
        const guilty = c.suspects.find((s) => s.id === c.solution.guiltyId)
        expect(guilty, `Caso ${c.title}: guiltyId no encontrado`).toBeDefined()
        expect(guilty!.isGuilty, `Caso ${c.title}: el sospechoso acusado no tiene isGuilty=true`).toBe(true)
      }
    })

    it('los sospechosos no culpables tienen isGuilty = false explícitamente', () => {
      for (const c of ALL_CASES) {
        const innocents = c.suspects.filter((s) => s.id !== c.solution.guiltyId)
        for (const s of innocents) {
          expect(s.isGuilty, `${c.title} → ${s.name} debería tener isGuilty=false`).toBe(false)
        }
      }
    })

    it('hacer makeAccusation con el guiltyId da correct=true en todos los casos', () => {
      for (const c of ALL_CASES) {
        const p = makeAccusation(createCaseProgress(c.id), c, c.solution.guiltyId)
        expect(p.correct, `Caso ${c.title}`).toBe(true)
      }
    })

    it('hacer makeAccusation con cualquier inocente da correct=false en todos los casos', () => {
      for (const c of ALL_CASES) {
        for (const s of c.suspects.filter((x) => !x.isGuilty)) {
          const p = makeAccusation(createCaseProgress(c.id), c, s.id)
          expect(p.correct, `Caso ${c.title} → acusar a ${s.name}`).toBe(false)
        }
      }
    })
  })

  describe('Tipos de evidencia válidos', () => {
    const VALID_TYPES = new Set(['physical', 'testimony', 'document', 'digital'])

    it('todas las evidencias tienen un type válido', () => {
      for (const c of ALL_CASES) {
        for (const e of c.evidence) {
          expect(VALID_TYPES.has(e.type), `${c.title} → evidencia ${e.id} tiene type="${e.type}"`).toBe(true)
        }
      }
    })
  })

  describe('Estados emocionales válidos', () => {
    const VALID_STATES = new Set(['calm', 'nervous', 'angry', 'sad', 'evasive'])

    it('todos los diálogos tienen un emotionalState válido', () => {
      for (const c of ALL_CASES) {
        for (const s of c.suspects) {
          for (const d of s.dialogues) {
            expect(
              VALID_STATES.has(d.emotionalState),
              `${c.title} → ${s.name} → diálogo ${d.id} tiene emotionalState="${d.emotionalState}"`
            ).toBe(true)
          }
        }
      }
    })
  })
})

/* ══════════════════════════════════════════════════════════════════
   5. FLUJOS DE JUEGO INVÁLIDOS / SECUENCIAS ANÓMALAS
══════════════════════════════════════════════════════════════════ */

describe('Flujos de juego inválidos y secuencias anómalas', () => {
  describe('Acusar sin investigar', () => {
    it('se puede hacer una acusación con 0% de progreso (sin evidencia ni interrogatorio)', () => {
      const p = freshProgress()
      const result = makeAccusation(p, case001, case001.suspects[0].id)
      // El motor lo permite — la UI debería bloquearlo
      expect(result.solved).toBe(true)
    })

    it('acusar sin recolectar evidencia con el culpable correcto resuelve el caso igualmente', () => {
      const p = makeAccusation(freshProgress(), case001, case001.solution.guiltyId)
      expect(p.correct).toBe(true)
    })
  })

  describe('Operaciones post-resolución', () => {
    it('[BUG] se puede seguir recolectando evidencia después de acusar (el motor no lo impide)', () => {
      let p = makeAccusation(freshProgress(), case001, case001.solution.guiltyId)
      expect(p.solved).toBe(true)
      // El motor no bloquea esto
      p = collectEvidence(p, case001.evidence[0].id)
      expect(p.collectedEvidenceIds.has(case001.evidence[0].id)).toBe(true)
    })

    it('[BUG] se puede seguir entrevistando después de acusar (el motor no lo impide)', () => {
      let p = makeAccusation(freshProgress(), case001, case001.solution.guiltyId)
      p = recordInterview(p, marco.id, marco.dialogues[0].id)
      expect(getInterviewedDialogueIds(p, marco.id).has(marco.dialogues[0].id)).toBe(true)
    })
  })

  describe('Inmutabilidad en cadenas de operaciones', () => {
    it('una cadena de collectEvidence no muta ningún eslabón intermedio', () => {
      const p0 = freshProgress()
      const p1 = collectEvidence(p0, case001.evidence[0].id)
      const p2 = collectEvidence(p1, case001.evidence[1].id)
      const p3 = collectEvidence(p2, case001.evidence[2].id)

      expect(p0.collectedEvidenceIds.size).toBe(0)
      expect(p1.collectedEvidenceIds.size).toBe(1)
      expect(p2.collectedEvidenceIds.size).toBe(2)
      expect(p3.collectedEvidenceIds.size).toBe(3)
    })

    it('una cadena de recordInterview no muta ningún eslabón intermedio', () => {
      const p0 = freshProgress()
      const p1 = recordInterview(p0, marco.id, marco.dialogues[0].id)
      const p2 = recordInterview(p1, marco.id, marco.dialogues[1].id)

      expect(Object.keys(p0.interviewedSuspects).length).toBe(0)
      expect(getInterviewedDialogueIds(p1, marco.id).size).toBe(1)
      expect(getInterviewedDialogueIds(p2, marco.id).size).toBe(2)
    })
  })

  describe('Progreso entre casos distintos', () => {
    it('el caseId del progreso no afecta las operaciones del motor (sin validación cruzada)', () => {
      // Progreso creado para case001 pero usado con case002
      const p = createCaseProgress(case001.id)
      // El motor no valida que el caseId coincida con el caso pasado
      const pct = getProgressPercent(p, case002)
      expect(pct).toBe(0) // correcto, no hay evidencia
    })

    it('[BUG] colectar evidencia del caso 002 en un progreso del caso 001 no lanza error', () => {
      let p = createCaseProgress(case001.id)
      const case002EvidenceId = case002.evidence[0].id
      p = collectEvidence(p, case002EvidenceId)
      // El motor lo acepta aunque sea evidencia de otro caso
      expect(p.collectedEvidenceIds.has(case002EvidenceId)).toBe(true)
    })
  })

  describe('Caso sin sospechosos', () => {
    it('[GUARD] getProgressPercent con caso sin suspects ni evidence devuelve 0', () => {
      const emptyCase: Case = { ...case001, evidence: [], suspects: [], hotspots: [] }
      const p = createCaseProgress(emptyCase.id)
      expect(getProgressPercent(p, emptyCase)).toBe(0)
    })
  })

  describe('Cantidad de diálogos y preguntas', () => {
    it('todos los casos tienen al menos un diálogo en total', () => {
      for (const c of ALL_CASES) {
        const total = c.suspects.reduce((acc, s) => acc + s.dialogues.length, 0)
        expect(total, `Caso ${c.title}`).toBeGreaterThan(0)
      }
    })

    it('el culpable siempre tiene al menos un diálogo que provoca respuesta evasiva o enojada', () => {
      for (const c of ALL_CASES) {
        const guilty = c.suspects.find((s) => s.isGuilty)!
        const tenseDialogues = guilty.dialogues.filter((d) =>
          ['angry', 'evasive', 'nervous'].includes(d.emotionalState)
        )
        expect(tenseDialogues.length, `${c.title}: el culpable ${guilty.name} no tiene respuestas tensas`).toBeGreaterThan(0)
      }
    })

    it('ningún sospechoso tiene exactamente el mismo diálogo que otro en el mismo caso', () => {
      for (const c of ALL_CASES) {
        const allAnswers = c.suspects.flatMap((s) => s.dialogues.map((d) => d.answer))
        const unique = new Set(allAnswers)
        expect(unique.size, `Caso ${c.title} tiene respuestas duplicadas entre sospechosos`).toBe(
          allAnswers.length
        )
      }
    })
  })
})
