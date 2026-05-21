import { supabase } from '../supabaseClient'

export default function Header({ session, onSignInClick }) {
  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#6366f1" />
            <path d="M10 28L20 12L30 28H10Z" fill="white" opacity="0.9" />
            <circle cx="20" cy="14" r="3" fill="white" />
          </svg>
          <span className="header-title">Campus Notice Board</span>
        </div>

        <div className="header-user">
          {session ? (
            <>
              <span className="user-email">{session.user.email}</span>
              <button className="btn-signout" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="btn-primary btn-sm" onClick={onSignInClick}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  )
}
