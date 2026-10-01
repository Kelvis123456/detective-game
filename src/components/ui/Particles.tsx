import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export default function Particles({ count = 40 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // sin canvas (jsdom, canvas bloqueado) o con movimiento reducido: sin partículas
    if (!ctx || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    particlesRef.current = Array.from({ length: count }, () => createParticle(canvas))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life--

        const ratio = p.life / p.maxLife
        ctx.save()
        ctx.globalAlpha = p.opacity * ratio
        ctx.fillStyle = '#c8a96e'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        if (p.life <= 0) {
          particlesRef.current[i] = createParticle(canvas)
        }
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.4 }}
    />
  )
}

function createParticle(canvas: HTMLCanvasElement): Particle {
  const maxLife = 120 + Math.random() * 180
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 0.5 + Math.random() * 1.5,
    opacity: 0.2 + Math.random() * 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -0.1 - Math.random() * 0.3,
    life: maxLife,
    maxLife,
  }
}
