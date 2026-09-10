/**
 * Every sound in the game is synthesized here at runtime with the Web Audio
 * API — no recorded samples, no third-party audio library, no licensing
 * risk, zero cost. A single AudioEngine instance owns one AudioContext, a
 * master gain node (the mute switch), and an ambient bed that crossfades
 * when the scene category changes.
 */

export type SfxName =
  | 'evidence'
  | 'device-found'
  | 'unlock-success'
  | 'unlock-fail'
  | 'tension'
  | 'accuse'
  | 'resolution-win'
  | 'resolution-partial'
  | 'resolution-lose'
  | 'resolution-neutral'
  | 'hotspot'

export type AmbientScene = 'menu' | 'investigation' | 'tension' | 'none'

const MUTE_STORAGE_KEY = 'detective-game-audio-muted'

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private ambientGain: GainNode | null = null
  private ambientNodes: (AudioScheduledSourceNode | AudioNode)[] = []
  private currentAmbient: AmbientScene = 'none'
  private muted: boolean

  constructor() {
    this.muted = this.readStoredMute()
  }

  private readStoredMute(): boolean {
    try {
      return localStorage.getItem(MUTE_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  }

  isMuted(): boolean {
    return this.muted
  }

  setMuted(muted: boolean) {
    this.muted = muted
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0')
    } catch {
      /* storage unavailable (private mode, etc.) — mute state just won't persist */
    }
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.05)
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) {
      return null
    }
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 1
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  // ─── One-shot sound effects ──────────────────────────────────────────

  playSfx(name: SfxName) {
    const ctx = this.ensureContext()
    if (!ctx || !this.master) return
    const t0 = ctx.currentTime
    switch (name) {
      case 'evidence':
        this.pluckChime(ctx, t0, [880, 1318.51])
        break
      case 'device-found':
        this.softPop(ctx, t0)
        break
      case 'unlock-success':
        this.arpeggioUp(ctx, t0, [523.25, 659.25, 783.99, 1046.5])
        break
      case 'unlock-fail':
        this.errorBuzz(ctx, t0)
        break
      case 'tension':
        this.tensionSting(ctx, t0)
        break
      case 'hotspot':
        this.tick(ctx, t0)
        break
      case 'accuse':
        this.gavelThud(ctx, t0)
        break
      case 'resolution-win':
        this.chord(ctx, t0, [261.63, 329.63, 392.0, 523.25], { dur: 2.4, wave: 'triangle', gain: 0.16 })
        break
      case 'resolution-partial':
        this.chord(ctx, t0, [220, 277.18, 329.63], { dur: 2, wave: 'sine', gain: 0.14 })
        break
      case 'resolution-lose':
        this.chord(ctx, t0, [220, 261.63, 311.13], { dur: 2.6, wave: 'sawtooth', gain: 0.09, lowpass: 500 })
        break
      case 'resolution-neutral':
        this.chord(ctx, t0, [196, 246.94], { dur: 2, wave: 'sine', gain: 0.1, lowpass: 700 })
        break
    }
  }

  private pluckChime(ctx: AudioContext, t0: number, freqs: number[]) {
    for (const f of freqs) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45)
      osc.connect(g)
      g.connect(this.master!)
      osc.start(t0)
      osc.stop(t0 + 0.5)
    }
  }

  private softPop(ctx: AudioContext, t0: number) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, t0)
    osc.frequency.exponentialRampToValueAtTime(680, t0 + 0.12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3)
    osc.connect(g)
    g.connect(this.master!)
    osc.start(t0)
    osc.stop(t0 + 0.35)
  }

  private arpeggioUp(ctx: AudioContext, t0: number, freqs: number[]) {
    freqs.forEach((f, i) => {
      const start = t0 + i * 0.08
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = f
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(0.18, start + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.3)
      osc.connect(g)
      g.connect(this.master!)
      osc.start(start)
      osc.stop(start + 0.35)
    })
  }

  private errorBuzz(ctx: AudioContext, t0: number) {
    ;[140, 148].forEach((f) => {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = f
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.1, t0 + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28)
      osc.connect(g)
      g.connect(this.master!)
      osc.start(t0)
      osc.stop(t0 + 0.3)
    })
  }

  private tensionSting(ctx: AudioContext, t0: number) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(60, t0)
    osc.frequency.linearRampToValueAtTime(48, t0 + 1.3)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(900, t0)
    filter.frequency.linearRampToValueAtTime(200, t0 + 1.3)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.13, t0 + 0.2)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.4)
    osc.connect(filter)
    filter.connect(g)
    g.connect(this.master!)
    osc.start(t0)
    osc.stop(t0 + 1.5)
  }

  private tick(ctx: AudioContext, t0: number) {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.02), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 3000
    const g = ctx.createGain()
    g.gain.value = 0.12
    src.connect(filter)
    filter.connect(g)
    g.connect(this.master!)
    src.start(t0)
  }

  private gavelThud(ctx: AudioContext, t0: number) {
    const sub = ctx.createOscillator()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(120, t0)
    sub.frequency.exponentialRampToValueAtTime(45, t0 + 0.25)
    const subGain = ctx.createGain()
    subGain.gain.setValueAtTime(0.3, t0)
    subGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4)
    sub.connect(subGain)
    subGain.connect(this.master!)
    sub.start(t0)
    sub.stop(t0 + 0.45)

    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2200
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.2
    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.master!)
    noise.start(t0)
  }

  private chord(
    ctx: AudioContext,
    t0: number,
    freqs: number[],
    opts: { dur: number; wave: OscillatorType; gain: number; lowpass?: number }
  ) {
    const bus = ctx.createGain()
    bus.gain.value = 1
    if (opts.lowpass) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = opts.lowpass
      bus.connect(filter)
      filter.connect(this.master!)
    } else {
      bus.connect(this.master!)
    }
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = opts.wave
      osc.frequency.value = f
      const g = ctx.createGain()
      const attack = 0.05 + i * 0.03
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(opts.gain, t0 + attack)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
      osc.connect(g)
      g.connect(bus)
      osc.start(t0)
      osc.stop(t0 + opts.dur + 0.1)
    })
  }

  // ─── Ambient bed ─────────────────────────────────────────────────────

  playAmbient(scene: AmbientScene) {
    if (scene === this.currentAmbient) return
    this.currentAmbient = scene
    const ctx = this.ensureContext()
    this.teardownAmbient()
    if (!ctx || !this.master || scene === 'none') return

    const gain = ctx.createGain()
    gain.gain.value = 0
    gain.connect(this.master)
    const targetVolume = scene === 'tension' ? 0.15 : scene === 'menu' ? 0.11 : 0.08
    gain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 1.5)
    this.ambientGain = gain

    const CHORDS: Record<Exclude<AmbientScene, 'none'>, number[]> = {
      menu: [110, 138.59, 164.81], // A2 C#3 E3 — moody A major
      investigation: [98, 123.47, 146.83], // G2 B2 D3 — subdued, stays out of the way
      tension: [82.41, 87.31], // near-unison low drone, deliberately a little dissonant
    }
    const freqs = CHORDS[scene]
    const nodes: (AudioScheduledSourceNode | AudioNode)[] = []

    for (const f of freqs) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.06 + Math.random() * 0.05
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = scene === 'tension' ? 0.6 : 2.4
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      const voiceGain = ctx.createGain()
      voiceGain.gain.value = 1 / freqs.length
      osc.connect(voiceGain)
      voiceGain.connect(gain)
      osc.start()
      lfo.start()
      nodes.push(osc, lfo, lfoGain, voiceGain)
    }

    // Filtered noise floor — room tone under the menu/investigation pad,
    // a tighter rumble under tension.
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = scene === 'tension' ? 260 : 480
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = scene === 'menu' ? 0.05 : scene === 'tension' ? 0.09 : 0.06
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(gain)
    noise.start()
    nodes.push(noise, noiseFilter, noiseGain)

    this.ambientNodes = nodes
  }

  private teardownAmbient() {
    const nodes = this.ambientNodes
    const gain = this.ambientGain
    const ctx = this.ctx
    this.ambientNodes = []
    this.ambientGain = null
    if (!ctx || nodes.length === 0) return
    if (gain) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
    setTimeout(() => {
      nodes.forEach((n) => {
        try {
          ;(n as AudioScheduledSourceNode).stop?.()
        } catch {
          /* already stopped */
        }
      })
    }, 500)
  }
}

export const audioEngine = new AudioEngine()
