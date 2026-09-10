import { describe, it, expect, beforeEach, vi } from 'vitest'
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

  it('playSfx accepts a delaySeconds offset without scheduling any JS timer', () => {
    // Regression guard: this used to be a real setTimeout in gameStore,
    // which left pending timers that fired after a test file's jsdom
    // environment was already torn down and intermittently threw. Delayed
    // playback must go through the AudioContext's own clock instead, so
    // calling it must never register a real timer.
    vi.useFakeTimers()
    try {
      const before = vi.getTimerCount()
      expect(() => audioEngine.playSfx('resolution-win', 0.55)).not.toThrow()
      expect(vi.getTimerCount()).toBe(before)
    } finally {
      vi.useRealTimers()
    }
  })
})
