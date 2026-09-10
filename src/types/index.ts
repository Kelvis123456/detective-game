export type Scene =
  | 'main-menu'
  | 'case-selection'
  | 'case-intro'
  | 'crime-scene'
  | 'interrogation'
  | 'evidence-board'
  | 'digital-forensics'
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
  /** id of the DigitalMessage/DigitalNote that revealed this evidence, if any */
  digitalSourceId?: string
}

export interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  evidenceId: string | null
  /** if set, clicking this hotspot discovers a DigitalDevice instead of/in addition to evidenceId */
  deviceId?: string | null
  description: string
  icon: string
}

export interface TimelineEvent {
  time: string
  description: string
}

/** Our invented, in-universe digital ecosystem — never a real branded app. Shared across all cases. */
export type DigitalAppId = 'chatvia' | 'anotta' | 'vozal' | 'nubeplus'

export interface DigitalMessage {
  id: string
  sender: string
  timestamp: string
  text: string
  /** this message reveals an Evidence entry when read */
  evidenceId?: string
}

export interface DigitalThread {
  id: string
  appId: DigitalAppId
  title: string
  participants: string[]
  messages: DigitalMessage[]
  /** a recoverable "deleted items" thread */
  isDeleted?: boolean
}

export interface DigitalNote {
  id: string
  appId: DigitalAppId
  title: string
  body: string
  isDeleted?: boolean
  evidenceId?: string
}

export interface DigitalDevice {
  id: string
  ownerSuspectId: string | null
  label: string
  lockType: 'none' | 'pin' | 'pattern'
  unlockCode?: string
  unlockHint?: string
  apps: DigitalAppId[]
  threads: DigitalThread[]
  notes: DigitalNote[]
}

export type ProofCategory = 'means' | 'motive' | 'opportunity'

export interface Solution {
  guiltyId: string
  explanation: string
  timeline: TimelineEvent[]
  /** absent = case not yet migrated to means/motive/opportunity deduction; binary correct/incorrect still works */
  proof?: {
    means: string[]
    motive: string[]
    opportunity: string[]
  }
}

export type EndingType =
  | 'correct-full-case'
  | 'correct-partial-reasoning'
  | 'wrong-suspect-culprit-escapes'
  | 'insufficient-evidence'

export interface AccusationInput {
  suspectId: string
  meansEvidenceId?: string
  motiveEvidenceId?: string
  opportunityEvidenceId?: string
}

export interface TensionEvent {
  id: string
  triggerActionCount: number
  message: string
  effect?: {
    lockThreadIds?: string[]
    lockNoteIds?: string[]
    revealHint?: string
  }
}

export interface EvidenceConnection {
  fromId: string
  toId: string
  label?: string
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
  digitalDevices?: DigitalDevice[]
  tensionEvents?: TensionEvent[]
  correctConnections?: EvidenceConnection[]
}

export interface PlayerStats {
  casesCompleted: number
  correctAccusations: number
  totalEvidenceFound: number
  flawlessCases?: number
}

export type DetectiveRank = 'Novato' | 'Investigador' | 'Detective' | 'Detective Senior' | 'Mente Maestra'

export interface CaseProgress {
  caseId: string
  collectedEvidenceIds: Set<string>
  interviewedSuspects: Record<string, Set<string>>
  accusedSuspectId: string | null
  solved: boolean
  correct: boolean
  ending?: EndingType
  accusationProof?: Partial<Record<ProofCategory, string>>
  discoveredDeviceIds: Set<string>
  unlockedDeviceIds: Set<string>
  readThreadIds: Set<string>
  readNoteIds: Set<string>
  lockedThreadIds: Set<string>
  lockedNoteIds: Set<string>
  actionCount: number
  firedTensionEventIds: Set<string>
  playerConnections: EvidenceConnection[]
}

export interface GameState {
  scene: Scene
  selectedCase: Case | null
  caseProgress: CaseProgress | null
  selectedSuspect: Suspect | null
  playerStats: PlayerStats
  /** FIFO queue — showNotification appends, clearNotification dismisses the oldest.
   *  A queue (not a single overwritable slot) so a tension-mechanic message and a
   *  "evidence collected" toast fired in the same tick don't clobber each other. */
  notifications: string[]
}
