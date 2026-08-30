import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Header({ theme, toggleTheme, sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initial = user?.email?.[0]?.toUpperCase() || 'U'
  const username = user?.email?.split('@')[0] || 'User'

  return (
    <header style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10
    }}>
      {/* Left — sidebar toggle + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            width: '36px', height: '36px',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'background 0.15s',
            flexShrink: 0
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1, userSelect: 'none' }}>
          <span style={{ color: 'var(--accent)' }}>CINE</span>
          <span style={{ color: 'var(--text-primary)' }}>CHAT</span>
        </div>
      </div>

      {/* Right — theme toggle + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          style={{
            width: '36px', height: '36px',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
            transition: 'background 0.15s'
          }}>
                {theme === 'dark' ? (
        // Sun icon — switch to light
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="2" y1="12" x2="4" y2="12"/>
            <line x1="20" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        ) : (
        // Moon icon — switch to dark
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        )}
        </button>

        {/* User menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px 6px 6px',
              borderRadius: '8px',
              background: menuOpen ? 'var(--bg-hover)' : 'var(--bg-card)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '6px',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '13px', fontWeight: 700
            }}>
              {initial}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {username}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: '220px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              zIndex: 100
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Signed in as</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'none', border: 'none',
                  textAlign: 'left', cursor: 'pointer',
                  fontSize: '14px', color: 'var(--accent)',
                  fontWeight: 500, fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Simple wrapper since we can't import motion here without issue
function motion_div({ style, children }) {
  return <div style={style}>{children}</div>
}