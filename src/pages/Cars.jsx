import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cars as allCars } from '../data/cars'
import CarDetail from '../components/CarDetail'

const brandFilters = ['全部', '比亚迪', '特斯拉', '蔚来', '小鹏', '理想', '小米', '极氪', '零跑', '广汽埃安']
const priceFilters = [
  { key: 'all', label: '全部价位' },
  { key: '0-10', label: '10万以下' },
  { key: '10-15', label: '10-15万' },
  { key: '15-25', label: '15-25万' },
  { key: '25+', label: '25万+' },
]

function CardScope({ brand, type, rating }) {
  const accent = type.includes('SUV') || type.includes('轿跑') ? 'rgba(255,0,110,0.3)' : 'rgba(0,240,255,0.3)'
  const accentSoft = type.includes('SUV') || type.includes('轿跑') ? 'rgba(255,0,110,0.06)' : 'rgba(0,240,255,0.06)'
  const rings = type.includes('增程') ? 4 : type.includes('SUV') ? 3 : 2

  return (
    <svg viewBox="0 0 200 140" className="w-full h-full absolute inset-0">
      {/* Subtle grid */}
      <defs>
        <pattern id={`grid-${brand}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.012)" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="200" height="140" fill={`url(#grid-${brand})`} />

      {/* Concentric scope rings */}
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx="100" cy="58"
          r={22 + i * 18}
          fill="none"
          stroke={accentSoft}
          strokeWidth="0.5"
          strokeDasharray={i === 0 ? 'none' : '2 6'}
          opacity={0.8 - i * 0.15}
        />
      ))}

      {/* Crosshair lines */}
      <line x1="20" y1="58" x2="78" y2="58" stroke={accentSoft} strokeWidth="0.4" opacity="0.4" />
      <line x1="122" y1="58" x2="180" y2="58" stroke={accentSoft} strokeWidth="0.4" opacity="0.4" />
      <line x1="100" y1="0" x2="100" y2="36" stroke={accentSoft} strokeWidth="0.4" opacity="0.4" />
      <line x1="100" y1="80" x2="100" y2="118" stroke={accentSoft} strokeWidth="0.4" opacity="0.4" />

      {/* Center diamond */}
      <rect x="88" y="46" width="24" height="24" rx="3" fill="none" stroke={accent} strokeWidth="0.8" transform="rotate(45 100 58)" opacity="0.5" />

      {/* Rating arc */}
      <circle cx="100" cy="58" r="14" fill="none" stroke={accent} strokeWidth="1.2"
        strokeDasharray={`${rating / 5 * 88} 88`}
        strokeLinecap="round"
        transform="rotate(-90 100 58)"
        opacity="0.5"
      />

      {/* Brand initial in center */}
      <text x="100" y="63" textAnchor="middle" fill="rgba(255,255,255,0.5)"
        fontSize="14" fontWeight="700" fontFamily="Orbitron, sans-serif"
        letterSpacing="0.06em">
        {brand === '广汽埃安' ? '埃' : brand[0]}
      </text>
    </svg>
  )
}

export default function Cars() {
  const [brand, setBrand] = useState('全部')
  const [price, setPrice] = useState('all')
  const [detailCar, setDetailCar] = useState(null)
  const navigate = useNavigate()

  const filtered = allCars.filter((c) => {
    if (brand !== '全部' && c.brand !== brand) return false
    if (price !== 'all') {
      const p = c.price_min
      const ranges = {
        '0-10': p < 10,
        '10-15': p >= 10 && p < 15,
        '15-25': p >= 15 && p < 25,
        '25+': p >= 25,
      }
      if (!ranges[price]) return false
    }
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-36 px-10"
      style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', paddingTop: 192 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#00f0ff]/50 mb-5 uppercase">
            Vehicle Database
          </p>
          <h1 className="text-5xl sm:text-6xl font-display font-black mb-5 tracking-tight text-white/90">
          探索热门电动车
        </h1>
        <p className="text-text2/50 text-lg">
          {allCars.length} 款主流车型 &nbsp;&middot;&nbsp;
          <span className="text-[#00f0ff]/70 font-mono">{filtered.length}</span> 款匹配
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-16 p-6 rounded-2xl border border-white/[0.05]"
        style={{ background: 'rgba(8,8,16,0.4)' }}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[10px] font-mono tracking-[0.15em] text-text2/30 mr-4 uppercase">Brand</span>
          {brandFilters.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300 ${
                brand === b
                  ? 'bg-[#00f0ff]/[0.08] text-white border border-[#00f0ff]/20'
                  : 'text-text2/40 hover:text-white/70 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.15em] text-text2/30 mr-4 uppercase">Price</span>
          {priceFilters.map((r) => (
            <button
              key={r.key}
              onClick={() => setPrice(r.key)}
              className={`px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300 ${
                price === r.key
                  ? 'bg-[#ff006e]/[0.08] text-white border border-[#ff006e]/20'
                  : 'text-text2/40 hover:text-white/70 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              {r.label}
            </button>
          ))}
          {(brand !== '全部' || price !== 'all') && (
            <button
              onClick={() => { setBrand('全部'); setPrice('all') }}
              className="ml-3 px-3 py-2.5 rounded-lg text-[11px] text-text2/25 hover:text-[#ffde00]/60 border border-transparent hover:border-[#ffde00]/10 transition-all"
            >
              重置筛选
            </button>
          )}
        </div>
      </motion.div>

      {/* Car Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group cursor-pointer rounded-2xl border border-white/[0.05] overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
              style={{ background: 'rgba(8,8,16,0.4)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,240,255,0.1)'
                e.currentTarget.style.boxShadow = '0 0 60px rgba(0,240,255,0.04), 0 12px 40px rgba(0,0,0,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.boxShadow = ''
              }}
              onClick={() => setDetailCar(c)}
            >
              {/* Top: Car image with geometric fallback */}
              <div className="h-48 relative overflow-hidden bg-surface">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <CardScope brand={c.brand} type={c.type} rating={c.rating} />

                {/* Price badge — top right */}
                <span className="absolute top-3 right-3 text-[11px] font-mono font-medium bg-black/70 backdrop-blur-md text-white/80 px-3 py-1.5 rounded-lg border border-white/[0.04] tracking-[0.04em]">
                  {c.price_range}
                </span>

                {/* Rating badge — top left */}
                <span className="absolute top-3 left-3 text-[11px] font-mono font-bold bg-black/60 backdrop-blur-md text-[#ffde00]/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-[#ffde00]/[0.08]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {c.rating}
                </span>
              </div>

              {/* Bottom: Info */}
              <div className="p-7">
                <p className="text-[11px] text-[#00f0ff]/60 font-mono font-medium mb-3 tracking-[0.08em]">{c.brand}</p>
                <h3 className="font-bold text-[16px] mb-5 tracking-[0.02em] text-white/80 group-hover:text-white transition-colors">{c.name}</h3>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {c.highlights.slice(0, 3).map((t) => (
                    <span key={t} className="text-[12px] px-2.5 py-1.5 rounded-md text-white/40 border border-white/[0.04] group-hover:text-white/60 group-hover:border-white/[0.08] transition-all">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Specs row */}
                <div className="flex items-center gap-5 text-[12px] text-white/40 font-mono mb-5">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#00f0ff]/30" />
                    {c.range_km} km
                  </span>
                  <span>{c.battery_kwh} kWh</span>
                  <span>{c.power_kw} kW</span>
                </div>

                {/* Compare CTA */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/compare?car=${encodeURIComponent(c.name)}`)
                  }}
                  className="w-full py-3 rounded-lg text-[13px] font-medium text-white/35 hover:text-[#00f0ff]/60 hover:bg-[#00f0ff]/[0.03] border border-transparent hover:border-[#00f0ff]/10 transition-all tracking-[0.04em]"
                >
                  加入对比 &rarr;
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-white/[0.03] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/10">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="text-text2/20 text-lg mb-8 tracking-[0.04em]">没有找到匹配的车型</p>
          <button
            onClick={() => { setBrand('全部'); setPrice('all') }}
            className="px-6 py-3 rounded-xl border border-[#00f0ff]/10 text-[#00f0ff]/40 text-sm hover:text-[#00f0ff]/70 hover:bg-[#00f0ff]/[0.03] transition-all tracking-[0.04em]"
          >
            重置筛选条件
          </button>
        </motion.div>
      )}

      {detailCar && <CarDetail car={detailCar} onClose={() => setDetailCar(null)} />}
    </motion.div>
  )
}
