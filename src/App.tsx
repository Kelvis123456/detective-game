import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import MainMenu from './components/scenes/MainMenu'
import CaseSelection from './components/scenes/CaseSelection'
import CaseIntro from './components/scenes/CaseIntro'
import CrimeScene from './components/scenes/CrimeScene'
import Interrogation from './components/scenes/Interrogation'
import EvidenceBoard from './components/scenes/EvidenceBoard'
import DigitalForensics from './components/scenes/DigitalForensics'
import Accusation from './components/scenes/Accusation'
import Resolution from './components/scenes/Resolution'
import Notification from './components/ui/Notification'
import FilmGrain from './components/ui/FilmGrain'
import { audioEngine, type AmbientScene } from './audio/AudioEngine'
import type { Scene } from './types'

const PAGE_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const AMBIENT_BY_SCENE: Record<Scene, AmbientScene> = {
  'main-menu': 'menu',
  'case-selection': 'menu',
  'case-intro': 'investigation',
  'crime-scene': 'investigation',
  interrogation: 'investigation',
  'evidence-board': 'investigation',
  'digital-forensics': 'investigation',
  accusation: 'tension',
  resolution: 'none',
}

export default function App() {
  const scene = useGameStore((s) => s.scene)

  // Every scene transition (crucially Accusation → Resolution, reached from
  // deep in a scroll on a long proof form) must land the player at the top —
  // otherwise the actual verdict can render entirely below the fold.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [scene])

  useEffect(() => {
    audioEngine.playAmbient(AMBIENT_BY_SCENE[scene])
  }, [scene])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <FilmGrain opacity={0.03} />
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35 }}
        >
          {scene === 'main-menu' && <MainMenu />}
          {scene === 'case-selection' && <CaseSelection />}
          {scene === 'case-intro' && <CaseIntro />}
          {scene === 'crime-scene' && <CrimeScene />}
          {scene === 'interrogation' && <Interrogation />}
          {scene === 'evidence-board' && <EvidenceBoard />}
          {scene === 'digital-forensics' && <DigitalForensics />}
          {scene === 'accusation' && <Accusation />}
          {scene === 'resolution' && <Resolution />}
        </motion.div>
      </AnimatePresence>
      <Notification />
    </div>
  )
}
