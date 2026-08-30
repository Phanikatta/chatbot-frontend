import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

      {/* Bubble */}
      <div style={{ position: 'relative', maxWidth: '75%' }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser ? 'var(--accent)' : 'var(--bg-card)',
          border: isUser ? 'none' : '1px solid var(--border)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          overflowX: 'auto'
        }}>
          {isUser ? (
            <p style={{ margin: 0, color: 'white', lineHeight: '1.6' }}>
              {message.content}
            </p>
          ) : (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Paragraph
                  p: ({ children }) => (
                    <p style={{ margin: '0 0 10px', color: 'var(--text-primary)', lineHeight: '1.75', lastChild: { marginBottom: 0 } }}>
                      {children}
                    </p>
                  ),

                  // Headings
                  h1: ({ children }) => <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '16px 0 8px', color: 'var(--text-primary)' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontSize: '17px', fontWeight: 700, margin: '14px 0 6px', color: 'var(--text-primary)' }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '12px 0 6px', color: 'var(--text-primary)' }}>{children}</h3>,

                  // Bold / Italic
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{children}</em>
                  ),

                  // Inline code
                  code: ({ inline, children }) => inline ? (
                    <code style={{
                      background: 'var(--bg-hover)',
                      color: 'var(--accent)',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      fontSize: '13px',
                      fontFamily: "'Fira Code', 'Courier New', monospace"
                    }}>
                      {children}
                    </code>
                  ) : (
                    <pre style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '16px',
                      overflowX: 'auto',
                      margin: '12px 0',
                      position: 'relative'
                    }}>
                      <code style={{
                        fontSize: '13px',
                        color: '#e2e8f0',
                        fontFamily: "'Fira Code', 'Courier New', monospace",
                        lineHeight: '1.6'
                      }}>
                        {children}
                      </code>
                    </pre>
                  ),

                  // Lists
                  ul: ({ children }) => (
                    <ul style={{ paddingLeft: '20px', margin: '8px 0', color: 'var(--text-primary)' }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ paddingLeft: '20px', margin: '8px 0', color: 'var(--text-primary)' }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '6px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                      {children}
                    </li>
                  ),

                  // Blockquote
                  blockquote: ({ children }) => (
                    <blockquote style={{
                      borderLeft: '3px solid var(--accent)',
                      paddingLeft: '14px',
                      margin: '12px 0',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic'
                    }}>
                      {children}
                    </blockquote>
                  ),

                  // Horizontal rule
                  hr: () => (
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
                  ),

                  // TABLE — this is what fixes your DSA response
                  table: ({ children }) => (
                    <div style={{ overflowX: 'auto', margin: '14px 0' }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '13px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead style={{ background: 'var(--bg-primary)' }}>
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody>{children}</tbody>
                  ),
                  tr: ({ children }) => (
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '2px solid var(--accent)',
                      whiteSpace: 'nowrap'
                    }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td style={{
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      lineHeight: '1.6',
                      verticalAlign: 'top',
                      borderBottom: '1px solid var(--border)'
                    }}>
                      {children}
                    </td>
                  ),
                }}>
                {message.content}
              </ReactMarkdown>

              {/* Copy button */}
              <button
                onClick={copy}
                style={{
                  marginTop: '8px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  fontSize: '11px',
                  color: copied ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'color 0.2s'
                }}>
                {copied ? '✓ Copied' : '⎘ Copy'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}