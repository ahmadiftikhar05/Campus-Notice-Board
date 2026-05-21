import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import NoticeCard from './NoticeCard'

const CATEGORIES = ['All', 'Academic', 'Event', 'Urgent', 'General']

export default function NoticeBoard({ session }) {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNotices() {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setNotices(data)
      }
      setLoading(false)
    }

    fetchNotices()

    const channel = supabase
      .channel('notices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotices(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setNotices(prev => prev.filter(notice => notice.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setNotices(prev => prev.map(notice => notice.id === payload.new.id ? payload.new : notice));
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  function handleDelete(id) {
    setNotices(prev => prev.filter(n => n.id !== id))
  }

  const filtered = activeFilter === 'All'
    ? notices
    : notices.filter(n => n.category === activeFilter)

  return (
    <div className="notice-board">
      <div className="board-header">
        <h2 className="board-title">Latest Notices</h2>
        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="board-loading">
          <div className="spinner" />
        </div>
      )}

      {error && <div className="auth-error">{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <p>No notices yet{activeFilter !== 'All' ? ` in ${activeFilter}` : ''}.</p>
        </div>
      )}

      <div className="notices-grid">
        {filtered.map(notice => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            session={session}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
