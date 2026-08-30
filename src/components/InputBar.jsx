import { useState, useRef, useEffect } from 'react'
import { useSpeechToText } from '../hooks/useSpeech'
import toast from 'react-hot-toast'

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [interimText, setInterimText] = useState('')
  const ref = useRef(null)
  const MAX = 2000

  const { listening, supported: sttSupported, toggleListening } = useSpeechToText({
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        setText(prev => {
          const combined = (prev + ' ' + transcript).trim()
          return combined
        })
        setInterimText('')
      } else {
        setInterimText(transcript)
      }
    },
    onError: (err) => {
      toast.error(`Mic error: ${err}`)
    }
  })

  // Auto-resize textarea
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = Math.min(ref.current.scrollHeight, 120) + 'px'
    }
  }, [text])

  const send = () => {
    const finalText = text.trim()
    if (!finalText || disabled || finalText.length > MAX) return
    onSend(finalText)
    setText('')
    setInterimText('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const onInput = (e) => {
    setText(e.target.value)
  }

  const handleMic = () => {
    if (!sttSupported) {
      toast.error('Voice not supported in this browser. Use Chrome.')
      return
    }
    toggleListening()
  }

  const over = text.length > MAX
  const canSend = text.trim() && !disabled && !over
  const displayText = text + (interimText ? ' ' + interimText : '')

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      flexShrink: 0
    }}>

      {/* Listening indicator */}
      {listening && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          padding: '8px 14px',
          borderRadius: '10px',
          background: 'rgba(229,9,20,0.1)',
          border: '1px solid var(--accent)'
        }}>
          {/* Pulsing dot */}
          <div style={{
            width: '10px', height: '10px',
            borderRadius: '50%',
            background: 'var(--accent)',
            animation: 'pulse 1s ease-in-out infinite'
          }} />
          <span style={{
            fontSize: '13px',
            color: 'var(--accent)',
            fontWeight: 500
          }}>
            Listening... speak now
          </span>
          {interimText && (
            <span style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}>
              "{interimText}"
            </span>
          )}
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '14px',
        background: 'var(--input-bg)',
        border: `1.5px solid ${listening ? 'var(--accent)' : canSend || over ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: listening
          ? '0 0 0 3px rgba(229,9,20,0.2)'
          : canSend
            ? '0 0 0 3px var(--accent-glow)'
            : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}>
        <textarea
          ref={ref}
          value={text}
          onChange={onInput}
          onKeyDown={onKey}
          placeholder={
            listening
              ? 'Listening... speak now'
              : disabled
                ? 'AI is thinking...'
                : 'Ask anything...'
          }
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            minWidth: 0,
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

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          {/* Character counter */}
          <span style={{
            fontSize: '11px',
            color: over ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: over ? 600 : 400,
            display: window.innerWidth < 380 ? 'none' : 'block'
          }}>
            {text.length}/{MAX}
          </span>

          {/* Mic button */}
          <button
            onClick={handleMic}
            title={listening ? 'Stop recording' : 'Voice input'}
            style={{
              width: '38px', height: '38px',
              borderRadius: '10px',
              background: listening
                ? 'var(--accent)'
                : 'var(--bg-card)',
              border: listening
                ? 'none'
                : '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: listening
                ? '0 0 16px rgba(229,9,20,0.5)'
                : 'none',
              animation: listening ? 'micPulse 1.5s ease-in-out infinite' : 'none'
            }}>
            {listening ? (
              // Stop icon when recording
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              // Mic icon
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={sttSupported ? 'var(--text-secondary)' : 'var(--text-muted)'}
                strokeWidth="2" strokeLinecap="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>

          {/* Send button */}
          <button
            onClick={send}
            disabled={!canSend}
            title="Send message"
            style={{
              width: '38px', height: '38px',
              borderRadius: '10px',
              background: canSend ? 'var(--accent)' : 'var(--bg-card)',
              border: canSend ? 'none' : '1px solid var(--border)',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: canSend ? '0 2px 8px var(--accent-glow)' : 'none'
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={canSend ? 'white' : 'var(--text-muted)'}>
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      {window.innerWidth >= 380 && (
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '6px'
        }}>
          {listening
            ? '🎤 Recording — click ⏹ to stop'
            : 'Enter to send · Shift+Enter for new line · 🎤 for voice'}
        </p>
      )}

      {/* Pulse animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(229,9,20,0.5); }
          50% { box-shadow: 0 0 28px rgba(229,9,20,0.8); }
        }
      `}</style>
    </div>
  )
}