import { cn } from '@/lib/utils'

/**
 * Clean, consistent product illustrations for the merch store (until real product photos exist).
 * Each item is drawn in its selected colour on a soft tinted backdrop, with a "PCM" print
 * that switches to navy on light colours so it always reads.
 */

export type ArtKind =
  | 'tee'
  | 'polo'
  | 'hoodie'
  | 'sweatshirt'
  | 'cap'
  | 'bottle'
  | 'mug'
  | 'tote'
  | 'drawstring'
  | 'pens'
  | 'notebook'
  | 'journal'
  | 'stickers'
  | 'wristbands'
  | 'lanyard'
  | 'pin'
  | 'scarf'
  | 'usb'

const NAVY = '#0f2d6e'
const GOLD = '#d9a441'

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
/** Mix a colour with white (t>0) or black (t<0) */
function shade(hex: string, t: number) {
  const [r, g, b] = hexToRgb(hex)
  const m = (c: number) => Math.round(t >= 0 ? c + (255 - c) * t : c * (1 + t))
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`
}

/** Backdrop tint that suits the item's colour */
export function artBackdrop(color: string) {
  return luminance(color) > 0.7 ? '#e8edf7' : shade(color, 0.88)
}

function Print({ x, y, size, color, text = 'PCM' }: { x: number; y: number; size: number; color: string; text?: string }) {
  const ink = luminance(color) > 0.5 ? NAVY : '#ffffff'
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={size} fill={ink} letterSpacing={size * 0.04}>
      {text}
    </text>
  )
}

function Garment({ color, kind }: { color: string; kind: 'tee' | 'polo' | 'hoodie' | 'sweatshirt' }) {
  const dark = shade(color, -0.22)
  const long = kind === 'hoodie' || kind === 'sweatshirt'
  const body = long
    ? 'M64 46 L84 36 Q100 44 116 36 L136 46 L160 74 L166 150 L150 152 L144 92 L140 92 L140 170 L60 170 L60 92 L56 92 L50 152 L34 150 L40 74 Z'
    : 'M64 44 L84 34 Q100 44 116 34 L136 44 L164 70 L148 88 L138 80 L138 170 L62 170 L62 80 L52 88 L36 70 Z'
  return (
    <g>
      <path d={body} fill={color} stroke={dark} strokeWidth="1.5" strokeLinejoin="round" />
      {/* side shading */}
      <path d={long ? 'M60 92 L60 170 L70 170 L70 92 Z' : 'M62 80 L62 170 L72 170 L72 80 Z'} fill={dark} opacity="0.18" />
      {kind === 'tee' && <path d="M84 34 Q100 52 116 34" fill="none" stroke={dark} strokeWidth="4" />}
      {kind === 'polo' && (
        <>
          <path d="M84 34 L100 50 L116 34 L112 32 L100 44 L88 32 Z" fill={dark} />
          <path d="M100 50 L100 72" stroke={dark} strokeWidth="2" />
          <circle cx="100" cy="58" r="2" fill={shade(color, 0.6)} />
          <circle cx="100" cy="66" r="2" fill={shade(color, 0.6)} />
        </>
      )}
      {kind === 'hoodie' && (
        <>
          <path d="M80 38 Q100 14 120 38 Q112 56 100 58 Q88 56 80 38 Z" fill={dark} />
          <path d="M92 58 L90 82 M108 58 L110 82" stroke={shade(color, 0.55)} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M76 132 L124 132 L118 156 L82 156 Z" fill={dark} opacity="0.35" />
        </>
      )}
      {kind === 'sweatshirt' && (
        <>
          <path d="M84 36 Q100 50 116 36" fill="none" stroke={dark} strokeWidth="5" />
          <path d="M60 162 L140 162" stroke={dark} strokeWidth="5" />
          <path d="M36 144 L50 146 M150 146 L164 144" stroke={dark} strokeWidth="5" />
        </>
      )}
      <Print x={100} y={kind === 'polo' ? 104 : 108} size={22} color={color} />
      <circle cx="100" cy={kind === 'polo' ? 116 : 120} r="2.6" fill={GOLD} />
    </g>
  )
}

function Item({ kind, color }: { kind: ArtKind; color: string }) {
  const dark = shade(color, -0.25)
  const light = shade(color, 0.35)
  switch (kind) {
    case 'tee':
    case 'polo':
    case 'hoodie':
    case 'sweatshirt':
      return <Garment color={color} kind={kind} />
    case 'cap':
      return (
        <g>
          <path d="M44 120 Q46 64 100 60 Q154 64 156 120 Z" fill={color} stroke={dark} strokeWidth="1.5" />
          <path d="M100 60 L100 120 M70 70 Q74 96 72 120 M130 70 Q126 96 128 120" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M44 120 Q100 128 156 120 Q176 124 172 134 Q100 146 30 136 Q26 126 44 120 Z" fill={dark} />
          <circle cx="100" cy="60" r="4" fill={dark} />
          <Print x={100} y={104} size={20} color={color} />
        </g>
      )
    case 'bottle':
      return (
        <g>
          <rect x="84" y="30" width="32" height="20" rx="6" fill={dark} />
          <rect x="88" y="46" width="24" height="10" fill={shade(color, -0.1)} />
          <path d="M72 66 Q72 54 88 54 L112 54 Q128 54 128 66 L128 166 Q128 174 120 174 L80 174 Q72 174 72 166 Z" fill={color} stroke={dark} strokeWidth="1.5" />
          <rect x="76" y="66" width="8" height="100" rx="4" fill="#fff" opacity="0.2" />
          <g transform="rotate(-90 100 116)">
            <Print x={100} y={123} size={20} color={color} />
          </g>
        </g>
      )
    case 'mug':
      return (
        <g>
          <path d="M66 46 L134 46 L134 56 L66 56 Z" fill={dark} />
          <path d="M70 56 L130 56 L122 172 Q100 178 78 172 Z" fill={color} stroke={dark} strokeWidth="1.5" />
          <path d="M72 120 L128 120 L126 140 L74 140 Z" fill={dark} opacity="0.35" />
          <rect x="76" y="62" width="7" height="100" rx="3.5" fill="#fff" opacity="0.18" />
          <Print x={100} y={104} size={20} color={color} />
        </g>
      )
    case 'tote':
      return (
        <g>
          <path d="M76 70 Q76 30 100 30 Q124 30 124 70" fill="none" stroke={dark} strokeWidth="7" />
          <path d="M52 68 L148 68 L156 172 L44 172 Z" fill={color} stroke={dark} strokeWidth="1.5" strokeLinejoin="round" />
          <Print x={100} y={128} size={28} color={color} />
          <circle cx="100" cy="142" r="3" fill={GOLD} />
        </g>
      )
    case 'drawstring':
      return (
        <g>
          <path d="M58 46 L142 46 L148 172 L52 172 Z" fill={color} stroke={dark} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M58 52 L142 52" stroke={dark} strokeWidth="5" />
          <path d="M66 52 L54 172 M134 52 L146 172" stroke={shade(color, 0.5)} strokeWidth="3" />
          <Print x={100} y={118} size={26} color={color} />
        </g>
      )
    case 'pens':
      return (
        <g>
          {[-14, 0, 14].map((dx, i) => (
            <g key={i} transform={`translate(${dx * 2} 0) rotate(${-28 + i * 6} 100 100)`}>
              <rect x="94" y="30" width="12" height="122" rx="6" fill={i === 1 ? GOLD : color} stroke={dark} strokeWidth="1" />
              <path d="M94 152 L100 172 L106 152 Z" fill="#c7cdd6" />
              <rect x="104" y="36" width="4" height="40" rx="2" fill={dark} />
            </g>
          ))}
        </g>
      )
    case 'notebook':
    case 'journal':
      return (
        <g>
          <rect x="58" y="34" width="88" height="132" rx="6" fill={dark} transform="translate(6 4)" />
          <rect x="54" y="30" width="88" height="132" rx="6" fill={color} stroke={dark} strokeWidth="1.5" />
          <rect x="54" y="30" width="12" height="132" fill={dark} opacity="0.35" />
          <rect x="128" y="30" width="5" height="132" fill={dark} />
          {kind === 'journal' && <path d="M112 162 L112 184 L118 178 L124 184 L124 162" fill={GOLD} />}
          <Print x={100} y={98} size={20} color={color} />
          <Print x={100} y={116} size={9} color={color} text={kind === 'journal' ? 'JOURNAL' : 'NOTEBOOK'} />
        </g>
      )
    case 'stickers':
      return (
        <g>
          <circle cx="76" cy="84" r="34" fill={color} stroke="#fff" strokeWidth="5" />
          <Print x={76} y={91} size={18} color={color} />
          <rect x="96" y="92" width="64" height="64" rx="14" fill={GOLD} stroke="#fff" strokeWidth="5" transform="rotate(10 128 124)" />
          <text x="128" y="132" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill={NAVY} transform="rotate(10 128 124)">
            faith
          </text>
          <path d="M60 128 L90 128 L96 160 L54 160 Z" fill={light} stroke="#fff" strokeWidth="5" />
        </g>
      )
    case 'wristbands':
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx="100" cy={84 + i * 22} rx="56" ry="20" fill="none" stroke={i === 1 ? GOLD : i === 2 ? NAVY : color} strokeWidth="14" />
          ))}
        </g>
      )
    case 'lanyard':
      return (
        <g>
          <path d="M70 20 L96 112 M130 20 L104 112" stroke={color} strokeWidth="12" strokeLinecap="round" />
          <rect x="94" y="106" width="12" height="14" rx="3" fill="#9aa3b1" />
          <rect x="66" y="118" width="68" height="56" rx="8" fill="#ffffff" stroke="#c7cdd6" strokeWidth="2" />
          <rect x="74" y="128" width="20" height="24" rx="3" fill="#e8edf7" />
          <rect x="100" y="132" width="26" height="4" rx="2" fill="#c7cdd6" />
          <rect x="100" y="142" width="18" height="4" rx="2" fill="#c7cdd6" />
          <rect x="74" y="160" width="52" height="5" rx="2.5" fill={GOLD} />
        </g>
      )
    case 'pin':
      return (
        <g>
          <circle cx="100" cy="100" r="58" fill={GOLD} />
          <circle cx="100" cy="100" r="48" fill={color} />
          <Print x={100} y={108} size={24} color={color} />
          <circle cx="100" cy="122" r="3" fill={GOLD} />
          <ellipse cx="82" cy="72" rx="14" ry="6" fill="#fff" opacity="0.25" transform="rotate(-30 82 72)" />
        </g>
      )
    case 'scarf':
      return (
        <g>
          <path d="M60 40 Q100 66 140 40 L146 58 Q100 88 54 58 Z" fill={color} stroke={dark} strokeWidth="1.5" />
          <path d="M70 62 L64 170 L94 170 L96 72 Z" fill={color} stroke={dark} strokeWidth="1.5" />
          <path d="M66 140 L94 140 M65 152 L94 152" stroke={GOLD} strokeWidth="4" />
          <path d="M64 170 L64 182 M72 170 L72 182 M80 170 L80 182 M88 170 L88 182" stroke={dark} strokeWidth="2" />
        </g>
      )
    case 'usb':
      return (
        <g transform="rotate(-20 100 100)">
          <rect x="88" y="30" width="24" height="30" rx="2" fill="#c7cdd6" stroke="#9aa3b1" />
          <rect x="93" y="38" width="5" height="6" fill="#9aa3b1" />
          <rect x="102" y="38" width="5" height="6" fill="#9aa3b1" />
          <rect x="74" y="58" width="52" height="110" rx="12" fill={color} stroke={dark} strokeWidth="1.5" />
          <g transform="rotate(-90 100 112)">
            <Print x={100} y={119} size={20} color={color} />
          </g>
          <circle cx="100" cy="154" r="5" fill={GOLD} />
        </g>
      )
  }
}

export function ProductArt({
  kind,
  color,
  className,
  rounded = true,
}: {
  kind: ArtKind
  color: string
  className?: string
  rounded?: boolean
}) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', rounded && 'rounded-2xl', className)} style={{ background: artBackdrop(color) }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" role="img" aria-hidden>
        <ellipse cx="100" cy="182" rx="60" ry="7" fill="#0B0F12" opacity="0.08" />
        <Item kind={kind} color={color} />
      </svg>
    </div>
  )
}
