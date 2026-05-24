import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Navbar from './components/Navbar'
import IntroOverlay from './components/IntroOverlay'
import BackgroundPaths from './components/ui/BackgroundPaths'
import Landing from './pages/Landing'
import Cars from './pages/Cars'
import Chat from './pages/Chat'
import Compare from './pages/Compare'

export default function App() {
  const location = useLocation()
  const [introDone, setIntroDone] = useState(() => {
    return sessionStorage.getItem('intro_done') === 'true'
  })

  return (
    <div className="relative min-h-screen">
      {!introDone && (
        <IntroOverlay onDone={() => {
          setIntroDone(true)
          sessionStorage.setItem('intro_done', 'true')
        }} />
      )}

      {/* Ambient glow orbs — subtle, behind everything */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute w-[800px] h-[800px] rounded-full -top-48 -left-48"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 65%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full -bottom-60 -right-32"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,110,0.035) 0%, transparent 65%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute w-[400px] h-[600px] rounded-full top-1/3 -left-32 rotate-12"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,240,255,0.025) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <BackgroundPaths />
      <Navbar />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 text-center py-12 border-t border-white/[0.03]">
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/15 to-transparent" />
        <div className="px-10 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ maxWidth: 1080, marginLeft: 'auto', marginRight: 'auto' }}>
          <p className="text-[#4a4a62] text-xs tracking-wider">
            &copy; 2026 电小助 · AI 驱动的电动车智能选购平台
          </p>
          <div className="flex gap-8 text-[#3a3a52] text-[11px] tracking-[0.12em]">
            <span>智能问答</span>
            <span>车型对比</span>
            <span>购车推荐</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
