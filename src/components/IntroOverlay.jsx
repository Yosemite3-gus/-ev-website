import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const title = '电小助'
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 3,
}))

export default function IntroOverlay({ onDone }) {
  const [phase, setPhase] = useState('show')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 2800)
    const t2 = setTimeout(() => onDone?.(), 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {phase !== 'hidden' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#020205] overflow-hidden"
        >
          {/* Ambient particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-[#00f0ff]"
                initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
                animate={{ opacity: [0, 0.25, 0] }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ width: p.size, height: p.size, filter: 'blur(0.5px)' }}
              />
            ))}
          </div>

          {/* Subtle radial glow behind logo */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,240,255,0.03) 0%, rgba(255,0,110,0.02) 40%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="text-center relative z-10">
            {/* Logo Mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="relative inline-block mb-8"
            >
              <svg width="128" height="128" viewBox="0 0 96 96" fill="none">
                {/* Outer ring — rotating */}
                <motion.circle
                  cx="48" cy="48" r="42"
                  stroke="rgba(0,240,255,0.08)" strokeWidth="0.6"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '48px 48px' }}
                />
                {/* Middle dashed ring — counter-rotating */}
                <motion.circle
                  cx="48" cy="48" r="34"
                  stroke="rgba(0,240,255,0.15)" strokeWidth="1"
                  strokeDasharray="5 16"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '48px 48px' }}
                />
                {/* Inner ring — pulsing */}
                <motion.circle
                  cx="48" cy="48" r="26"
                  stroke="rgba(255,0,110,0.12)" strokeWidth="0.8"
                  initial={{ scale: 0.9, opacity: 0.3 }}
                  animate={{ scale: [0.9, 1.06, 0.9], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '48px 48px' }}
                />
                {/* Crosshair lines */}
                <line x1="6" y1="48" x2="18" y2="48" stroke="rgba(0,240,255,0.12)" strokeWidth="0.5" />
                <line x1="78" y1="48" x2="90" y2="48" stroke="rgba(0,240,255,0.12)" strokeWidth="0.5" />
                <line x1="48" y1="6" x2="48" y2="18" stroke="rgba(0,240,255,0.12)" strokeWidth="0.5" />
                <line x1="48" y1="78" x2="48" y2="90" stroke="rgba(0,240,255,0.12)" strokeWidth="0.5" />
                {/* Center diamond */}
                <rect x="40" y="40" width="16" height="16" rx="2.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" transform="rotate(45 48 48)" />
                {/* Lightning bolt */}
                <motion.path
                  d="M45 28l-10 26h8l-6 20 22-26h-8l10-20H45z"
                  fill="rgba(0,240,255,0.3)"
                  stroke="rgba(0,240,255,0.55)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  initial={{ opacity: 0.2, filter: 'drop-shadow(0 0 0px rgba(0,240,255,0))' }}
                  animate={{ opacity: [0.2, 0.6, 0.2], filter: ['drop-shadow(0 0 4px rgba(0,240,255,0.2))', 'drop-shadow(0 0 12px rgba(0,240,255,0.4))', 'drop-shadow(0 0 4px rgba(0,240,255,0.2))'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Corner accents */}
                <path d="M0 0h18v0.5H0.5V18H0V0z" fill="rgba(0,240,255,0.1)" />
                <path d="M96 0h-18v0.5h17.5V18H96V0z" fill="rgba(0,240,255,0.1)" />
                <path d="M0 96v-18h0.5V95.5H18V96H0z" fill="rgba(255,0,110,0.1)" />
                <path d="M96 96h-18v-0.5h17.5V78H96v18z" fill="rgba(255,0,110,0.1)" />
              </svg>
            </motion.div>

            {/* Brand name — per-character spring */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
              }}
              className="text-[5.5rem] font-black tracking-[0.06em] leading-none mb-5"
              style={{ fontFamily: "'Orbitron','Microsoft YaHei','PingFang SC',sans-serif" }}
            >
              {title.split('').map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 60, rotateX: 45 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="inline-block"
                  style={{
                    background: 'linear-gradient(180deg, #fff 0%, #00f0ff 45%, #ff006e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(0,240,255,0.3))',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
              className="text-[15px] text-white/40 tracking-[0.1em] mb-8"
              style={{ fontFamily: "'DM Sans','Microsoft YaHei','PingFang SC',sans-serif" }}
            >
              AI 驱动的电动车智能选购平台
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mx-auto w-[200px] h-[1px] relative overflow-hidden rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #00f0ff, #ff006e, transparent)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.4, delay: 1.3, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
