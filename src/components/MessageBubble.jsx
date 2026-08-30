import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { deleteMessage } from '../services/api'
import { useChatStore } from '../store/chatStore'
import toast from 'react-hot-toast'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { removeMessage } = useChatStore()

  const copy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!message.id) {
      // Message not yet saved to DB (optimistic UI) — just remove locally
      removeMessage(message.id)
      return
    }
    try {
      setDeleting(true)
      await deleteMessage(message.id)
      removeMessage(message.id)
      toast.success('Message deleted')
    } catch {
      toast.error('Could not delete message')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="msg-in" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '8px 24px',
      flexDirection: isUser ? 'row-reverse' : 'row'
    }}>
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '8px',
        background: isUser ? '#444' : 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 700, color: 'white',
        flexShrink: 0
      }}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble + actions */}
      <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '6px',
        alignItems: isUser ? 'flex-end' : 'flex-start' }}>

        {/* Bubble */}
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser ? 'var(--accent)' : 'var(--bg-card)',
          border: isUser ? 'none' : '1px solid var(--border)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          opacity: deleting ? 0.5 : 1,
          transition: 'opacity 0.2s'
        }}>
          {isUser ? (
            <p style={{ margin: 0, color: 'white', lineHeight: '1.6' }}>
              {message.content}
            </p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p style={{ margin: '0 0 10px', color: 'var(--text-primary)', lineHeight: '1.75' }}>{children}</p>,
                h1: ({ children }) => <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '16px 0 8px', color: 'var(--text-primary)' }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: '17px', fontWeight: 700, margin: '14px 0 6px', color: 'var(--text-primary)' }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '12px 0 6px', color: 'var(--text-primary)' }}>{children}</h3>,
                strong: ({ children }) => <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{children}</strong>,
                em: ({ children }) => <em style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{children}</em>,
                code: ({ inline, children }) => inline ? (
                  <code style={{ background: 'var(--bg-hover)', color: 'var(--accent)', padding: '2px 7px', borderRadius: '5px', fontSize: '13px', fontFamily: 'monospace' }}>{children}</code>
                ) : (
                  <pre style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', overflowX: 'auto', margin: '12px 0' }}>
                    <code style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'monospace', lineHeight: '1.6' }}>{children}</code>
                  </pre>
                ),
                ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '8px 0', color: 'var(--text-primary)' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '8px 0', color: 'var(--text-primary)' }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: '6px', lineHeight: '1.6' }}>{children}</li>,
                blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '14px', margin: '12px 0', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{children}</blockquote>,
                hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />,
                table: ({ children }) => (
                  <div style={{ overflowX: 'auto', margin: '14px 0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead style={{ background: 'var(--bg-primary)' }}>{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr style={{ borderBottom: '1px solid var(--border)' }}>{children}</tr>,
                th: ({ children }) => <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--accent)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--accent)' }}>{children}</th>,
                td: ({ children }) => <td style={{ padding: '10px 14px', color: 'var(--text-primary)', lineHeight: '1.6', verticalAlign: 'top' }}>{children}</td>,
              }}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>

          {/* Copy button — always show for AI, hover for user */}
          <button onClick={copy} style={{
            padding: '3px 10px', borderRadius: '6px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            fontSize: '11px',
            color: copied ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            transition: 'color 0.2s'
          }}>
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>

          {/* Delete button — confirm flow */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                padding: '3px 10px', borderRadius: '6px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                fontSize: '11px', color: 'var(--text-muted)',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', gap: '4px',
                transition: 'color 0.2s, border-color 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6l-1,14H6L5,6"/>
                <path d="M9,6V4h6v2"/>
              </svg>
              Delete
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sure?</span>
              <button onClick={handleDelete} style={{
                padding: '3px 8px', borderRadius: '6px',
                background: 'var(--accent)', border: 'none',
                color: 'white', fontSize: '11px',
                fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}>
                {deleting ? '...' : 'Yes'}
              </button>
              <button onClick={() => setConfirmDelete(false)} style={{
                padding: '3px 8px', borderRadius: '6px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: '11px', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}>
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}