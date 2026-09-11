/**
 * A deterministic, procedurally-generated bust illustration for a suspect —
 * pure inline SVG, no external art assets. Every trait (skin tone, hair,
 * clothing, accessory) is derived from a hash of the suspect's id, so the
 * same suspect always renders the same face, sixteen different suspects
 * across four cases render sixteen visually distinct ones, and there is
 * zero licensing risk since nothing is copied from anywhere.
 */

import { useLanguage } from '../../i18n/LanguageContext'

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (h * 33 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function pick<T>(arr: readonly T[], seed: number, salt: number): T {
  return arr[(seed + salt * 97) % arr.length]
}

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + amount))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amount))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amount))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const SKIN_TONES = ['#e8b894', '#d9a679', '#c68958', '#a8734d', '#8a5a3a', '#6b4530'] as const
const HAIR_COLORS = ['#17110c', '#3a2a1a', '#5a4530', '#8a7050', '#d4c090', '#2b2b2e', '#6b3a2a'] as const
const CLOTHING_COLORS = ['#3a3a42', '#4a3a2a', '#2a3a4a', '#4a2a3a', '#3a4a3a', '#38302a'] as const
const HAIR_STYLES = ['short', 'bald', 'long', 'slicked', 'bun', 'wavy', 'short'] as const
const ACCESSORIES = ['none', 'glasses', 'none', 'earrings', 'none', 'mustache', 'glasses'] as const

function Hair({ style, color }: { style: (typeof HAIR_STYLES)[number]; color: string }) {
  const dark = shade(color, -18)
  switch (style) {
    case 'bald':
      return null
    case 'long':
      return (
        <>
          <ellipse cx="50" cy="27" rx="27" ry="16" fill={color} />
          <rect x="16" y="30" width="10" height="42" rx="5" fill={color} />
          <rect x="74" y="30" width="10" height="42" rx="5" fill={color} />
        </>
      )
    case 'slicked':
      return (
        <ellipse cx="44" cy="25" rx="30" ry="15" fill={color} transform="rotate(-6 44 25)" />
      )
    case 'bun':
      return (
        <>
          <ellipse cx="50" cy="27" rx="27" ry="16" fill={color} />
          <circle cx="50" cy="12" r="8" fill={color} />
        </>
      )
    case 'wavy':
      return (
        <>
          <ellipse cx="50" cy="27" rx="27" ry="16" fill={color} />
          <circle cx="27" cy="38" r="6" fill={color} />
          <circle cx="73" cy="38" r="6" fill={color} />
          <circle cx="50" cy="16" r="6" fill={dark} opacity={0.4} />
        </>
      )
    default:
      return <ellipse cx="50" cy="27" rx="27" ry="16" fill={color} />
  }
}

function Accessory({ kind, tone }: { kind: (typeof ACCESSORIES)[number]; tone: string }) {
  switch (kind) {
    case 'glasses':
      return (
        <g stroke="#1a1410" strokeWidth="1.6" fill="rgba(255,255,255,0.05)">
          <rect x="33" y="39" width="15" height="11" rx="3" />
          <rect x="52" y="39" width="15" height="11" rx="3" />
          <line x1="48" y1="44" x2="52" y2="44" />
        </g>
      )
    case 'earrings':
      return (
        <>
          <circle cx="24" cy="50" r="1.8" fill="#e8c874" />
          <circle cx="76" cy="50" r="1.8" fill="#e8c874" />
        </>
      )
    case 'mustache':
      return <path d="M 42 57 Q 50 60 58 57 Q 50 61 42 57 Z" fill={shade(tone, -30)} />
    default:
      return null
  }
}

export function PortraitAvatar({
  seed,
  size = 56,
  className,
}: {
  seed: string
  size?: number
  className?: string
}) {
  const { locale } = useLanguage()
  const h = hashString(seed)
  const skin = pick(SKIN_TONES, h, 1)
  const hairColor = pick(HAIR_COLORS, h, 2)
  const clothing = pick(CLOTHING_COLORS, h, 3)
  const hairStyle = pick(HAIR_STYLES, h, 4)
  const accessory = pick(ACCESSORIES, h, 5)
  const gradId = `pa-skin-${seed.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={locale === 'en' ? 'Suspect portrait' : 'Retrato del sospechoso'}
    >
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={shade(skin, 22)} />
          <stop offset="100%" stopColor={skin} />
        </radialGradient>
      </defs>

      {/* Shoulders / clothing */}
      <path d="M 12 100 Q 12 66 50 66 Q 88 66 88 100 Z" fill={clothing} />

      {/* Neck */}
      <rect x="41" y="56" width="18" height="20" fill={skin} />
      <rect x="41" y="56" width="18" height="8" fill={shade(skin, -14)} opacity={0.4} />

      {/* Ears */}
      <ellipse cx="22" cy="43" rx="4.2" ry="6.5" fill={skin} />
      <ellipse cx="78" cy="43" rx="4.2" ry="6.5" fill={skin} />

      {/* Head */}
      <ellipse cx="50" cy="41" rx="27" ry="30" fill={`url(#${gradId})`} />

      {/* Hair (behind face features, in front of head base) */}
      <Hair style={hairStyle} color={hairColor} />

      {/* Eyebrows */}
      <rect x="35" y="37" width="11" height="2.3" rx="1.1" fill={shade(hairColor, -10)} transform="rotate(-5 40 38)" />
      <rect x="54" y="37" width="11" height="2.3" rx="1.1" fill={shade(hairColor, -10)} transform="rotate(5 60 38)" />

      {/* Eyes */}
      <ellipse cx="41" cy="44" rx="2.8" ry="3.4" fill="#191410" />
      <ellipse cx="59" cy="44" rx="2.8" ry="3.4" fill="#191410" />
      <circle cx="42" cy="43" r="0.9" fill="#fff" opacity={0.7} />
      <circle cx="60" cy="43" r="0.9" fill="#fff" opacity={0.7} />

      {/* Nose */}
      <path d="M 50 45 L 47 56 Q 50 58.5 53 56 Z" fill={shade(skin, -20)} opacity={0.4} />

      {/* Mouth */}
      <path d="M 41 62 Q 50 65.5 59 62" stroke={shade(skin, -45)} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      <Accessory kind={accessory} tone={skin} />
    </svg>
  )
}
