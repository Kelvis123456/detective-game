import type { Evidence, EvidenceType } from '../types'

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
