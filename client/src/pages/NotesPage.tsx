import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useAuthedApi } from '../lib/api'

type Note = {
  _id: string
  title: string
  content?: string
  createdAt?: string
}

export default function NotesPage() {
  const { user, clearAuth } = useAuth()
  const api = useAuthedApi()
  const navigate = useNavigate()

  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  async function loadNotes() {
    setError(null)
    try {
      const { data } = await api.get('/notes')
      setNotes(data.notes || [])
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load notes')
    }
  }

  async function createNote(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/notes', { title, content })
      setNotes((n) => [data.note, ...n])
      setTitle('')
      setContent('')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to create note')
    } finally {
      setLoading(false)
    }
  }

  async function deleteNote(id: string) {
    setError(null)
    try {
      await api.delete(`/notes/${id}`)
      setNotes((n) => n.filter((x) => x._id !== id))
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to delete note')
    }
  }

  function startEdit(n: Note) {
    setEditId(n._id)
    setEditTitle(n.title)
    setEditContent(n.content || '')
  }

  function cancelEdit() {
    setEditId(null)
    setEditTitle('')
    setEditContent('')
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editId) return
    if (!editTitle.trim() && !editContent.trim()) return
    setLoading(true)
    setError(null)
    try {
      const payload: Record<string, string> = {}
      if (editTitle.trim()) payload.title = editTitle
      // allow clearing content to empty string
      payload.content = editContent
      const { data } = await api.put(`/notes/${editId}`, payload)
      setNotes((list) => list.map((x) => (x._id === editId ? data.note : x)))
      cancelEdit()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to update note')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <div className="font-semibold">Welcome, {user?.name || user?.email}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="button-primary" onClick={() => navigate('/auth')}>Auth</button>
            <button className="px-4 py-2 rounded-md border" onClick={() => { clearAuth(); navigate('/auth') }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-1">
            <form onSubmit={createNote} className="bg-white rounded-xl shadow p-4 space-y-3">
              <h2 className="text-lg font-semibold">Create a note</h2>
              <input
                className="input"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="input min-h-[100px]"
                placeholder="Details (optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {error && <p className="text-sm text-red-600">{String(error)}</p>}
              <button className="button-primary w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add note'}
              </button>
            </form>
          </section>

          <section className="md:col-span-2">
            <div className="grid gap-4">
              {notes.length === 0 && (
                <div className="text-gray-500">No notes yet. Create your first note!</div>
              )}
              {notes.map((n) => (
                <div key={n._id} className="bg-white rounded-xl shadow p-4">
                  {editId === n._id ? (
                    <form onSubmit={saveEdit} className="space-y-3">
                      <input
                        className="input"
                        placeholder="Note title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        className="input min-h-[100px]"
                        placeholder="Details"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button type="button" className="px-3 py-1 border rounded-md text-sm" onClick={cancelEdit}>
                          Cancel
                        </button>
                        <button className="button-primary px-4 py-1 rounded-md text-sm" disabled={loading}>
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{n.title}</h3>
                        {n.content && <p className="text-gray-700 whitespace-pre-wrap mt-1">{n.content}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 border rounded-md text-sm" onClick={() => startEdit(n)}>Edit</button>
                        <button className="px-3 py-1 border rounded-md text-sm" onClick={() => deleteNote(n._id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Notes</footer>
    </div>
  )
}
