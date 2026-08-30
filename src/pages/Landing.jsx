import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glow blobs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', border: '1px solid var(--border-light)', marginBottom: '32px', background: 'var(--bg-surface)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 500 }}>POWERED BY GROQ LPU</span>
        </div>

        {/* Main heading */}
        <div style={{ marginBottom: '20px', lineHeight: 1 }}>
          <div style={{ fontSize: 'clamp(56px, 10vw, 96px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1 }}>
            <span style={{ color: 'var(--accent)' }}>CINE</span>
            <span style={{ color: 'var(--text-primary)' }}>CHAT</span>
          </div>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)', fontWeight: 300, marginBottom: '8px', letterSpacing: '0.01em' }}>
          Your AI companion. Cinematic experience.
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '52px', letterSpacing: '0.03em' }}>
          Groq · FastAPI · Supabase · React
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(229,9,20,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/auth?mode=register')}
            style={{
              padding: '16px 40px',
              borderRadius: '12px',
              background: 'var(--accent)',
              color: 'white',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              transition: 'box-shadow 0.2s ease'
            }}>
            Get Started →
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, background: 'var(--bg-hover)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/auth?mode=login')}
            style={{
              padding: '16px 40px',
              borderRadius: '12px',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '16px',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}>
            Sign In
          </motion.button>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '56px', flexWrap: 'wrap' }}>
          {['⚡ Blazing fast', '🔒 Secure auth', '💾 Chat history', '🌙 Dark & light'].map(f => (
            <span key={f} style={{
              padding: '8px 16px',
              borderRadius: '100px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)'
            }}>{f}</span>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ position: 'absolute', bottom: '28px', fontSize: '12px', color: 'var(--text-muted)' }}>
        Built by Phani Katta · CineChat v1.0
      </motion.p>
    </div>
  )
}