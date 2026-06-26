import { useState, useEffect } from 'react'
import { Search, Plus, X, Calendar, Clock, MapPin } from "lucide-react"

interface EventItem {
  id: number
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  status: string
  created_at: string
}

export default function EventManagement() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<EventItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '', status: 'upcoming' })

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    try {
      const r = await fetch('/api/admin/events', { credentials: 'include' })
      const d = await r.json()
      setEvents(d.events ?? d.data ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const url = editing ? `/api/admin/events/${editing.id}` : '/api/admin/events'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form), credentials: 'include' })
      if (res.ok) { setShowAdd(false); setEditing(null); setForm({ title: '', description: '', event_date: '', event_time: '', location: '', status: 'upcoming' }); await fetchEvents() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Save failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this event?')) return
    try { await fetch(`/api/admin/events/${id}`, { method: 'DELETE', credentials: 'include' }); await fetchEvents() }
    catch { alert('Delete failed') }
  }

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.location?.toLowerCase().includes(search.toLowerCase()))
  const upcoming = filtered.filter(e => new Date(e.event_date) >= new Date())
  const past = filtered.filter(e => new Date(e.event_date) < new Date())

  function openEdit(event: EventItem) { setEditing(event); setForm({ title: event.title, description: event.description || '', event_date: event.event_date?.split('T')[0] || '', event_time: event.event_time || '', location: event.location || '', status: event.status || 'upcoming' }); setShowAdd(true) }

  if (loading) return <div className="flex h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Event Management</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{events.length} events ({upcoming.length} upcoming)</p></div>
        <button onClick={() => { setShowAdd(true); setEditing(null); setForm({ title: '', description: '', event_date: '', event_time: '', location: '', status: 'upcoming' }) }} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all"><Plus className="h-4 w-4" /> New Event</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">No events found.</div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Upcoming Events</h3>
              <div className="grid gap-3">
                {upcoming.map(event => <EventCard key={event.id} event={event} onEdit={openEdit} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Past Events</h3>
              <div className="grid gap-3">
                {past.map(event => <EventCard key={event.id} event={event} onEdit={openEdit} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {(showAdd) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => { if (!saving) { setShowAdd(false); setEditing(null) } }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label><input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label><input type="date" required value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label><input type="time" value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label><input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditing(null) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, onEdit, onDelete }: { event: EventItem; onEdit: (e: EventItem) => void; onDelete: (id: number) => void }) {
  const isUpcoming = new Date(event.event_date) >= new Date()
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-50 text-center dark:bg-rose-900/30">
        <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{new Date(event.event_date).getDate()}</span>
        <span className="text-[10px] font-medium text-rose-500 uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
          {isUpcoming && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Upcoming</span>}
        </div>
        {event.description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{event.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.event_date).toLocaleDateString()}</span>
          {event.event_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.event_time}</span>}
          {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button onClick={() => onEdit(event)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20">Edit</button>
        <button onClick={() => onDelete(event.id)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">Delete</button>
      </div>
    </div>
  )
}
