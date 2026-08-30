import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/chatStore'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import InputBar from './InputBar'
import { sendMessage, updateSessionTitle } from '../services/api'
import toast from 'react-hot-toast'

export default function ChatWindow() {
  const { activeSession, messages, isTyping, addMessage, setTyping, updateSessionTitle: updateTitle } = useChatStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (text) => {
  if (!activeSession) return toast.error('Create a new chat first')

  const isFirst = messages.length === 0
  addMessage({ role: 'user', content: text })
  setTyping(true)

  try {
    const res = await sendMessage(text, activeSession.id)
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
    addMessage({ role: 'assistant', content: 'Something went wrong. Please try again.' })
  } finally {
    setTyping(false)
  }
}

  if (!activeSession) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', gap: '16px', padding: '40px'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'var(--bg-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', border: '1px solid var(--border)'
        }}>🎬</div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Welcome to CineChat
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Click <strong style={{ color: 'var(--accent)' }}>New Chat</strong> in the sidebar to start a conversation
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Session title bar */}
      <div style={{
        padding: '14px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {activeSession.title || 'New Chat'}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>💬</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Type a message below to begin</p>
          </div>
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        )}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <InputBar onSend={handleSend} disabled={isTyping} />
    </div>
  )
}