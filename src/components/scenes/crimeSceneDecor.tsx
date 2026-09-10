/**
 * Per-case set dressing for the crime scene — pure CSS/gradient shapes (no
 * external art assets), so each case's room reads as a distinct place
 * instead of the same rectangle re-tinted by selectedCase.color. Swapped in
 * by case id from CrimeScene.tsx; add a case here whenever a new case ships.
 */

function RainWindow() {
  return (
    <div
      className="absolute"
      style={{
        top: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '130px',
        height: '95px',
        background: 'linear-gradient(135deg, #060f1a 0%, #0d2035 60%, #060e18 100%)',
        border: '4px solid #2a2010',
        boxShadow: '0 0 40px rgba(15,50,90,0.25), inset 0 0 25px rgba(0,0,0,0.6)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-y-0 w-px bg-zinc-700/50" style={{ left: '50%' }} />
        <div className="absolute inset-x-0 h-px bg-zinc-700/50" style={{ top: '50%' }} />
      </div>
      {[15, 33, 51, 69, 87].map((x, i) => (
        <div
          key={i}
          className="absolute top-0 w-px"
          style={{
            left: `${x}%`,
            height: '100%',
            background: 'rgba(120,180,255,0.25)',
            animation: `rain-drop ${1.2 + i * 0.25}s linear ${i * 0.18}s infinite`,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(15,60,120,0.2) 0%, transparent 70%)' }}
      />
    </div>
  )
}

function Porthole() {
  return (
    <div
      className="absolute rounded-full"
      style={{
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '78px',
        height: '78px',
        background: 'radial-gradient(circle at 40% 35%, #0d2830 0%, #06171c 70%)',
        border: '6px solid #2a2418',
        boxShadow: '0 0 30px rgba(20,80,90,0.2), inset 0 0 20px rgba(0,0,0,0.7)',
      }}
    >
      <div className="absolute inset-2 rounded-full border border-zinc-700/40" />
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle at 65% 70%, rgba(30,120,140,0.15) 0%, transparent 60%)' }}
      />
    </div>
  )
}

function BalconyDoor() {
  return (
    <div
      className="absolute"
      style={{
        top: '4px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '210px',
        height: '175px',
        background: 'linear-gradient(180deg, #0a1420 0%, #060a12 100%)',
        border: '3px solid #2a2010',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)',
      }}
    >
      {/* City bokeh beyond the glass */}
      {[
        { l: '10%', t: '30%', c: '#f0a830' },
        { l: '25%', t: '55%', c: '#e05555' },
        { l: '55%', t: '20%', c: '#f0a830' },
        { l: '70%', t: '45%', c: '#4a9eff' },
        { l: '85%', t: '65%', c: '#f0a830' },
        { l: '40%', t: '70%', c: '#e05555' },
      ].map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: dot.l,
            top: dot.t,
            width: '6px',
            height: '6px',
            backgroundColor: dot.c,
            boxShadow: `0 0 8px 3px ${dot.c}55`,
            opacity: 0.6,
          }}
        />
      ))}
      {/* Open sliding panel gap */}
      <div
        className="absolute right-2 top-1 bottom-1 w-px"
        style={{ background: 'rgba(200,169,110,0.3)' }}
      />
      <div className="absolute inset-x-3 top-1/2 h-px bg-zinc-700/30" />
    </div>
  )
}

function VanityMirror() {
  const bulbs = Array.from({ length: 7 })
  return (
    <div
      className="absolute rounded-t-full"
      style={{
        top: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '128px',
        height: '110px',
        background: 'radial-gradient(ellipse at 50% 35%, #2a2418 0%, #14110a 75%)',
        border: '3px solid #3a3020',
        boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6)',
      }}
    >
      {bulbs.map((_, i) => {
        const angle = (Math.PI / (bulbs.length - 1)) * i
        const x = 50 - Math.cos(angle) * 46
        const y = 46 - Math.sin(angle) * 40
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '6px',
              height: '6px',
              backgroundColor: '#f0d090',
              boxShadow: '0 0 10px 4px rgba(240,208,144,0.5)',
            }}
          />
        )
      })}
    </div>
  )
}

function GlassVitrine() {
  return (
    <div
      className="absolute"
      style={{ bottom: '26%', left: '50%', transform: 'translateX(-50%)', width: '108px', height: '96px' }}
    >
      <div
        className="absolute inset-x-0 top-0 rounded-sm"
        style={{
          height: '64px',
          background: 'linear-gradient(160deg, rgba(140,190,220,0.14) 0%, rgba(140,190,220,0.03) 100%)',
          border: '1px solid rgba(180,210,230,0.3)',
          boxShadow: '0 0 30px rgba(150,200,230,0.08), inset 0 0 20px rgba(255,255,255,0.04)',
        }}
      />
      <div
        className="absolute inset-x-3 bottom-0 rounded-sm"
        style={{ height: '32px', background: 'linear-gradient(180deg, #2a2418 0%, #16130c 100%)', border: '1px solid #3a3020' }}
      />
    </div>
  )
}

function CargoCrates() {
  return (
    <div className="absolute" style={{ bottom: '24%', right: '18%', width: '120px', height: '100px' }}>
      <div
        className="absolute rounded-sm"
        style={{
          width: '70px',
          height: '52px',
          left: 0,
          bottom: 0,
          background: 'linear-gradient(160deg, #3a2f1e 0%, #1e170d 100%)',
          border: '1px solid #4a3d26',
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 11px)',
        }}
      />
      <div
        className="absolute rounded-sm"
        style={{
          width: '54px',
          height: '44px',
          left: '46px',
          bottom: '8px',
          background: 'linear-gradient(160deg, #322a1c 0%, #18130b 100%)',
          border: '1px solid #4a3d26',
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 11px)',
        }}
      />
      {/* Hanging chain */}
      <div
        className="absolute w-px"
        style={{ left: '58px', top: '-40px', height: '40px', background: 'repeating-linear-gradient(180deg, #4a4a4a 0, #4a4a4a 3px, transparent 3px, transparent 6px)' }}
      />
    </div>
  )
}

function RingLightTripod() {
  return (
    <div className="absolute" style={{ bottom: '24%', right: '20%', width: '50px', height: '130px' }}>
      <div className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-zinc-700" style={{ height: '90px' }} />
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
        style={{
          width: '46px',
          height: '46px',
          border: '5px solid rgba(240,208,144,0.5)',
          boxShadow: '0 0 24px 8px rgba(240,208,144,0.15)',
        }}
      />
    </div>
  )
}

export interface SceneDecorProps {
  caseId: string
}

export function SceneWindow({ caseId }: SceneDecorProps) {
  switch (caseId) {
    case 'case-003':
      return <Porthole />
    case 'case-004':
      return <BalconyDoor />
    case 'case-002':
      return <VanityMirror />
    default:
      return <RainWindow />
  }
}

export function SceneCenterpiece({ caseId }: SceneDecorProps) {
  switch (caseId) {
    case 'case-002':
      return null // the vanity mirror above already anchors this room
    case 'case-003':
      return <CargoCrates />
    case 'case-004':
      return <RingLightTripod />
    default:
      return <GlassVitrine />
  }
}
