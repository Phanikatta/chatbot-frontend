import { useState } from 'react'
import { useChatStore } from '../store/chatStore'

const PRESETS = [
  {
    id: 'assistant',
    emoji: '🤖',
    name: 'Helpful Assistant',
    prompt: 'You are a helpful, friendly, and knowledgeable AI assistant. Answer questions clearly and concisely.'
  },
  {
    id: 'coder',
    emoji: '👨‍💻',
    name: 'Code Expert',
    prompt: 'You are an expert software engineer. Help with code, debugging, architecture, and best practices. Always provide clean, well-commented code examples.'
  },
  {
    id: 'writer',
    emoji: '🎨',
    name: 'Creative Writer',
    prompt: 'You are a creative writing assistant. Help with stories, poems, scripts, and creative content. Be imaginative, expressive, and inspiring.'
  },
  {
    id: 'analyst',
    emoji: '📊',
    name: 'Data Analyst',
    prompt: 'You are a data analyst and business intelligence expert. Help analyze data, explain statistics, create insights, and suggest visualizations.'
  },
  {
    id: 'tutor',
    emoji: '🧑‍🏫',
    name: 'Tutor',
    prompt: 'You are a patient and encouraging tutor. Explain concepts step by step, use simple examples, check understanding, and adapt to the student\'s level.'
  },
  {
    id: 'interviewer',
    emoji: '💼',
    name: 'Interview Coach',
    prompt: 'You are an expert interview coach. Help prepare for technical and behavioral interviews, give feedback on answers, and suggest improvements.'
  },
  {
    id: 'custom',
    emoji: '✏️',
    name: 'Custom',
    prompt: ''
  }
]

export default function SystemPromptSelector() {
  const { systemPrompt, setSystemPrompt } = useChatStore()
  const [open, setOpen] = useState(false)
  const [customText, setCustomText] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Find active preset
  const active = PRESETS.find(p => p.prompt === systemPrompt) || PRESETS[0]

  const handleSelect = (preset) => {
    if (preset.id === 'custom') {
      setShowCustomInput(true)
      setOpen(false)
      return
    }
    setSystemPrompt(preset.prompt)
    setShowCustomInput(false)
    setOpen(false)
  }

  const handleCustomSave = () => {
    if (!customText.trim()) return
    setSystemPrompt(customText.trim())
    setShowCustomInput(false)
  }

  return (
    <div style={{ padding: '0 16px 12px' }}>

      {/* Selector button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontFamily: 'Inter, sans-serif',
            transition: 'border-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{active.emoji}</span>
            <span style={{ color: 'var(--text-primary)' }}>{active.name}</span>
          </div>
          <svg
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="var(--text-muted)" strokeWidth="2.5"
            style={{
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
              flexShrink: 0
            }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.3)',
            zIndex: 100
          }}>
            <div style={{
              padding: '10px 14px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--border)'
            }}>
              AI Personality
            </div>

            {PRESETS.map((preset, i) => {
              const isActive = systemPrompt === preset.prompt && preset.id !== 'custom'
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelect(preset)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: isActive ? 'rgba(229,9,20,0.08)' : 'none',
                    border: 'none',
                    borderBottom: i < PRESETS.length - 1
                      ? '1px solid var(--border)' : 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'none'
                  }}>
                  <span style={{ fontSize: '18px' }}>{preset.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)'
                    }}>
                      {preset.name}
                    </div>
                    {preset.prompt && (
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '200px'
                      }}>
                        {preset.prompt.slice(0, 60)}...
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="var(--accent)" strokeWidth="2.5">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Custom prompt input */}
      {showCustomInput && (
        <div style={{
          marginTop: '10px',
          padding: '12px',
          borderRadius: '10px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            fontWeight: 500
          }}>
            ✏️ Write your custom system prompt:
          </p>
          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="You are a helpful assistant that..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              resize: 'vertical',
              outline: 'none',
              lineHeight: '1.5'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={handleCustomSave}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                background: 'var(--accent)',
                border: 'none',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}>
              Save
            </button>
            <button
              onClick={() => setShowCustomInput(false)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active prompt preview */}
      {systemPrompt && !showCustomInput && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(229,9,20,0.06)',
          border: '1px solid rgba(229,9,20,0.2)'
        }}>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {systemPrompt}
          </p>
        </div>
      )}
    </div>
  )
}