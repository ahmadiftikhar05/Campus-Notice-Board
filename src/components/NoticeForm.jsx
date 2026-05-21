import { useState } from 'react'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['Academic', 'Event', 'Urgent', 'General']

export default function NoticeForm({ session }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.from('notices').insert({
      title: title.trim(),
      body: body.trim(),
      category,
      user_id: session.user.id,
    })

    if (error) {
      setError(error.message)
    } else {
      setTitle('')
      setBody('')
      setCategory('General')
    }

    setLoading(false)
  }

  return (
    <div className="notice-form-card">
      <h2 className="form-heading">Post a Notice</h2>
      <form onSubmit={handleSubmit} className="notice-form">
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="notice-title">Title</label>
            <input
              id="notice-title"
              type="text"
              placeholder="Notice title…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={120}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notice-category">Category</label>
            <select
              id="notice-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notice-body">Message</label>
          <textarea
            id="notice-body"
            placeholder="Write your notice here…"
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            rows={3}
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Posting…' : 'Post Notice'}
          </button>
        </div>
      </form>
    </div>
  )
}
