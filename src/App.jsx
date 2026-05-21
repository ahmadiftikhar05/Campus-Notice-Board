import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Header from './components/Header'
import NoticeBoard from './components/NoticeBoard'
import NoticeForm from './components/NoticeForm'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) setShowAuth(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="app">
      <Header session={session} onSignInClick={() => setShowAuth(v => !v)} />

      {showAuth && !session && (
        <div className="auth-modal-overlay" onClick={() => setShowAuth(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Auth onClose={() => setShowAuth(false)} />
          </div>
        </div>
      )}

      <main className="main-content">
        {session
          ? <NoticeForm session={session} />
          : (
            <div>
              {/* <span>Browse notices below. Sign in to post or manage your own.</span>
              <button className="btn-primary btn-sm" onClick={() => setShowAuth(true)}>
                Sign In
              </button> */}
            </div>
          )
        }
        <NoticeBoard session={session} />
      </main>
    </div>
  )
}

export default App
