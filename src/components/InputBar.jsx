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
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px'
  }

  const over = text.length > MAX

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '12px',
        padding: '12px 16px',
        borderRadius: '14px',
        background: 'var(--input-bg)',
        border: `1.5px solid ${over ? 'var(--accent)' : text.length > 0 ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: text.length > 0 ? '0 0 0 3px var(--accent-glow)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}>
        <textarea
          ref={ref}
          value={text}
          onChange={onInput}
          onKeyDown={onKey}
          placeholder={disabled ? 'AI is thinking...' : 'Ask anything... (Enter to send)'}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '15px',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            maxHeight: '130px',
            fontFamily: 'Inter, sans-serif',
            opacity: disabled ? 0.6 : 1
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{
            fontSize: '11px',
            color: over ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: over ? 600 : 400,
            minWidth: '48px', textAlign: 'right'
          }}>
            {text.length}/{MAX}
          </span>

          <button
            onClick={send}
            disabled={!text.trim() || disabled || over}
            style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              background: text.trim() && !disabled && !over ? 'var(--accent)' : 'var(--bg-card)',
              border: 'none',
              cursor: text.trim() && !disabled && !over ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s, transform 0.1s',
              boxShadow: text.trim() && !disabled ? '0 2px 8px var(--accent-glow)' : 'none'
            }}
            onMouseEnter={e => { if (text.trim() && !disabled) e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={text.trim() && !disabled && !over ? 'white' : 'var(--text-muted)'}>
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}