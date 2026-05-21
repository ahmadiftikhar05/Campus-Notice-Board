import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth({ onClose }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for a confirmation link.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="auth-card">
      {onClose && (
        <button className="auth-close" onClick={onClose} aria-label="Close">✕</button>
      )}

      <div className="auth-logo">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#6366f1" />
          <path d="M10 28L20 12L30 28H10Z" fill="white" opacity="0.9" />
          <circle cx="20" cy="14" r="3" fill="white" />
        </svg>
      </div>
      <h2 className="auth-title">
        {mode === 'signup' ? 'Create an account' : 'Welcome back'}
      </h2>
      <p className="auth-subtitle">
        {mode === 'signup' ? 'Sign up to post notices' : 'Sign in to your account'}
      </p>

      <div className="auth-toggle">
        <button
          className={`toggle-btn ${mode === 'signin' ? 'active' : ''}`}
          onClick={() => { setMode('signin'); setError(null); setMessage(null) }}
        >
          Sign In
        </button>
        <button
          className={`toggle-btn ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
