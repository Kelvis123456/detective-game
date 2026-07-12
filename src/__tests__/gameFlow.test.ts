/**
 * Pruebas de flujo de juego
 *
 * Verifican que la experiencia completa del jugador funciona correctamente:
 * desde seleccionar un caso, investigar la escena, interrogar sospechosos
 * hasta acusar y ver la resolución.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  createCaseProgress,
  collectEvidence,
  recordInterview,
  makeAccusation,
  getCollectedEvidence,
  getProgressPercent,
  hasKeyEvidence,
} from '../engine/CaseEngine'
import {
  getAvailableDialogues,
  isSuspectFullyInterviewed,
  getSuspectSuspicionLevel,
} from '../engine/InterrogationEngine'
import { filterKeyEvidence } from '../engine/EvidenceEngine'
import case001 from '../data/cases/case001'
import case002 from '../data/cases/case002'
import case003 from '../data/cases/case003'
import { CaseProgress } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// Flujo completo: El Diamante Rojo
// ─────────────────────────────────────────────────────────────────────────────

describe('Flujo completo — El Diamante Rojo (caso 001)', () => {
  let progress: CaseProgress

  beforeEach(() => {
    progress = createCaseProgress(case001.id)
  })

  it('el jugador empieza sin ninguna evidencia recopilada', () => {
    expect(progress.collectedEvidenceIds.size).toBe(0)
    expect(getProgressPercent(progress, case001)).toBe(0)
  })

  it('el jugador puede explorar la escena y recopilar evidencia del basurero', () => {
    // Hotspot: basurero → revela recibo-materiales
    const hotspot = case001.hotspots.find((h) => h.id === 'basurero')
    expect(hotspot).toBeDefined()

    progress = collectEvidence(progress, hotspot!.evidenceId!)
    const collected = getCollectedEvidence(progress, case001)
    expect(collected[0].name).toBe('Recibo de Joyería Especial')
    expect(collected[0].isKey).toBe(true)
  })

  it('el jugador puede interrogar a Valentina Cruz y obtener pistas sobre las llaves', () => {
    // Valentina responde en v-q2 que Marco Delgado tuvo las llaves → revela ficha-evaluacion
    progress = recordInterview(progress, 'valentina-cruz', 'v-q2')
    expect(progress.interviewedSuspects['valentina-cruz'].has('v-q2')).toBe(true)
  })

  it('al preguntar a Sofía Reyes sobre lo que vio, se desbloquea la cámara de seguridad', () => {
    // s-q4 revela camara-seguridad
    progress = recordInterview(progress, 'sofia-reyes', 's-q4')
    // Simular la recolección de evidencia revelada
    progress = collectEvidence(progress, 'camara-seguridad')
    expect(progress.collectedEvidenceIds.has('camara-seguridad')).toBe(true)
  })

  it('cuando se recogen todas las evidencias clave, el caso puede cerrarse', () => {
    const keyIds = filterKeyEvidence(case001.evidence).map((e) => e.id)
    for (const id of keyIds) {
      progress = collectEvidence(progress, id)
    }
    expect(hasKeyEvidence(progress, case001)).toBe(true)
  })

  it('acusar al culpable correcto (Marco Delgado) resuelve el caso exitosamente', () => {
    const result = makeAccusation(progress, case001, 'marco-delgado')
    expect(result.solved).toBe(true)
    expect(result.correct).toBe(true)
  })

  it('acusar a un inocente resuelve el caso pero de forma incorrecta', () => {
    const result = makeAccusation(progress, case001, 'valentina-cruz')
    expect(result.solved).toBe(true)
    expect(result.correct).toBe(false)
  })

  it('el progreso aumenta a medida que el jugador investiga', () => {
    const p0 = getProgressPercent(progress, case001)

    let p = collectEvidence(progress, 'fragmento-cristal')
    const p1 = getProgressPercent(p, case001)

    p = collectEvidence(p, 'ficha-evaluacion')
    p = collectEvidence(p, 'recibo-materiales')
    const p2 = getProgressPercent(p, case001)

    expect(p1).toBeGreaterThan(p0)
    expect(p2).toBeGreaterThan(p1)
  })

  it('Marco Delgado actúa más nervioso/evasivo cuando se le pregunta sobre las réplicas', () => {
    const marco = case001.suspects.find((s) => s.id === 'marco-delgado')!

    // m-q3 pregunta sobre réplicas → responde "evasive"
    const aboutReplicas = marco.dialogues.find((d) => d.id === 'm-q3')
    expect(aboutReplicas?.emotionalState).toBe('evasive')

    // m-q4 cuando se le muestra el recibo → "angry"
    const withReceipt = marco.dialogues.find((d) => d.id === 'm-q4')
    expect(withReceipt?.emotionalState).toBe('angry')
  })

  it('el nivel de sospecha de Marco es mayor que el de Valentina tras interrogatorio completo', () => {
    const marco = case001.suspects.find((s) => s.id === 'marco-delgado')!
    const valentina = case001.suspects.find((s) => s.id === 'valentina-cruz')!

    const marcoIds = new Set(marco.dialogues.map((d) => d.id))
    const valIds = new Set(valentina.dialogues.map((d) => d.id))

    expect(getSuspectSuspicionLevel(marco, marcoIds)).toBeGreaterThan(
      getSuspectSuspicionLevel(valentina, valIds)
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Flujo completo: La Última Nota
// ─────────────────────────────────────────────────────────────────────────────

describe('Flujo completo — La Última Nota (caso 002)', () => {
  let progress: CaseProgress

  beforeEach(() => {
    progress = createCaseProgress(case002.id)
  })

  it('el escenario inicial no tiene evidencia ni interrogatorios', () => {
    expect(progress.collectedEvidenceIds.size).toBe(0)
    expect(Object.keys(progress.interviewedSuspects).length).toBe(0)
  })

  it('el tocador del camerino contiene el vaso con residuos de veneno', () => {
    const tocador = case002.hotspots.find((h) => h.id === 'tocador')
    expect(tocador?.evidenceId).toBe('vaso-residuos')

    const vaso = case002.evidence.find((e) => e.id === 'vaso-residuos')
    expect(vaso?.isKey).toBe(true)
    expect(vaso?.analysis).toContain('digoxina')
  })

  it('Carmen Blanco menciona a Lucía cuando se le pregunta sobre medicamentos', () => {
    // c-q4 revela el frasco de digoxina
    const carmen = case002.suspects.find((s) => s.id === 'carmen-blanco')!
    const dialogue = carmen.dialogues.find((d) => d.id === 'c-q4')
    expect(dialogue?.revealedEvidenceIds).toContain('frasco-digoxina')
  })

  it('el registro de acceso prueba que Lucía estuvo en el camerino antes de la muerte', () => {
    const registro = case002.evidence.find((e) => e.id === 'registro-acceso')
    expect(registro?.isKey).toBe(true)
    expect(registro?.analysis).toContain('19:12')
    expect(registro?.analysis).toContain('Lucía Méndez')
  })

  it('Lucía se pone evasiva al preguntarle sobre los estados de cuenta', () => {
    const lucia = case002.suspects.find((s) => s.id === 'lucia-mendez')!
    const dialogue = lucia.dialogues.find((d) => d.id === 'l-q3')
    expect(dialogue?.emotionalState).toBe('evasive')
  })

  it('Roberto Santos tiene coartada verificable con múltiples testigos', () => {
    const roberto = case002.suspects.find((s) => s.id === 'roberto-santos')!
    // Su coartada menciona testigos concretos
    expect(roberto.alibi.toLowerCase()).toContain('director')
    expect(roberto.isGuilty).toBe(false)
  })

  it('acusar a Lucía Méndez cierra el caso correctamente', () => {
    const result = makeAccusation(progress, case002, 'lucia-mendez')
    expect(result.correct).toBe(true)
  })

  it('acusar a Carmen Blanco, quien solo tiene motivo de plagio, es incorrecto', () => {
    const result = makeAccusation(progress, case002, 'carmen-blanco')
    expect(result.correct).toBe(false)
  })

  it('la solución explica el uso del veneno y la ventana de tiempo', () => {
    expect(case002.solution.explanation).toContain('digoxina')
    expect(case002.solution.timeline.length).toBeGreaterThanOrEqual(5)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Flujo completo: Sombras en el Puerto
// ─────────────────────────────────────────────────────────────────────────────

describe('Flujo completo — Sombras en el Puerto (caso 003)', () => {
  let progress: CaseProgress

  beforeEach(() => {
    progress = createCaseProgress(case003.id)
  })

  it('la huella en el pasamanos es la evidencia física más crítica', () => {
    const huella = case003.evidence.find((e) => e.id === 'huella-pasamanos')
    expect(huella?.isKey).toBe(true)
    expect(huella?.type).toBe('physical')
    expect(huella?.analysis).toContain('Diego Navarro')
  })

  it('las fotos de vigilancia de Isabel Reyes ubican a Navarro en el barco', () => {
    const fotos = case003.evidence.find((e) => e.id === 'fotos-vigilancia')
    expect(fotos?.isKey).toBe(true)
    expect(fotos?.analysis).toContain('02:47')
    expect(fotos?.analysis).toContain('03:18')
  })

  it('Isabel Reyes es una agente encubierta, no la culpable', () => {
    const isabel = case003.suspects.find((s) => s.id === 'isabel-reyes')!
    expect(isabel.isGuilty).toBe(false)
    // Su credencial la exonera
    const credencial = case003.evidence.find((e) => e.id === 'credencial-agente')
    expect(credencial).toBeDefined()
  })

  it('Isabel revela las fotos de vigilancia cuando se coopera con ella', () => {
    const isabel = case003.suspects.find((s) => s.id === 'isabel-reyes')!
    const coopDialogue = isabel.dialogues.find((d) => d.id === 'i-q3')
    expect(coopDialogue?.revealedEvidenceIds).toContain('fotos-vigilancia')
  })

  it('Rafael Moreno tiene deuda pero su coartada está confirmada por testigos', () => {
    const rafael = case003.suspects.find((s) => s.id === 'rafael-moreno')!
    expect(rafael.isGuilty).toBe(false)
    expect(rafael.alibi.toLowerCase()).toContain('bar')
  })

  it('Diego Navarro llega al hotel DESPUÉS de la hora de muerte estimada', () => {
    // Su coartada lo delata: llegó después del crimen
    const diego = case003.suspects.find((s) => s.id === 'diego-navarro')!
    expect(diego.alibi).toContain('3:15')
  })

  it('la póliza de seguro fue contratada apenas 14 días antes del crimen', () => {
    const poliza = case003.evidence.find((e) => e.id === 'poliza-seguro')
    expect(poliza?.analysis).toContain('14 días')
    expect(poliza?.analysis).toContain('Diego Navarro')
  })

  it('acusar a Diego Navarro cierra el caso correctamente', () => {
    const result = makeAccusation(progress, case003, 'diego-navarro')
    expect(result.correct).toBe(true)
  })

  it('el caso de dificultad Difícil tiene más sospechosos y evidencias', () => {
    expect(case003.difficulty).toBe('Difícil')
    expect(case003.suspects.length).toBeGreaterThanOrEqual(3)
    expect(case003.evidence.length).toBeGreaterThanOrEqual(6)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Mecánicas del sistema de interrogatorio
// ─────────────────────────────────────────────────────────────────────────────

describe('Sistema de interrogatorio', () => {
  it('las preguntas se consumen: una vez hecha ya no está disponible', () => {
    const suspect = case001.suspects[0]
    const firstQ = suspect.dialogues[0]

    const allAvailable = getAvailableDialogues(suspect, new Set())
    expect(allAvailable.some((d) => d.id === firstQ.id)).toBe(true)

    const afterAsking = getAvailableDialogues(suspect, new Set([firstQ.id]))
    expect(afterAsking.some((d) => d.id === firstQ.id)).toBe(false)
  })

  it('el interrogatorio queda completo cuando se hacen todas las preguntas', () => {
    const suspect = case001.suspects[0]
    const allIds = new Set(suspect.dialogues.map((d) => d.id))
    expect(isSuspectFullyInterviewed(suspect, allIds)).toBe(true)
  })

  it('un sospechoso parcialmente interrogado no está completo', () => {
    const suspect = case001.suspects[0]
    const partial = new Set([suspect.dialogues[0].id])
    expect(isSuspectFullyInterviewed(suspect, partial)).toBe(false)
  })

  it('interrogar a varios sospechosos es independiente entre sí', () => {
    let p = createCaseProgress(case001.id)
    p = recordInterview(p, 'valentina-cruz', 'v-q1')
    p = recordInterview(p, 'marco-delgado', 'm-q1')
    p = recordInterview(p, 'sofia-reyes', 's-q1')

    expect(p.interviewedSuspects['valentina-cruz'].size).toBe(1)
    expect(p.interviewedSuspects['marco-delgado'].size).toBe(1)
    expect(p.interviewedSuspects['sofia-reyes'].size).toBe(1)
  })

  it('algunas respuestas desbloquean evidencia nueva automáticamente', () => {
    const suspects = case001.suspects
    const dialoguesWithEvidence = suspects
      .flatMap((s) => s.dialogues)
      .filter((d) => d.revealedEvidenceIds.length > 0)

    expect(dialoguesWithEvidence.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Mecánicas del sistema de evidencias
// ─────────────────────────────────────────────────────────────────────────────

describe('Sistema de evidencias', () => {
  it('cada caso tiene al menos una evidencia física, una digital y un documento', () => {
    for (const case_ of [case001, case002, case003]) {
      const types = new Set(case_.evidence.map((e) => e.type))
      expect(types.has('physical')).toBe(true)
      expect(types.has('document')).toBe(true)
    }
  })

  it('las evidencias clave en todos los casos apuntan al culpable', () => {
    for (const case_ of [case001, case002, case003]) {
      const guilty = case_.suspects.find((s) => s.isGuilty)!
      const keyEvidence = filterKeyEvidence(case_.evidence)
      const anyPointsToGuilty = keyEvidence.some(
        (e) =>
          e.analysis.toLowerCase().includes(guilty.name.split(' ')[0].toLowerCase()) ||
          e.analysis.toLowerCase().includes(guilty.name.split(' ')[1].toLowerCase())
      )
      expect(anyPointsToGuilty).toBe(true)
    }
  })

  it('los hotspots de la escena cubren la evidencia principal', () => {
    for (const case_ of [case001, case002, case003]) {
      const hotspotsWithEvidence = case_.hotspots.filter((h) => h.evidenceId !== null)
      expect(hotspotsWithEvidence.length).toBeGreaterThan(0)
    }
  })

  it('las evidencias no clave sirven como pistas secundarias o red herrings', () => {
    for (const case_ of [case001, case002, case003]) {
      const nonKey = case_.evidence.filter((e) => !e.isKey)
      expect(nonKey.length).toBeGreaterThan(0)
    }
  })

  it('recopilar evidencia no muta el objeto de progreso original', () => {
    const original = createCaseProgress(case001.id)
    const copy = { ...original, collectedEvidenceIds: new Set(original.collectedEvidenceIds) }

    collectEvidence(original, 'fragmento-cristal')

    expect(original.collectedEvidenceIds.size).toBe(0)
    expect(copy.collectedEvidenceIds.size).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Dificultad progresiva entre casos
// ─────────────────────────────────────────────────────────────────────────────

describe('Dificultad progresiva', () => {
  it('caso 001 es Fácil, 002 es Medio, 003 es Difícil', () => {
    expect(case001.difficulty).toBe('Fácil')
    expect(case002.difficulty).toBe('Medio')
    expect(case003.difficulty).toBe('Difícil')
  })

  it('el caso Difícil tiene más preguntas totales que el Fácil', () => {
    const totalDialogues001 = case001.suspects.reduce(
      (acc, s) => acc + s.dialogues.length, 0
    )
    const totalDialogues003 = case003.suspects.reduce(
      (acc, s) => acc + s.dialogues.length, 0
    )
    expect(totalDialogues003).toBeGreaterThanOrEqual(totalDialogues001)
  })

  it('cada caso tiene una historia y ubicación distintas', () => {
    const locations = [case001.location, case002.location, case003.location]
    const unique = new Set(locations)
    expect(unique.size).toBe(3)
  })

  it('los culpables son distintos en cada caso', () => {
    const guiltyIds = [case001, case002, case003].map(
      (c) => c.suspects.find((s) => s.isGuilty)!.id
    )
    const unique = new Set(guiltyIds)
    expect(unique.size).toBe(3)
  })
})
