import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cars } from '../data/cars'
import { compareCars as compareCarsAPI } from '../lib/api'

const presets = [
  { label: 'Model 3 vs 小米 SU7', a: '特斯拉 Model 3', b: '小米 SU7' },
  { label: '海豚 vs 埃安 Y Plus', a: '比亚迪 海豚', b: '广汽埃安 Y Plus' },
  { label: '理想 L7 vs 蔚来 ES6', a: '理想 L7', b: '蔚来 ES6' },
  { label: '汉EV vs 小鹏 G6', a: '比亚迪 汉EV', b: '小鹏 G6' },
]

const specDefs = [
  { key: 'price_range', label: '价格' },
  { key: 'range_km', label: '续航', unit: 'km' },
  { key: 'battery_kwh', label: '电池容量', unit: 'kWh' },
  { key: 'power_kw', label: '电机功率', unit: 'kW' },
  { key: 'charging_fast', label: '快充' },
  { key: 'type', label: '车型' },
  { key: 'rating', label: '评分' },
]

function isBetterValue(key, valA, valB) {
  if (key === 'price_range' || key === 'charging_fast' || key === 'type') return null
  const a = parseFloat(valA)
  const b = parseFloat(valB)
  if (isNaN(a) || isNaN(b)) return null
  return a > b ? 'a' : b > a ? 'b' : null
}

function VSBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3, type: 'spring', stiffness: 250 }}
      className="flex justify-center lg:block"
    >
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        {/* Outer ring */}
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
          <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeDasharray="3 8" />
          {/* Crosshair ticks */}
          <line x1="40" y1="2" x2="40" y2="10" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <line x1="40" y1="70" x2="40" y2="78" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <line x1="2" y1="40" x2="10" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <line x1="70" y1="40" x2="78" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          {/* Center diamond */}
          <rect x="32" y="32" width="16" height="16" rx="2" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" transform="rotate(45 40 40)" />
        </svg>
        {/* VS text */}
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="font-display font-black text-sm tracking-[0.12em] text-white/50 relative z-10"
        >
          VS
        </motion.span>
      </div>
    </motion.div>
  )
}

function SpecRow({ spec, valueA, valueB, aBetter, bBetter }) {
  return (
    <div className="flex justify-between py-4 border-b border-white/[0.04] text-[14px] items-center">
      <span className="text-text2/60 text-[14px]">{spec.label}</span>
      <div className="flex items-center gap-5">
        <span className={`font-mono text-[14px] font-medium tabular-nums ${aBetter ? 'text-[#00f0ff]/80' : 'text-white/60'}`}>
          {aBetter && (
            <span className="inline-block w-1 h-1 rounded-full bg-[#00f0ff]/50 mr-1.5 align-middle" />
          )}
          {valueA}{spec.unit || ''}
        </span>
        <span className={`font-mono text-[14px] font-medium tabular-nums ${bBetter ? 'text-[#ff006e]/80' : 'text-white/60'}`}>
          {bBetter && (
            <span className="inline-block w-1 h-1 rounded-full bg-[#ff006e]/50 mr-1.5 align-middle" />
          )}
          {valueB}{spec.unit || ''}
        </span>
      </div>
    </div>
  )
}

export default function Compare() {
  const [searchParams] = useSearchParams()
  const [carA, setCarA] = useState(() => {
    const c = searchParams.get('car')
    return c && cars.some((x) => x.name === c) ? c : cars[0].name
  })
  const [carB, setCarB] = useState(cars[1].name)
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('deepseek_api_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(false)

  const dataA = cars.find((c) => c.name === carA)
  const dataB = cars.find((c) => c.name === carB)

  const runCompare = async () => {
    if (!apiKey && !import.meta.env.VITE_DEEPSEEK_API_KEY) { setShowKeyInput(true); return }
    setAiLoading(true)
    setAiSummary('')
    try {
      const result = await compareCarsAPI([carA, carB])
      setAiSummary(result)
    } catch (err) {
      setAiSummary(`对比失败：${err.message}`)
    } finally {
      setAiLoading(false)
    }
  }

  const panelBase = 'relative rounded-2xl border border-white/[0.1] p-9 sm:p-12'
  const panelBg = { background: 'rgba(10,10,22,0.6)', backdropFilter: 'blur(12px)' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-36 px-10"
      style={{ maxWidth: 1080, marginLeft: 'auto', marginRight: 'auto', paddingTop: 328 }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#ff006e]/50 mb-5 uppercase">
          Head to Head
        </p>
        <h1 className="text-5xl sm:text-6xl font-display font-black mb-4 tracking-tight text-white/90">
          一对比，高下立判
        </h1>
        <p className="text-text2/50 text-lg mb-16">
          选择两款车型，关键参数并排展示，差异一目了然。
        </p>
      </motion.div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {presets.map((p) => {
          const active = carA === p.a && carB === p.b
          return (
            <button
              key={p.label}
              onClick={() => { setCarA(p.a); setCarB(p.b); setAiSummary('') }}
              className={`text-[13px] px-5 py-3 rounded-lg transition-all duration-300 ${
                active
                  ? 'text-white border border-[#ff006e]/15'
                  : 'text-text2/35 hover:text-white/60 border border-transparent hover:border-white/[0.04]'
              }`}
              style={active
                ? { background: 'rgba(255,0,110,0.06)', boxShadow: '0 0 16px rgba(255,0,110,0.04)' }
                : { background: 'rgba(8,8,20,0.3)' }
              }
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-16 items-start mb-20">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={panelBase}
          style={{
            ...panelBg,
            boxShadow: '0 0 30px rgba(0,240,255,0.03)',
            borderColor: 'rgba(0,240,255,0.06)',
          }}
        >
          {/* Panel top accent */}
          <div className="absolute top-0 inset-x-[20%] h-px bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent" />

          <select
            value={carA}
            onChange={(e) => { setCarA(e.target.value); setAiSummary('') }}
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-5 py-4 text-sm text-white/80 mb-8 focus:outline-none focus:border-[#00f0ff]/30 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(0,240,255,0.06)] transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
            }}
          >
            {cars.map((c) => (
              <option key={c.name} value={c.name} className="bg-[#0a0a18] text-white/80">
                {c.name}
              </option>
            ))}
          </select>
          {dataA && (
            <>
              <h3 className="text-xl font-display font-bold mb-1.5 tracking-tight text-white/80">{dataA.name}</h3>
              <p className="text-[#00f0ff]/60 font-semibold text-sm mb-10 font-mono tracking-[0.04em]">{dataA.price_range}</p>
              {specDefs.map((spec) => {
                const better = isBetterValue(spec.key, dataA[spec.key], dataB?.[spec.key])
                return (
                  <SpecRow
                    key={spec.key}
                    spec={spec}
                    valueA={dataA[spec.key]}
                    valueB={dataB?.[spec.key]}
                    aBetter={better === 'a'}
                    bBetter={better === 'b'}
                  />
                )
              })}
            </>
          )}
        </motion.div>

        {/* VS Badge */}
        <VSBadge />

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={panelBase}
          style={{
            ...panelBg,
            boxShadow: '0 0 30px rgba(255,0,110,0.03)',
            borderColor: 'rgba(255,0,110,0.06)',
          }}
        >
          {/* Panel top accent */}
          <div className="absolute top-0 inset-x-[20%] h-px bg-gradient-to-r from-transparent via-[#ff006e]/8 to-transparent" />

          <select
            value={carB}
            onChange={(e) => { setCarB(e.target.value); setAiSummary('') }}
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-5 py-4 text-sm text-white/80 mb-8 focus:outline-none focus:border-[#ff006e]/30 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(255,0,110,0.06)] transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
            }}
          >
            {cars.map((c) => (
              <option key={c.name} value={c.name} className="bg-[#0a0a18] text-white/80">
                {c.name}
              </option>
            ))}
          </select>
          {dataB && (
            <>
              <h3 className="text-xl font-display font-bold mb-1.5 tracking-tight text-white/80">{dataB.name}</h3>
              <p className="text-[#ff006e]/50 font-semibold text-sm mb-10 font-mono tracking-[0.04em]">{dataB.price_range}</p>
              {specDefs.map((spec) => {
                const better = isBetterValue(spec.key, dataB[spec.key], dataA?.[spec.key])
                return (
                  <SpecRow
                    key={spec.key}
                    spec={spec}
                    valueA={dataA?.[spec.key]}
                    valueB={dataB[spec.key]}
                    aBetter={better === 'b'}
                    bBetter={better === 'a'}
                  />
                )
              })}
            </>
          )}
        </motion.div>
      </div>

      {/* AI Compare CTA */}
      <div className="text-center mb-16">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runCompare}
          disabled={aiLoading}
          className="px-12 py-5 rounded-xl border border-[#ff006e]/15 text-[#ff006e]/80 text-sm font-semibold tracking-[0.04em] hover:border-[#ff006e]/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255,0,110,0.06)',
            boxShadow: '0 0 24px rgba(255,0,110,0.04)',
          }}
        >
          {aiLoading ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-4 h-4 border-2 border-[#ff006e]/30 border-t-[#ff006e]/70 rounded-full inline-block"
              />
              分析中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              AI 对比分析
            </span>
          )}
        </motion.button>
      </div>

      {/* API Key Input */}
      {showKeyInput && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto mb-16 p-5 rounded-2xl border border-[#ffde00]/8 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
          style={{ background: 'rgba(8,8,16,0.4)' }}
        >
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="flex-1 bg-black/30 border border-white/[0.04] rounded-xl px-4 py-2.5 text-sm text-white placeholder-text2/20 focus:outline-none focus:border-[#00f0ff]/30"
            onKeyDown={(e) => {
              if (e.key === 'Enter') { localStorage.setItem('deepseek_api_key', apiKey); setShowKeyInput(false) }
            }}
          />
          <button
            onClick={() => { localStorage.setItem('deepseek_api_key', apiKey); setShowKeyInput(false) }}
            disabled={!apiKey.startsWith('sk-')}
            className="px-6 py-2.5 rounded-xl bg-[#ff006e]/[0.12] border border-[#ff006e]/20 text-[#ff006e]/90 text-sm font-semibold disabled:opacity-30 shrink-0"
          >
            保存 Key
          </button>
        </motion.div>
      )}

      {/* AI Summary */}
      {aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto rounded-2xl border border-[#00f0ff]/6 p-10"
          style={{
            background: 'rgba(8,8,20,0.5)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 30px rgba(0,240,255,0.03)',
          }}
        >
          {/* Header with geometric icon */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="rgba(0,240,255,0.08)" strokeWidth="0.6" />
                <circle cx="20" cy="20" r="10" stroke="rgba(0,240,255,0.12)" strokeWidth="0.5" strokeDasharray="2 5" />
                <path d="M19 8l-5 14h5l-4 12 12-14h-5l5-12H19z" fill="rgba(0,240,255,0.25)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-white/80 tracking-[0.04em]">AI 对比分析</p>
              <p className="text-[10px] font-mono text-text2/25 tracking-[0.08em]">DeepSeek</p>
            </div>
          </div>
          <div className="text-[14px] leading-relaxed text-white/60 whitespace-pre-wrap">{aiSummary}</div>
        </motion.div>
      )}
    </motion.div>
  )
}
