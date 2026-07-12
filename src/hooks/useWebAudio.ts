import { useEffect, useRef } from 'react'

export function useAmbientNoise(active: boolean, type: 'rain' | 'office' | 'tension' = 'office') {
  const contextRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])

  useEffect(() => {
    if (!active) {
      nodesRef.current.forEach((n) => {
        try { (n as AudioBufferSourceNode | OscillatorNode).stop?.() } catch { /* already stopped */ }
      })
      nodesRef.current = []
      contextRef.current?.close()
      contextRef.current = null
      return
    }

    const ctx = new AudioContext()
    contextRef.current = ctx
    const nodes: AudioNode[] = []

    if (type === 'rain' || type === 'office') {
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = type === 'rain' ? 1200 : 400
      filter.Q.value = 0.5

      const gain = ctx.createGain()
      gain.gain.value = type === 'rain' ? 0.08 : 0.03

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start()
      nodes.push(source)
    }

    if (type === 'tension') {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 55
      const gain = ctx.createGain()
      gain.gain.value = 0.06
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      nodes.push(osc)
    }

    nodesRef.current = nodes

    return () => {
      nodes.forEach((n) => {
        try { (n as AudioBufferSourceNode | OscillatorNode).stop?.() } catch { /* already stopped */ }
      })
      ctx.close()
    }
  }, [active, type])
}
