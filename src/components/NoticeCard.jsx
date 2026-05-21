import { supabase } from '../supabaseClient'

const CATEGORY_COLORS = {
  Academic: 'badge-academic',
  Event: 'badge-event',
  Urgent: 'badge-urgent',
  General: 'badge-general',
}

function formatTime(ts) {
  const date = new Date(ts)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
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
    <article className="notice-card">
      <div className="notice-card-header">
        <span className={`badge ${CATEGORY_COLORS[notice.category] || 'badge-general'}`}>
          {notice.category}
        </span>
        <time className="notice-time" dateTime={notice.created_at}>
          {formatTime(notice.created_at)}
        </time>
      </div>
      <h3 className="notice-title">{notice.title}</h3>
      <p className="notice-body">{notice.body}</p>
      {isOwner && (
        <div className="notice-card-footer">
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </article>
  )
}
