import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { register, login } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') || 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return toast.error('Fill in all fields')
    if (password.length < 6) return toast.error('Password must be 6+ characters')
    setLoading(true)
    try {
      if (mode === 'register') {
        await register(email, password)
        toast.success('Account created — sign in!')
        setMode('login')
        setPassword('')
      } else {
        const res = await login(email, password)
        setAuth(res.data.access_token, { email })
        navigate('/chat')
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'var(--input-bg)',
    border: '1.5px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, sans-serif'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient */}
      <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(229,9,20,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1, marginBottom: '8px' }}>
              <span style={{ color: 'var(--accent)' }}>CINE</span>
              <span style={{ color: 'var(--text-primary)' }}>CHAT</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? 'Welcome back. Sign in to continue.' : 'Create your account to get started.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-card)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '28px'
          }}>
            {[['login', 'Sign In'], ['register', 'Register']].map(([tab, label]) => (
              <button key={tab}
                onClick={() => { setMode(tab); setEmail(''); setPassword('') }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: mode === tab ? 'var(--accent)' : 'transparent',
                  color: mode === tab ? 'white' : 'var(--text-secondary)',
                  boxShadow: mode === tab ? '0 4px 12px var(--accent-glow)' : 'none',
                  fontFamily: 'Inter, sans-serif'
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Fields */}
          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@example.com"
                  className="input-focus"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Min. 6 characters"
                    className="input-focus"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: '16px', padding: '4px',
                      transition: 'color 0.2s'
                    }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ opacity: 0.92 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: '10px',
                  background: loading ? 'var(--accent-dim)' : 'var(--accent)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 20px var(--accent-glow)',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'opacity 0.2s'
                }}>
                {loading ? (
                  <>
                    <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Please wait...
                  </>
                ) : mode === 'login' ? 'Sign In →' : 'Create Account →'}
              </motion.button>

              {/* Switch */}
              <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setPassword('') }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  {mode === 'login' ? 'Register' : 'Sign In'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            ← Back to home
          </button>
        </div>
      </motion.div>
    </div>
  )
}