import type { Case, Evidence, EvidenceConnection, EvidenceType } from '../types'

export function getEvidenceTypeLabel(type: EvidenceType): string {
  const labels: Record<EvidenceType, string> = {
    physical: 'Evidencia Física',
    testimony: 'Testimonio',
    document: 'Documento',
    digital: 'Digital',
  }
  return labels[type]
}

export function getEvidenceTypeColor(type: EvidenceType): string {
  const colors: Record<EvidenceType, string> = {
    physical: '#c8a96e',
    testimony: '#4a9eff',
    document: '#a0c878',
    digital: '#c87eff',
  }
  return colors[type]
}

export function groupEvidenceByType(evidence: Evidence[]): Record<EvidenceType, Evidence[]> {
  return evidence.reduce(
    (acc, e) => {
      acc[e.type] = [...(acc[e.type] ?? []), e]
      return acc
    },
    {} as Record<EvidenceType, Evidence[]>
  )
}

export function filterKeyEvidence(evidence: Evidence[]): Evidence[] {
  return evidence.filter((e) => e.isKey)
}

export function countByType(evidence: Evidence[]): Record<EvidenceType, number> {
  const counts: Record<EvidenceType, number> = {
    physical: 0,
    testimony: 0,
    document: 0,
    digital: 0,
  }
  for (const e of evidence) {
    counts[e.type]++
  }
  return counts
}

export function evidencePointsToSuspect(
  evidence: Evidence[],
  suspectName: string
): boolean {
  return evidence.some(
    (e) =>
      e.analysis.toLowerCase().includes(suspectName.toLowerCase()) ||
      e.description.toLowerCase().includes(suspectName.toLowerCase())
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Connectable evidence board (Fase 3) — a player pins one string per
 * piece of evidence to the suspect they think it implicates. One
 * evidence id can only hold a single connection at a time: reconnecting
 * it moves the string instead of stacking a second one, matching how a
 * real corkboard works.
 * ───────────────────────────────────────────────────────────────── */

export function normalizeConnection(fromId: string, toId: string): EvidenceConnection {
  return { fromId, toId }
}

export function addConnection(
  connections: EvidenceConnection[],
  connection: EvidenceConnection
): EvidenceConnection[] {
  return [...connections.filter((c) => c.fromId !== connection.fromId), connection]
}

export function removeConnection(
  connections: EvidenceConnection[],
  fromId: string
): EvidenceConnection[] {
  return connections.filter((c) => c.fromId !== fromId)
}

export function isConnectionCorrect(case_: Case, connection: EvidenceConnection): boolean {
  return (case_.correctConnections ?? []).some(
    (c) => c.fromId === connection.fromId && c.toId === connection.toId
  )
}

export function getConnectionAccuracy(
  case_: Case,
  playerConnections: EvidenceConnection[]
): { correct: number; total: number; percent: number } {
  const total = case_.correctConnections?.length ?? 0
  if (total === 0) return { correct: 0, total: 0, percent: 0 }
  const correct = playerConnections.filter((c) => isConnectionCorrect(case_, c)).length
  return { correct, total, percent: Math.round((correct / total) * 100) }
}
