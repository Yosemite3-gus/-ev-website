import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { chat as chatAPI } from '../lib/api'

const presetQuestions = [
  '10万预算买什么电动车？',
  '冬季续航会打几折？',
  '家用充电桩怎么装？',
  '比亚迪和特斯拉怎么选？',
  '电池能用几年？',
  '电动车和燃油车哪个更划算？',
]

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md border border-[#00f0ff]/8 bg-[rgba(8,8,20,0.7)] backdrop-blur-xl">
        {[0, 0.15, 0.3].map((d, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-[#00f0ff]/70 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: d, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ role, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="relative">
        {role === 'assistant' && (
          <svg width="6" height="6" viewBox="0 0 6 6" className="absolute -left-[3px] top-3 text-[#00f0ff]/40">
            <rect width="6" height="6" rx="1" fill="currentColor" />
          </svg>
        )}
        <div
          className={`max-w-[75%] px-6 py-3.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
            role === 'user'
              ? 'bg-[rgba(255,0,110,0.12)] border border-[#ff006e]/15 rounded-br-md text-white/90 backdrop-blur-xl'
              : 'bg-[rgba(8,8,20,0.7)] border border-[#00f0ff]/6 rounded-bl-md text-white/80 backdrop-blur-xl'
          }`}
          style={role === 'user'
            ? { boxShadow: '0 0 24px rgba(255,0,110,0.06)' }
            : { boxShadow: '0 0 16px rgba(0,240,255,0.03)' }
          }
        >
          {text}
        </div>
      </div>
    </motion.div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chat_messages_neon')
      return saved ? JSON.parse(saved) : [
        { role: 'assistant', content: '你好！我是电小助，你的电动车智能选购顾问。有什么可以帮你的？' },
      ]
    } catch { return [{ role: 'assistant', content: '你好！我是电小助，你的电动车智能选购顾问。有什么可以帮你的？' }] }
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('deepseek_api_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(!apiKey && !import.meta.env.VITE_DEEPSEEK_API_KEY)
  const chatEnd = useRef(null)

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { localStorage.setItem('chat_messages_neon', JSON.stringify(messages.slice(-20))) }, [messages])

  const send = useCallback(async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    if (!apiKey && !import.meta.env.VITE_DEEPSEEK_API_KEY) { setShowKeyInput(true); return }

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }))
      const reply = await chatAPI(msg, history)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `出错了：${err.message}` }])
    } finally {
      setLoading(false)
    }
  }, [input, messages, loading, apiKey])

  const saveKey = () => {
    localStorage.setItem('deepseek_api_key', apiKey)
    setShowKeyInput(false)
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: '对话已清空。有什么可以帮你的？' }])
    localStorage.removeItem('chat_messages_neon')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-16 px-10 flex flex-col"
      style={{ maxWidth: 1080, marginLeft: 'auto', marginRight: 'auto', paddingTop: 192 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#00f0ff]/50 mb-4 uppercase">
            AI Interface
          </p>
          <h1 className="text-5xl sm:text-6xl font-display font-black tracking-tight text-white/90">
            智能问答
          </h1>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="text-[11px] font-mono tracking-[0.12em] text-text2/50 hover:text-[#ff006e]/70 transition-colors px-3 py-2 cursor-pointer"
        >
          [ 清空 ]
        </button>
      </motion.div>

      {/* API Key Input */}
      {showKeyInput && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl border border-[#ffde00]/8 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          style={{ background: 'rgba(8,8,16,0.4)' }}
        >
          <div className="flex-1 w-full">
            <p className="text-[11px] font-mono tracking-[0.08em] text-text2/40 mb-2 uppercase">API Key</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-black/30 border border-white/[0.04] rounded-xl px-4 py-2.5 text-sm text-white placeholder-text2/20 focus:outline-none focus:border-[#00f0ff]/30 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
            />
          </div>
          <button
            onClick={saveKey}
            disabled={!apiKey.startsWith('sk-')}
            className="px-6 py-2.5 rounded-xl bg-[#ff006e]/[0.12] border border-[#ff006e]/20 text-[#ff006e]/90 text-sm font-semibold hover:bg-[#ff006e]/[0.18] hover:border-[#ff006e]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            保存
          </button>
        </motion.div>
      )}

      {/* Messages area */}
      <div
        className="relative rounded-2xl border border-white/[0.06] p-10 mb-6 overflow-y-auto space-y-6"
        style={{ maxHeight: 420 }}
        style={{ background: 'rgba(6,6,16,0.5)', backdropFilter: 'blur(16px)' }}
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.content} />
        ))}
        {loading && <TypingDots />}
        <div ref={chatEnd} />
      </div>

      {/* Preset questions */}
      {messages.length <= 1 && (
        <div className="mb-6">
          <p className="text-[10px] font-mono tracking-[0.15em] text-text2/30 mb-4 pl-1 uppercase">Quick Start</p>
          <div className="flex flex-wrap gap-2.5">
            {presetQuestions.map((q) => (
              <motion.button
                key={q}
                onClick={() => send(q)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-[13px] px-5 py-3 rounded-lg border border-white/[0.05] text-text2/45 hover:text-white/70 hover:border-[#00f0ff]/12 hover:bg-[#00f0ff]/[0.02] transition-all"
                style={{ background: 'rgba(8,8,20,0.4)' }}
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-5">
        <div className="flex-1 relative">
          {/* Geometric corner accents */}
          <svg width="20" height="20" viewBox="0 0 20 20" className="absolute top-2 left-2 pointer-events-none text-white/[0.03]">
            <path d="M0 0 L6 0 M0 0 L0 6" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 20 20" className="absolute bottom-2 right-2 pointer-events-none text-white/[0.03]">
            <path d="M20 20 L14 20 M20 20 L20 14" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </svg>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={apiKey || import.meta.env.VITE_DEEPSEEK_API_KEY ? '输入你的问题...' : '请先设置 API Key'}
            className="w-full rounded-xl px-6 py-4 text-sm text-white placeholder-text2/20 focus:outline-none border border-white/[0.04] focus:border-[#00f0ff]/15 transition-all disabled:opacity-40"
            style={{ background: 'rgba(8,8,20,0.6)', backdropFilter: 'blur(12px)' }}
          />
        </div>
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="px-7 py-4 rounded-xl bg-[#ff006e]/[0.12] border border-[#ff006e]/20 text-[#ff006e]/90 font-semibold text-sm hover:bg-[#ff006e]/[0.18] hover:border-[#ff006e]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ boxShadow: '0 0 20px rgba(255,0,110,0.04)' }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-4 h-4 border-2 border-[#ff006e]/30 border-t-[#ff006e]/70 rounded-full"
            />
          ) : (
            <>
              <span className="tracking-[0.06em]">发送</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
