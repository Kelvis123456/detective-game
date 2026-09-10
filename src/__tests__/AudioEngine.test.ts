import { describe, it, expect, beforeEach } from 'vitest'
import { audioEngine } from '../audio/AudioEngine'

describe('audioEngine', () => {
  beforeEach(() => {
    localStorage.clear()
    audioEngine.setMuted(false)
  })

  it('defaults to unmuted', () => {
    expect(audioEngine.isMuted()).toBe(false)
  })

  it('setMuted(true) mutes and persists the preference', () => {
    audioEngine.setMuted(true)
    expect(audioEngine.isMuted()).toBe(true)
    expect(localStorage.getItem('detective-game-audio-muted')).toBe('1')
  })

  it('setMuted(false) unmutes and persists the preference', () => {
    audioEngine.setMuted(true)
    audioEngine.setMuted(false)
    expect(audioEngine.isMuted()).toBe(false)
    expect(localStorage.getItem('detective-game-audio-muted')).toBe('0')
  })

  it('playSfx and playAmbient do not throw in an environment with no AudioContext (jsdom)', () => {
    expect(() => audioEngine.playSfx('evidence')).not.toThrow()
    expect(() => audioEngine.playSfx('resolution-win')).not.toThrow()
    expect(() => audioEngine.playAmbient('menu')).not.toThrow()
    expect(() => audioEngine.playAmbient('none')).not.toThrow()
  })
})
