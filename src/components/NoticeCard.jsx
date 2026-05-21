import { supabase } from '../supabaseClient'

const CATEGORY_CLASS = {
  Academic: 'cat-academic',
  Event:    'cat-event',
  Urgent:   'cat-urgent',
  General:  'cat-general',
}

const BADGE_CLASS = {
  Academic: 'badge-academic',
  Event:    'badge-event',
  Urgent:   'badge-urgent',
  General:  'badge-general',
}

function formatTime(ts) {
  const date = new Date(ts)
  const now  = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NoticeCard({ notice, session, onDelete }) {
  const isOwner = session && session.user.id === notice.user_id

  async function handleDelete() {
    const { error } = await supabase.from('notices').delete().eq('id', notice.id)
    if (!error) onDelete(notice.id)
  }

  return (
    <article className={`notice-card ${CATEGORY_CLASS[notice.category] || 'cat-general'}`}>
      <div className="notice-card-inner">
        <div className="notice-card-header">
          <span className={`badge ${BADGE_CLASS[notice.category] || 'badge-general'}`}>
            {notice.category}
          </span>
          <time className="notice-time" dateTime={notice.created_at}>
            {formatTime(notice.created_at)}
          </time>
        </div>
        <h3 className="notice-title">{notice.title}</h3>
        <p className="notice-body">{notice.body}</p>
      </div>

      {isOwner && (
        <div className="notice-card-footer">
          <button className="btn-delete" onClick={handleDelete}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 3h8M5 3V2h2v1M4.5 5v4M7.5 5v4M3 3l.5 7h5l.5-7H3z"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </article>
  )
}
