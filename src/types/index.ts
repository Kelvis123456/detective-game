export type Scene =
  | 'main-menu'
  | 'case-selection'
  | 'case-intro'
  | 'crime-scene'
  | 'interrogation'
  | 'evidence-board'
  | 'accusation'
  | 'resolution'

export type Difficulty = 'Fácil' | 'Medio' | 'Difícil'
export type EvidenceType = 'physical' | 'testimony' | 'document' | 'digital'
export type EmotionalState = 'calm' | 'nervous' | 'angry' | 'sad' | 'evasive'

export interface Dialogue {
  id: string
  question: string
  answer: string
  emotionalState: EmotionalState
  revealedEvidenceIds: string[]
}

export interface Suspect {
  id: string
  name: string
  age: number
  occupation: string
  description: string
  avatar: string
  motive: string
  alibi: string
  isGuilty: boolean
  dialogues: Dialogue[]
}

export interface Evidence {
  id: string
  name: string
  description: string
  type: EvidenceType
  icon: string
  location: string
  isKey: boolean
  analysis: string
}

export interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  evidenceId: string | null
  description: string
  icon: string
}

export interface TimelineEvent {
  time: string
  description: string
}

export interface Solution {
  guiltyId: string
  explanation: string
  timeline: TimelineEvent[]
}

export interface Case {
  id: string
  title: string
  subtitle: string
  description: string
  difficulty: Difficulty
  location: string
  date: string
  thumbnail: string
  color: string
  intro: string
  crimeSceneDescription: string
  suspects: Suspect[]
  evidence: Evidence[]
  hotspots: Hotspot[]
  solution: Solution
}

export interface PlayerStats {
  casesCompleted: number
  correctAccusations: number
  totalEvidenceFound: number
}

export interface CaseProgress {
  caseId: string
  collectedEvidenceIds: Set<string>
  interviewedSuspects: Record<string, Set<string>>
  accusedSuspectId: string | null
  solved: boolean
  correct: boolean
}

export interface GameState {
  scene: Scene
  selectedCase: Case | null
  caseProgress: CaseProgress | null
  selectedSuspect: Suspect | null
  playerStats: PlayerStats
  notification: string | null
}
