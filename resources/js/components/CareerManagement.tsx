import { useState, useEffect } from 'react'
import { Briefcase, Send, Eye, Search, X, Plus, ChevronDown, Loader2 } from "lucide-react"

interface JobListing { id: number; title: string; department: string; description: string; requirements: string; location: string; type: string; salary_min: number; salary_max: number; status: string; created_at: string; }
interface JobApplication { id: number; job_listing_id: number; first_name: string; last_name: string; full_name: string; email: string; phone: string; cover_letter: string; status: string; created_at: string; job_listing: JobListing | null; }

export default function CareerManagement() {
  const [tab, setTab] = useState<'listings' | 'applications'>('listings')
  const [listings, setListings] = useState<JobListing[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [editing, setEditing] = useState<JobListing | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null)

  async function fetchListings() { const r = await fetch('/api/admin/job-listings'); const d = await r.json(); setListings(d.listings || []); }
  async function fetchApplications() { const r = await fetch('/api/admin/job-applications'); const d = await r.json(); setApplications(d.applications || []); }

  useEffect(() => { fetchListings(); fetchApplications(); }, [])

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <button onClick={() => setTab('listings')} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${tab === 'listings' ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}><Briefcase className="mr-1.5 inline h-4 w-4" />Job Listings</button>
        <button onClick={() => setTab('applications')} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${tab === 'applications' ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}><Send className="mr-1.5 inline h-4 w-4" />Applications ({applications.length})</button>
      </div>

      {tab === 'listings' ? (
        <ListingPanel listings={listings} onRefresh={fetchListings} editing={editing} setEditing={setEditing} showAdd={showAdd} setShowAdd={setShowAdd} />
      ) : (
        <ApplicationPanel applications={applications} onRefresh={fetchApplications} selected={selectedApp} setSelected={setSelectedApp} />
      )}
    </div>
  )
}

function ListingPanel({ listings, onRefresh, editing, setEditing, showAdd, setShowAdd }: {
  listings: JobListing[]; onRefresh: () => void; editing: JobListing | null; setEditing: (v: JobListing | null) => void; showAdd: boolean; setShowAdd: (v: boolean) => void
}) {
  const [form, setForm] = useState({ title: '', department: '', description: '', requirements: '', location: '', type: 'full-time', salary_min: '', salary_max: '', status: 'active' })
  const [saving, setSaving] = useState(false)

  function resetForm() { setForm({ title: '', department: '', description: '', requirements: '', location: '', type: 'full-time', salary_min: '', salary_max: '', status: 'active' }) }

  useEffect(() => { if (editing) setForm({ title: editing.title, department: editing.department || '', description: editing.description, requirements: editing.requirements || '', location: editing.location || '', type: editing.type, salary_min: editing.salary_min?.toString() || '', salary_max: editing.salary_max?.toString() || '', status: editing.status }); else resetForm() }, [editing])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const body = { ...form, salary_min: form.salary_min ? parseFloat(form.salary_min) : null, salary_max: form.salary_max ? parseFloat(form.salary_max) : null }
    try {
      const url = editing ? `/api/admin/job-listings/${editing.id}` : '/api/admin/job-listings'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { onRefresh(); setEditing(null); setShowAdd(false); resetForm() }
      else alert('Save failed')
    } catch { alert('Save failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this listing?')) return
    try { const res = await fetch(`/api/admin/job-listings/${id}`, { method: 'DELETE' }); if (res.ok) onRefresh() }
    catch { alert('Delete failed') }
  }

  const typeColors: Record<string, string> = { 'full-time': 'bg-blue-100 text-blue-700', 'part-time': 'bg-purple-100 text-purple-700', 'contract': 'bg-yellow-100 text-yellow-700', 'internship': 'bg-green-100 text-green-700' }

  function Form() {
    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label><input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label><input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"><option value="full-time">Full Time</option><option value="part-time">Part Time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Salary Min</label><input type="number" value={form.salary_min} onChange={e => setForm(f => ({ ...f, salary_min: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Salary Max</label><input type="number" value={form.salary_max} onChange={e => setForm(f => ({ ...f, salary_max: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label><textarea rows={4} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</label><textarea rows={4} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        </div>
        <div className="flex items-center gap-3">
          <button disabled={saving} className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
          <button type="button" onClick={() => { setEditing(null); setShowAdd(false) }} className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Cancel</button>
        </div>
      </form>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Job Listings</h2>
        <button onClick={() => { setShowAdd(true); setEditing(null) }} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-all"><Plus className="h-4 w-4" /> Add Listing</button>
      </div>
      {(showAdd || editing) && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"><Form /></div>
      )}
      <div className="space-y-3">
        {listings.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No job listings yet.</p>
        ) : listings.map((l) => (
          <div key={l.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-rose-600 uppercase">{l.department || 'General'}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[l.type] || 'bg-gray-100 text-gray-700'}`}>{l.type}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{l.status}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{l.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(l)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"><Eye className="mr-1 inline h-3 w-3" />Edit</button>
                <button onClick={() => handleDelete(l.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><X className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplicationPanel({ applications, onRefresh, selected, setSelected }: {
  applications: JobApplication[]; onRefresh: () => void; selected: JobApplication | null; setSelected: (v: JobApplication | null) => void
}) {
  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', reviewed: 'bg-blue-100 text-blue-700', shortlisted: 'bg-purple-100 text-purple-700', rejected: 'bg-red-100 text-red-700', hired: 'bg-green-100 text-green-700' }

  async function updateStatus(id: number, status: string) {
    try { const res = await fetch(`/api/admin/job-applications/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); if (res.ok) { onRefresh(); if (selected?.id === id) setSelected({ ...selected, status }) } }
    catch { alert('Failed') }
  }

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600">&larr; Back</button>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.full_name}</h3>
              <p className="text-sm text-gray-500">{selected.email} &middot; {selected.phone}</p>
              <p className="text-xs text-gray-400 mt-1">Applied for: <strong>{selected.job_listing?.title || 'N/A'}</strong></p>
            </div>
            <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)} className="rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
          {selected.cover_letter && (
            <div>
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Cover Letter</h4>
              <p className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">{selected.cover_letter}</p>
            </div>
          )}
          <p className="mt-4 text-xs text-gray-400">Submitted: {new Date(selected.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Job Applications</h2>
      <div className="space-y-3">
        {applications.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No applications yet.</p>
        ) : applications.map((a) => (
          <button key={a.id} onClick={() => setSelected(a)} className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm hover:border-rose-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-rose-700 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{a.full_name}</h3>
                <p className="text-sm text-gray-500">{a.email} &middot; {a.phone}</p>
                <p className="text-xs text-gray-400 mt-0.5">Applied for: {a.job_listing?.title || 'N/A'} &middot; {new Date(a.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}