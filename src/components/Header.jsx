import { supabase } from '../supabaseClient'

export default function Header({ session, onSignInClick }) {
  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="9" fill="#2563eb" />
            <path d="M11 29L20 11L29 29H11Z" fill="white" opacity="0.95" />
            <circle cx="20" cy="13" r="2.5" fill="white" />
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
            <button className="btn-ghost btn-sm" onClick={onSignInClick}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  )
}
