import { useState } from 'react'
import { useChatStore } from '../store/chatStore'
import { createSession, getHistory } from '../services/api'
import toast from 'react-hot-toast'

export default function Sidebar({ open, onClose }) {
  const { sessions, activeSession, addSession, setActiveSession, setMessages } = useChatStore()
  const [creating, setCreating] = useState(false)

  const handleNew = async () => {
    try {
      setCreating(true)
      const res = await createSession()
      addSession({ id: res.data.session_id, title: 'New Chat', created_at: new Date().toISOString() })
    } catch {
      toast.error('Could not create chat')
    } finally {
      setCreating(false)
    }
  }

  const handleSelect = async (session) => {
    setActiveSession(session)
    onClose?.()
    try {
      const res = await getHistory(session.id)
      setMessages(res.data.messages || [])
    } catch {
      setMessages([])
    }
  }

  return (
    <aside style={{
      width: open ? '280px' : '0',
      minWidth: open ? '280px' : '0',
      overflow: 'hidden',
      transition: 'width 0.25s ease, min-width 0.25s ease',
      background: 'var(--bg-surface)',
      borderRight: open ? '1px solid var(--border)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'relative',
      zIndex: 5
    }}>
      {/* Fixed inner width so content doesn't squish during animation */}
      <div style={{
        width: '280px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>

        {/* New Chat button */}
        <div style={{ padding: '16px' }}>
          <button
            onClick={handleNew}
            disabled={creating}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(229,9,20,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px var(--accent-glow)'}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'var(--accent)',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px',
              cursor: creating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: creating ? 0.7 : 1,
              transition: 'opacity 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 16px var(--accent-glow)',
              fontFamily: 'Inter, sans-serif'
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {creating ? 'Creating...' : 'New Chat'}
          </button>
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 8px 12px'
          }}>
            Recent Chats
          </div>

          {sessions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: '40px', borderRadius: '8px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sessions.map(s => {
                const isActive = activeSession?.id === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--bg-hover)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                      background: isActive ? 'rgba(229,9,20,0.1)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: isActive ? 500 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s',
                      boxShadow: isActive ? '0 0 12px var(--accent-glow)' : 'none',
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      style={{ flexShrink: 0, opacity: 0.6 }}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.title && s.title !== 'New Chat' ? s.title : '💬 New Chat'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}