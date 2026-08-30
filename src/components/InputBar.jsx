import { useState, useRef } from 'react'

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('')
  const ref = useRef(null)
  const MAX = 2000

  const send = () => {
    if (!text.trim() || disabled || text.length > MAX) return
    onSend(text.trim())
    setText('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const onInput = (e) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const over = text.length > MAX
  const canSend = text.trim() && !disabled && !over

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      flexShrink: 0
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '14px',
        background: 'var(--input-bg)',
        border: `1.5px solid ${canSend || over ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: canSend ? '0 0 0 3px var(--accent-glow)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}>
        <textarea
          ref={ref}
          value={text}
          onChange={onInput}
          onKeyDown={onKey}
          placeholder={disabled ? 'AI is thinking...' : 'Ask anything...'}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            minWidth: 0, // ← critical for mobile
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '15px',
            lineHeight: '1.5',
            color: 'var(--text-primary)',
            maxHeight: '120px',
            fontFamily: 'Inter, sans-serif',
            opacity: disabled ? 0.6 : 1
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Counter — hide on very small screens */}
          <span style={{
            fontSize: '11px',
            color: over ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: over ? 600 : 400,
            display: window.innerWidth < 380 ? 'none' : 'block'
          }}>
            {text.length}/{MAX}
          </span>

          {/* Send button */}
          <button
            onClick={send}
            disabled={!canSend}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: canSend ? 'var(--accent)' : 'var(--bg-card)',
              border: 'none',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s',
              boxShadow: canSend ? '0 2px 8px var(--accent-glow)' : 'none'
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={canSend ? 'white' : 'var(--text-muted)'}>
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hide hint on very small screens */}
      {window.innerWidth >= 380 && (
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '6px'
        }}>
          Enter to send · Shift+Enter for new line
        </p>
      )}
    </div>
  )
}