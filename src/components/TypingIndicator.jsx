export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-enter px-4 py-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ background: 'var(--accent)' }}>
        AI
      </div>
      <div className="glass rounded-2xl rounded-tl-none px-4 py-3 flex gap-2 items-center">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  )
}