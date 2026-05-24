import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: '首页' },
  { to: '/cars', label: '车型浏览' },
  { to: '/chat', label: 'AI 对话' },
  { to: '/compare', label: '车型对比' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong py-2.5'
          : 'py-4'
      }`}
    >
      {/* Border accent line */}
      {scrolled && (
        <div className="absolute bottom-0 inset-x-[20%] h-px bg-gradient-to-r from-transparent via-[#00f0ff]/15 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          {/* Geometric logo mark */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="transition-transform duration-500 group-hover:scale-110">
              <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              <circle cx="16" cy="16" r="9" stroke="rgba(0,240,255,0.15)" strokeWidth="0.6" strokeDasharray="2 6" />
              <path d="M15 6l-4 12h4l-3 10 10-12h-4l4-10H15z" fill="rgba(0,240,255,0.55)" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-display text-lg font-black tracking-[0.08em] bg-gradient-to-r from-white via-[#e0e0ff] to-[#8888aa] bg-clip-text text-transparent">
            电小助
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-7 py-2.5 text-[15px] font-medium tracking-[0.04em] transition-colors duration-300 ${
                pathname === to
                  ? 'text-white'
                  : 'text-[#707088] hover:text-[#b0b0c0]'
              }`}
            >
              {label}
              {pathname === to && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#00f0ff] rounded-full"
                  style={{ boxShadow: '0 0 6px rgba(0,240,255,0.5)' }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/chat"
          className="hidden md:flex items-center gap-2.5 px-7 py-2.5 text-[15px] font-semibold tracking-[0.04em] rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 hover:text-white hover:border-[#00f0ff]/25 hover:bg-[#00f0ff]/[0.04] transition-all duration-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" style={{ boxShadow: '0 0 6px rgba(0,240,255,0.6)' }} />
          开始使用
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1.5 glass-strong mx-4 rounded-2xl border-white/[0.04]">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-[16px] font-medium transition-all ${
                    pathname === to
                      ? 'text-white bg-white/[0.04]'
                      : 'text-[#808098] hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/chat"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center px-5 py-3 rounded-lg bg-[#00f0ff]/[0.08] border border-[#00f0ff]/15 text-white text-sm font-semibold"
              >
                开始使用
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
