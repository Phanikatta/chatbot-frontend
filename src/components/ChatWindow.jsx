import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/chatStore'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import InputBar from './InputBar'
import { sendMessage, updateSessionTitle } from '../services/api'
import toast from 'react-hot-toast'

export default function ChatWindow() {
  const {
  activeSession,
  messages,
  isTyping,
  addMessage,
  setTyping,
  updateSessionTitle: updateTitle,
  systemPrompt
} = useChatStore()

  const bottomRef = useRef(null)

  // ── Export state ──────────────────────────────────────────
  const [showExport, setShowExport] = useState(false)

  // ── Close export dropdown on outside click ────────────────
  useEffect(() => {
    const handler = () => { if (showExport) setShowExport(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showExport])

  // ── Auto scroll to bottom ─────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── Export logic ──────────────────────────────────────────
  const exportChat = (format) => {
    const title = activeSession?.title || 'chat'
    const date = new Date().toLocaleDateString()

    const content = messages.map(m => {
      const role = m.role === 'user' ? 'You' : 'AI'
      return format === 'md'
        ? `**${role}:** ${m.content}`
        : `${role}: ${m.content}`
    }).join('\n\n')

    const header = format === 'md'
      ? `# ${title}\n*Exported from CineChat on ${date}*\n\n---\n\n`
      : `${title}\nExported from CineChat on ${date}\n${'─'.repeat(40)}\n\n`

    const fullContent = header + content

    if (format === 'copy') {
      navigator.clipboard.writeText(fullContent)
      toast.success('Chat copied to clipboard!')
      return
    }

    const blob = new Blob([fullContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.slice(0, 30).replace(/\s+/g, '-')}.${format}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded as .${format}`)
  }

  // ── Send message ──────────────────────────────────────────
  const handleSend = async (text) => {
    if (!activeSession) return toast.error('Create a new chat first')

    const isFirst = messages.length === 0
    addMessage({ role: 'user', content: text })
    setTyping(true)

    try {
      const res = await sendMessage(text, activeSession.id, systemPrompt)
      addMessage({ role: 'assistant', content: res.data.response })

      if (isFirst) {
        const title = text.slice(0, 50)
        setTimeout(async () => {
          try {
            await updateSessionTitle(activeSession.id, title)
            updateTitle(activeSession.id, title)
          } catch (e) {
            console.error('Title update failed:', e)
          }
        }, 500)
      }
    } catch (err) {
      toast.error('Failed to get response')
      addMessage({
        role: 'assistant',
        content: 'Something went wrong. Please try again.'
      })
    } finally {
      setTyping(false)
    }
  }

  // ── No session selected ───────────────────────────────────
  if (!activeSession) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        gap: '16px',
        padding: '40px'
      }}>
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          border: '1px solid var(--border)'
        }}>
          🎬
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '22px', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: '8px'
          }}>
            Welcome to CineChat
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Click <strong style={{ color: 'var(--accent)' }}>New Chat</strong> in
            the sidebar to start a conversation
          </p>
        </div>
      </div>
    )
  }

  // ── Main chat view ────────────────────────────────────────
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>

      {/* ── Title bar ── */}
      <div style={{
        padding: '14px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: '14px', fontWeight: 600,
          color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', flex: 1, marginRight: '12px'
        }}>
          {activeSession.title || 'New Chat'}
        </span>

        {/* Export button */}
        {messages.length > 0 && (
          <div
            style={{ position: 'relative' }}
            onClick={e => e.stopPropagation()} // prevent outside-click handler
          >
            <button
              onClick={() => setShowExport(!showExport)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>

            {/* Export dropdown */}
            {showExport && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '180px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                zIndex: 50
              }}>
                {[
                  { label: '📄 Download .txt', fn: () => exportChat('txt') },
                  { label: '📝 Download .md',  fn: () => exportChat('md')  },
                  { label: '📋 Copy all',       fn: () => exportChat('copy')},
                ].map(({ label, fn }, i, arr) => (
                  <button
                    key={label}
                    onClick={() => { fn(); setShowExport(false) }}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      background: 'none',
                      border: 'none',
                      borderBottom: i < arr.length - 1
                        ? '1px solid var(--border)' : 'none',
                      textAlign: 'left',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: '12px'
          }}>
            <div style={{ fontSize: '32px' }}>💬</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Type a message below to begin
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))
        )}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <InputBar onSend={handleSend} disabled={isTyping} />
    </div>
  )
}