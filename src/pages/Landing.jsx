import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const brands = ['比亚迪', '特斯拉', '蔚来', '小鹏', '理想', '小米', '极氪', '零跑', '广汽埃安']

const features = [
  {
    title: '智能问答',
    text: '大语言模型驱动，实时解答续航、充电、电池寿命等任何电动车疑问。',
    accent: '#00f0ff',
  },
  {
    title: '车型对比',
    text: '任意两款车型并排对比，关键参数高亮标注，差异一眼看清。',
    accent: '#ff006e',
  },
  {
    title: '个性化推荐',
    text: '输入预算、用途、充电条件，AI 从 16 款车型中精准匹配最佳选择。',
    accent: '#ffde00',
  },
  {
    title: '实时数据',
    text: '覆盖比亚迪、特斯拉、小鹏、蔚来、理想、小米等主流品牌最新车型数据。',
    accent: '#00f0ff',
  },
]

function FeatureIcon({ accent }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="15" stroke={accent} strokeOpacity="0.12" strokeWidth="0.8" />
      <circle cx="18" cy="18" r="9" stroke={accent} strokeOpacity="0.2" strokeWidth="0.6" strokeDasharray="2 5" />
      <circle cx="18" cy="18" r="2.5" fill={accent} fillOpacity="0.5" />
      {/* Crosshair */}
      <line x1="18" y1="4" x2="18" y2="11" stroke={accent} strokeOpacity="0.25" strokeWidth="0.5" />
      <line x1="18" y1="25" x2="18" y2="32" stroke={accent} strokeOpacity="0.25" strokeWidth="0.5" />
      <line x1="4" y1="18" x2="11" y2="18" stroke={accent} strokeOpacity="0.25" strokeWidth="0.5" />
      <line x1="25" y1="18" x2="32" y2="18" stroke={accent} strokeOpacity="0.25" strokeWidth="0.5" />
    </svg>
  )
}

function AnimatedCounter({ end, suffix = '', label = '', delay = 0 }) {
  const ref = useRef(null)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <div
        className="text-6xl sm:text-7xl font-display font-black tracking-tighter"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundImage: 'linear-gradient(180deg, #fff 0%, #00f0ff 60%, #ff006e 100%)',
          filter: 'drop-shadow(0 0 30px rgba(0,240,255,0.2))',
        }}
      >
        {end}{suffix}
      </div>
      <p className="text-[12px] text-text2/60 tracking-[0.08em] mt-3 font-medium">{label}</p>
    </motion.div>
  )
}

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      {/* ═══ HERO ═══ */}
      <section className="min-h-screen w-full flex items-center justify-center text-center px-6 pt-20 pb-16 relative">
        {/* Geometric corner accents */}
        <div className="absolute top-32 left-12 w-20 h-20 opacity-20">
          <svg viewBox="0 0 80 80" fill="none">
            <path d="M0 0h30v1H1v29H0V0z" fill="#00f0ff" />
            <circle cx="40" cy="40" r="38" stroke="#00f0ff" strokeOpacity="0.15" strokeWidth="0.5" strokeDasharray="3 8" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-12 w-24 h-24 opacity-20 rotate-90">
          <svg viewBox="0 0 80 80" fill="none">
            <path d="M0 0h30v1H1v29H0V0z" fill="#ff006e" />
            <circle cx="40" cy="40" r="38" stroke="#ff006e" strokeOpacity="0.15" strokeWidth="0.5" strokeDasharray="3 8" />
          </svg>
        </div>

        <div className="max-w-4xl relative">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border-white/[0.04] mb-16"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]" />
            </span>
            <span className="text-[11px] text-[#00f0ff]/80 tracking-[0.2em] font-mono uppercase">System Online · AI Ready</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="text-5xl sm:text-7xl lg:text-[7.5rem] font-display font-black leading-[1.05] tracking-tight mb-12"
          >
            <span className="text-white/70 font-medium tracking-[0.06em]">选择您的</span>
            <br />
            <span
              className="bg-gradient-to-r from-white via-[#66f0ff] to-[#00f0ff] bg-clip-text text-transparent tracking-[-0.02em]"
              style={{ filter: 'drop-shadow(0 0 50px rgba(0,240,255,0.35))' }}
            >
              DreamCar
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg sm:text-xl text-[#9090a8] max-w-md mx-auto mb-16 leading-relaxed tracking-[0.02em]"
          >
            AI 驱动的电动车智能选购顾问。
            <br />
            从预算到品牌，帮你精准定位。
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex gap-5 justify-center flex-wrap"
          >
            {/* Primary: 开始使用 */}
            <Link
              to="/chat"
              className="group relative inline-flex transition-all duration-500 hover:-translate-y-0.5"
            >
              {/* Gradient ring border */}
              <span className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#00f0ff]/50 via-[#ff006e]/40 to-[#00f0ff]/50 opacity-70 blur-[1px] group-hover:opacity-100 group-hover:blur-[2px] transition-all duration-500" />
              <span className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#00f0ff]/30 via-white/20 to-[#ff006e]/30 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Button body */}
              <span className="relative flex items-center gap-3 px-12 py-5 rounded-xl bg-white/95 backdrop-blur-sm text-[#020205] font-semibold text-[16px] tracking-[0.04em] shadow-[0_0_30px_rgba(0,240,255,0.12)] group-hover:shadow-[0_0_50px_rgba(0,240,255,0.25)] transition-all duration-500">
                开始使用
                <svg className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            {/* Secondary: 浏览车型 */}
            <Link
              to="/cars"
              className="group relative inline-flex transition-all duration-500 hover:-translate-y-0.5"
            >
              {/* Hover glow */}
              <span className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#00f0ff]/0 via-[#00f0ff]/0 to-[#00f0ff]/0 group-hover:from-[#00f0ff]/20 group-hover:via-[#00f0ff]/10 group-hover:to-[#ff006e]/15 opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-500" />
              {/* Button body */}
              <span className="relative flex items-center gap-2.5 px-12 py-5 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/10 text-white/60 font-medium text-[16px] tracking-[0.04em] group-hover:border-[#00f0ff]/25 group-hover:text-white/90 group-hover:bg-white/[0.06] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.08)] transition-all duration-500">
                浏览车型
                <svg className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-24"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="w-[1px] h-10 bg-gradient-to-b from-[#00f0ff]/40 to-transparent mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ BRAND STRIP ═══ */}
      <section className="px-10 py-20 border-t border-b border-white/[0.025]" style={{ maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-text2/30 mb-12 font-mono">
          Supported Brands
        </p>
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-5">
          {brands.map((b) => (
            <span
              key={b}
              className="text-text2/25 text-sm font-medium hover:text-[#00f0ff]/60 transition-all duration-500 cursor-default tracking-[0.08em]"
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="px-10 py-44" style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-28 text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#00f0ff]/50 mb-7 uppercase">
            Core Capabilities
          </p>
          <h2 className="text-5xl sm:text-6xl font-display font-black mb-7 tracking-tight text-white/90">
            为什么选择电小助
          </h2>
          <p className="text-text2/60 text-lg max-w-xl mx-auto leading-relaxed">
            四个维度，覆盖从选车到决策的全流程。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-9 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 flex flex-col"
              style={{ background: 'rgba(8,8,16,0.5)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(10,10,20,0.8)'
                e.currentTarget.style.boxShadow = `0 0 40px ${f.accent}08, 0 8px 32px rgba(0,0,0,0.4)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(8,8,16,0.5)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Top accent dot */}
              <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-500" style={{ background: f.accent }} />

              <div className="mb-8">
                <FeatureIcon accent={f.accent} />
              </div>
              <h3 className="font-display font-bold text-[15px] mb-4 tracking-[0.04em] text-white/85">{f.title}</h3>
              <p className="text-text2/65 text-[14px] leading-relaxed tracking-[0.02em]">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="px-10 py-44" style={{ maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative grid grid-cols-2 lg:grid-cols-4 gap-12 rounded-3xl px-16 py-24 overflow-hidden"
          style={{ background: 'rgba(8,8,16,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l border-t border-[#00f0ff]/[0.06] rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-[#ff006e]/[0.06] rounded-br-3xl" />

          {[
            { end: 16, label: '热门车型', suffix: '+' },
            { end: 3, label: '智能模块' },
            { end: 0, label: '厂商赞助' },
            { end: 100, label: 'AI 驱动', suffix: '%' },
          ].map((s, i) => (
            <AnimatedCounter key={s.label} end={s.end} suffix={s.suffix || ''} label={s.label} delay={i * 0.12} />
          ))}
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="px-10 py-44" style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-28"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#ff006e]/50 mb-7 uppercase">Process</p>
          <h2 className="text-5xl sm:text-6xl font-display font-black mb-6 tracking-tight text-white/90">
            三步找到你的车
          </h2>
          <p className="text-text2/60 text-lg">无需注册，打开即用。</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          {[
            { step: '1', title: '提出需求', desc: '告诉 AI 你的预算、用途、偏好，或者直接提问。', color: '#00f0ff' },
            { step: '2', title: '智能分析', desc: 'AI 结合 16 款车型数据和知识库，给出专业建议。', color: '#ffde00' },
            { step: '3', title: '做出决策', desc: '查看对比结果，选出最适合你的那一辆。', color: '#ff006e' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center group flex flex-col items-center"
            >
              {/* Step number — large, subtle */}
              <div className="relative mb-10">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center font-display text-2xl font-black"
                  style={{
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}20`,
                    color: s.color,
                    boxShadow: `0 0 30px ${s.color}08`,
                  }}
                >
                  {s.step}
                </div>
                {/* Outer ring */}
                <svg
                  className="absolute -inset-4 w-[112px] h-[112px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  viewBox="0 0 112 112" fill="none"
                >
                  <circle cx="56" cy="56" r="52" stroke={s.color} strokeOpacity="0.1" strokeWidth="0.6" strokeDasharray="4 16" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-3 tracking-[0.04em] text-white/80">{s.title}</h3>
              <p className="text-text2/60 text-[14px] leading-relaxed max-w-[220px] mx-auto">{s.desc}</p>

              {/* Connector arrow */}
              {i < 2 && (
                <div className="hidden md:block absolute top-10 -right-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/[0.06]">
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="px-10 pt-44 pb-44" style={{ maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl px-12 py-32 text-center overflow-hidden"
          style={{ background: 'rgba(8,8,16,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Subtle glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] -top-40 -right-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 60%)' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] -bottom-32 -left-32 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,0,110,0.03) 0%, transparent 60%)' }} />

          {/* Geometric accent lines */}
          <div className="absolute top-8 left-8 w-10 h-10 border-l border-t border-[#00f0ff]/[0.08] rounded-tl-lg" />
          <div className="absolute bottom-8 right-8 w-10 h-10 border-r border-b border-[#ff006e]/[0.08] rounded-br-lg" />

          <h2 className="relative text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-10 tracking-tight text-white/90 leading-[1.15]">
            准备好找到
            <br />
            <span
              className="bg-gradient-to-r from-[#00f0ff] to-[#ff006e] bg-clip-text text-transparent"
              style={{ filter: 'drop-shadow(0 0 25px rgba(0,240,255,0.25))' }}
            >
              你的那一辆
            </span>
            了吗？
          </h2>
          <p className="relative text-text2/60 text-lg mb-14 max-w-md mx-auto leading-relaxed">
            让 AI 帮你从 16 款热门电动车中，精准定位最合适的选择。
          </p>
          <Link
            to="/chat"
            className="relative inline-flex items-center gap-3 px-14 py-5 rounded-xl bg-white text-[#020205] font-semibold text-[15px] hover:shadow-[0_0_48px_rgba(0,240,255,0.25)] hover:-translate-y-0.5 transition-all duration-300 tracking-[0.04em]"
          >
            免费开始
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </section>
    </motion.div>
  )
}
