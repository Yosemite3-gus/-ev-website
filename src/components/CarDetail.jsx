import { motion, AnimatePresence } from 'framer-motion'

function ScopeHeader({ brand, type, rating }) {
  const accent = type.includes('SUV') || type.includes('轿跑') ? 'rgba(255,0,110,0.25)' : 'rgba(0,240,255,0.25)'
  const accentSoft = type.includes('SUV') || type.includes('轿跑') ? 'rgba(255,0,110,0.04)' : 'rgba(0,240,255,0.04)'

  return (
    <svg viewBox="0 0 280 120" className="w-full h-32">
      {/* Dot grid */}
      <defs>
        <pattern id="detail-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.4" fill="rgba(255,255,255,0.015)" />
        </pattern>
      </defs>
      <rect width="280" height="120" fill="url(#detail-grid)" />

      {/* Concentric rings */}
      {Array.from({ length: 4 }, (_, i) => (
        <circle
          key={i}
          cx="140" cy="52"
          r={18 + i * 16}
          fill="none"
          stroke={accentSoft}
          strokeWidth="0.5"
          strokeDasharray={i === 0 ? 'none' : i === 1 ? '1 8' : '2 10'}
          opacity={0.7 - i * 0.12}
        />
      ))}

      {/* Crosshair */}
      <line x1="40" y1="52" x2="118" y2="52" stroke={accentSoft} strokeWidth="0.4" opacity="0.35" />
      <line x1="162" y1="52" x2="240" y2="52" stroke={accentSoft} strokeWidth="0.4" opacity="0.35" />
      <line x1="140" y1="4" x2="140" y2="32" stroke={accentSoft} strokeWidth="0.4" opacity="0.35" />
      <line x1="140" y1="72" x2="140" y2="100" stroke={accentSoft} strokeWidth="0.4" opacity="0.35" />

      {/* Center diamond */}
      <rect x="128" y="40" width="24" height="24" rx="3" fill="none" stroke={accent} strokeWidth="0.8" transform="rotate(45 140 52)" opacity="0.45" />

      {/* Rating arc */}
      <circle cx="140" cy="52" r="12" fill="none" stroke={accent} strokeWidth="1"
        strokeDasharray={`${rating / 5 * 75} 75`}
        strokeLinecap="round"
        transform="rotate(-90 140 52)"
        opacity="0.4"
      />

      {/* Brand initial */}
      <text x="140" y="57" textAnchor="middle" fill="rgba(255,255,255,0.45)"
        fontSize="13" fontWeight="700" fontFamily="Orbitron, sans-serif"
        letterSpacing="0.06em">
        {brand === '广汽埃安' ? '埃' : brand[0]}
      </text>
    </svg>
  )
}

export default function CarDetail({ car, onClose }) {
  if (!car) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative rounded-3xl border border-white/[0.07] p-9 sm:p-12 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          style={{
            background: 'rgba(10,10,22,0.85)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 0 80px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-[15%] h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

          {/* Close button with geometric ring */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/[0.05] text-white/25 hover:text-white/60 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Geometric scope header */}
          <div className="mb-7 -mx-2">
            <ScopeHeader brand={car.brand} type={car.type} rating={car.rating} />
          </div>

          {/* Brand + Name */}
          <div className="mb-6">
            <p className="text-[10px] font-mono tracking-[0.18em] text-[#00f0ff]/40 mb-2.5 uppercase">{car.brand}</p>
            <h2 className="text-2xl font-display font-bold tracking-tight text-white/85">{car.name}</h2>
            <p className="text-[#00f0ff]/55 font-semibold text-sm mt-2 font-mono tracking-[0.04em]">{car.price_range}</p>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-7">
            {car.highlights.map((h) => (
              <span
                key={h}
                className="text-[11px] px-2.5 py-1.5 rounded-md text-white/25 border border-white/[0.03]"
                style={{ background: 'rgba(255,255,255,0.015)' }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Spec grid with geometric corner accents */}
          <div className="grid grid-cols-2 gap-3 mb-7">
            {[
              { label: '类型', value: car.type },
              { label: '续航', value: `${car.range_km} km` },
              { label: '电池', value: `${car.battery_kwh} kWh` },
              { label: '功率', value: `${car.power_kw} kW` },
              { label: '快充', value: car.charging_fast },
              { label: '评分', value: `${'★'.repeat(Math.round(car.rating))} ${car.rating}` },
            ].map((s) => (
              <div
                key={s.label}
                className="relative rounded-xl px-4 py-3.5 border border-white/[0.05]"
                style={{ background: 'rgba(255,255,255,0.012)' }}
              >
                {/* Corner dot */}
                <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-white/[0.04]" />
                <p className="text-[10px] font-mono text-text2/30 uppercase tracking-[0.1em] mb-1.5">{s.label}</p>
                <p className="text-[13px] font-medium text-white/70">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Target audience */}
          <div
            className="rounded-xl px-6 py-5 border border-[#00f0ff]/[0.04]"
            style={{ background: 'rgba(0,240,255,0.02)' }}
          >
            <p className="text-[10px] font-mono text-[#00f0ff]/30 uppercase tracking-[0.12em] mb-2">适合人群</p>
            <p className="text-[13px] text-white/55 leading-relaxed">{car.target}</p>
          </div>

          {/* Bottom accent */}
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/[0.015] to-transparent" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
