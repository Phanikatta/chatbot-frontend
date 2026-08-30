import { useState } from 'react'
import { useChatStore } from '../store/chatStore'
import { createSession, getHistory, deleteSession } from '../services/api'
import toast from 'react-hot-toast'
import SystemPromptSelector from './SystemPromptSelector'

export default function Sidebar({ open, onClose }) {
  const { sessions, activeSession, addSession, setActiveSession, setMessages, removeSession } = useChatStore()
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const isMobile = window.innerWidth < 768

  const handleNew = async () => {
    try {
      setCreating(true)
      const res = await createSession()
      addSession({
        id: res.data.session_id,
        title: 'New Chat',
        created_at: new Date().toISOString()
      })
      if (isMobile) onClose?.()
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

  const handleDeleteClick = (e, sessionId) => {
    e.stopPropagation()
    setConfirmId(sessionId)
  }

  const handleConfirmDelete = async (e, sessionId) => {
    e.stopPropagation()
    try {
      setDeletingId(sessionId)
      await deleteSession(sessionId)
      removeSession(sessionId)
      toast.success('Chat deleted')
    } catch {
      toast.error('Could not delete chat')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const handleCancelDelete = (e) => {
    e.stopPropagation()
    setConfirmId(null)
  }

  return (
    <>
      {open && isMobile && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.7)'
        }} />
      )}

      <aside style={{
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : 'auto',
        left: isMobile ? 0 : 'auto',
        height: isMobile ? '100dvh' : '100%',
        zIndex: isMobile ? 50 : 5,
        width: '280px',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        ...(isMobile ? {} : {
          transform: 'none',
          width: open ? '280px' : '0',
          minWidth: open ? '280px' : '0',
          overflow: 'hidden'
        }),
        transition: isMobile
          ? 'transform 0.25s ease'
          : 'width 0.25s ease, min-width 0.25s ease',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>

        {/* Mobile header */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid var(--border)'
          }}>
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent)' }}>CINE</span>CHAT
            </span>
            <button onClick={onClose} style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px',
              color: 'var(--text-secondary)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* New Chat */}
        <div style={{ padding: '16px' }}>
          <button onClick={handleNew} disabled={creating}
            style={{
              width: '100%', padding: '13px 16px',
              borderRadius: '10px', background: 'var(--accent)',
              border: 'none', color: 'white', fontWeight: 600,
              fontSize: '15px', cursor: creating ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', opacity: creating ? 0.7 : 1,
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

        {/* Sessions */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 600,
            color: 'var(--text-muted)', letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '8px 8px 12px'
          }}>
            Recent Chats
          </div>


          {sessions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: '40px', borderRadius: '8px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sessions.map(s => {
                const isActive = activeSession?.id === s.id
                const isConfirming = confirmId === s.id
                const isDeleting = deletingId === s.id

                return (
                  <div key={s.id} style={{ position: 'relative' }}>

                    {/* Confirm delete overlay */}
                    {isConfirming && (
                      <div style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        background: 'var(--bg-card)',
                        borderRadius: '8px',
                        border: '1px solid var(--accent)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px', gap: '8px'
                      }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Delete this chat?
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={(e) => handleConfirmDelete(e, s.id)}
                            style={{
                              padding: '4px 10px', borderRadius: '6px',
                              background: 'var(--accent)', border: 'none',
                              color: 'white', fontSize: '12px',
                              fontWeight: 600, cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                            {isDeleting ? '...' : 'Yes'}
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            style={{
                              padding: '4px 10px', borderRadius: '6px',
                              background: 'var(--bg-hover)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-secondary)',
                              fontSize: '12px', cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Session row */}
                    <button
                      onClick={() => handleSelect(s)}
                      style={{
                        width: '100%', padding: '11px 12px',
                        borderRadius: '8px',
                        border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                        background: isActive ? 'rgba(229,9,20,0.1)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '13px', fontWeight: isActive ? 500 : 400,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.15s',
                        boxShadow: isActive ? '0 0 12px var(--accent-glow)' : 'none',
                        fontFamily: 'Inter, sans-serif',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        opacity: isDeleting ? 0.4 : 1
                      }}
                      onMouseEnter={e => {
                        if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'
                        // show delete btn
                        const btn = e.currentTarget.querySelector('.delete-btn')
                        if (btn) btn.style.opacity = '1'
                      }}
                      onMouseLeave={e => {
                        if (!isActive) e.currentTarget.style.background = 'transparent'
                        const btn = e.currentTarget.querySelector('.delete-btn')
                        if (btn) btn.style.opacity = '0'
                      }}>

                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        style={{ flexShrink: 0, opacity: 0.5 }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>

                      <span style={{
                        flex: 1, overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {s.title && s.title !== 'New Chat' ? s.title : 'New Chat'}
                      </span>

                      {/* Delete icon */}
                      <span
                        className="delete-btn"
                        onClick={(e) => handleDeleteClick(e, s.id)}
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.15s',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          color: 'var(--text-muted)',
                          display: 'flex', alignItems: 'center'
                        }}
                        onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={e => { e.stopPropagation(); e.currentTarget.style.color = 'var(--text-muted)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6l-1,14H6L5,6"/>
                          <path d="M10,11v6M14,11v6"/>
                          <path d="M9,6V4h6v2"/>
                        </svg>
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
                </div>

        {/* System Prompt Selector — bottom of sidebar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', flexShrink: 0 }}>
          <div style={{
            padding: '0 16px 8px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            AI Personality
          </div>
          <SystemPromptSelector />
        </div>

      </aside>
    </>
  )
}