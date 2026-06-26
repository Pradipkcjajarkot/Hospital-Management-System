import { useState, useEffect } from 'react'
import { Briefcase, MapPin, Clock, DollarSign, Building2, ChevronRight, ArrowLeft, Send, Loader2, CheckCircle2, X } from "lucide-react"

interface JobListing { id: number; title: string; department: string; description: string; requirements: string; location: string; type: string; salary_min: number; salary_max: number; created_at: string; }

interface CareersPageProps { setPage: (p: string) => void }

export default function CareersPage({ setPage }: CareersPageProps) {
  const [listings, setListings] = useState<JobListing[]>([])
  const [selected, setSelected] = useState<JobListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApply, setShowApply] = useState(false)

  useEffect(() => {
    fetch('/api/public/careers').then(r => r.json()).then(d => setListings(d.listings || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (selected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <button onClick={() => { setSelected(null); setShowApply(false) }} className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600"><ArrowLeft className="h-4 w-4" /> Back to all jobs</button>
        {showApply ? (
          <ApplyForm job={selected} onDone={() => setShowApply(false)} />
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-rose-600 mb-2"><Building2 className="h-3.5 w-3.5" />{selected.department || 'General'}</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{selected.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{selected.location || 'On-site'}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{selected.type}</span>
                {(selected.salary_min || selected.salary_max) ? <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{selected.salary_min ? `$${selected.salary_min.toLocaleString()}` : ''}{selected.salary_min && selected.salary_max ? ' - ' : ''}{selected.salary_max ? `$${selected.salary_max.toLocaleString()}` : ''}</span> : null}
              </div>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{selected.description}</p>
              {selected.requirements && <><h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">Requirements</h3><p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{selected.requirements}</p></>}
            </div>
            <button onClick={() => setShowApply(true)} className="rounded-xl bg-rose-600 px-8 py-3 text-sm font-medium text-white hover:bg-rose-700 transition-all">Apply Now</button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Careers at MediCare</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Join our team of dedicated healthcare professionals</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-rose-500" /></div>
      ) : listings.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No open positions at the moment. Check back later!</p>
      ) : (
        <div className="space-y-4">
          {listings.map((job) => (
            <button key={job.id} onClick={() => setSelected(job)} className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:border-rose-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-rose-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-rose-600 uppercase tracking-wider mb-1"><Building2 className="h-3 w-3" />{job.department || 'General'}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location || 'On-site'}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.type}</span>
                    {(job.salary_min || job.salary_max) ? <span className="flex items-center gap-1 font-medium text-green-600"><DollarSign className="h-3.5 w-3.5" />{job.salary_min ? `$${job.salary_min.toLocaleString()}` : ''}{job.salary_min && job.salary_max ? ' - ' : ''}{job.salary_max ? `$${job.salary_max.toLocaleString()}` : ''}</span> : null}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ApplyForm({ job, onDone }: { job: JobListing; onDone: () => void }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/public/careers/${job.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, cover_letter: coverLetter }),
      })
      if (res.ok) setSubmitted(true)
      else { const d = await res.json(); alert(d.message || 'Application failed') }
    } catch { alert('Application failed') }
    finally { setSubmitting(false) }
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><CheckCircle2 className="h-8 w-8 text-green-600" /></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
        <p className="text-gray-500 mb-6">Thank you for applying to {job.title}. We'll review your application and get back to you.</p>
        <button onClick={onDone} className="rounded-xl bg-gray-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-all">Back to Job</button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Apply for {job.title}</h2>
      <p className="text-sm text-gray-500 mb-6">Fill in your details below and we'll be in touch.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label><input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label><input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label><input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter (optional)</label><textarea rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <button disabled={submitting} className="rounded-xl bg-rose-600 px-8 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center gap-2">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit Application</>}
        </button>
      </form>
    </div>
  )
}