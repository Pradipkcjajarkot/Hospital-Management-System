import { useState, useEffect } from 'react'
import { Calendar, DollarSign, User, Clock, LogOut, Activity, ChevronRight, MapPin, Phone, Mail, Loader2 } from "lucide-react"

interface Patient { id: number; first_name: string; last_name: string; full_name: string; email: string; phone: string; dob: string; gender: string; blood_group: string; address: string; city: string; state: string; }

interface Appointment { id: number; appointment_date: string; appointment_time: string; status: string; purpose: string; doctor: { full_name: string; specialization: string } | null }

interface Bill { id: number; total_amount: number; paid_amount: number; status: string; created_at: string; }

interface PatientPortalProps { token: string; onLogout: () => void }

export default function PatientPortal({ token, onLogout }: PatientPortalProps) {
  const [tab, setTab] = useState<'dashboard' | 'appointments' | 'bills' | 'profile'>('dashboard')
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' }

  async function fetchData() {
    setLoading(true)
    try {
      const [me, dash, apps, billData] = await Promise.all([
        fetch('/api/portal/me', { headers }).then(r => r.json()),
        fetch('/api/portal/dashboard', { headers }).then(r => r.json()),
        fetch('/api/portal/appointments', { headers }).then(r => r.json()),
        fetch('/api/portal/bills', { headers }).then(r => r.json()),
      ])
      setPatient(me.patient)
      setDashboardData(dash)
      setAppointments(apps.appointments || [])
      setBills(billData.bills || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = { scheduled: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', checked_in: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', no_show: 'bg-gray-100 text-gray-700', paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', partial: 'bg-blue-100 text-blue-700' }
    return <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-rose-500" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white text-sm font-bold">
              {patient?.first_name?.[0]}{patient?.last_name?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{patient?.full_name}</p>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(['dashboard', 'appointments', 'bills', 'profile'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${tab === t ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
              {t === 'dashboard' && <Activity className="mr-1.5 inline h-4 w-4" />}
              {t === 'appointments' && <Calendar className="mr-1.5 inline h-4 w-4" />}
              {t === 'bills' && <DollarSign className="mr-1.5 inline h-4 w-4" />}
              {t === 'profile' && <User className="mr-1.5 inline h-4 w-4" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between"><Calendar className="h-5 w-5 text-rose-500" /><span className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.appointments_count || 0}</span></div>
                <p className="mt-1 text-sm text-gray-500">Total Appointments</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between"><DollarSign className="h-5 w-5 text-green-500" /><span className="text-2xl font-bold text-gray-900 dark:text-white">${(dashboardData?.total_billed || 0).toLocaleString()}</span></div>
                <p className="mt-1 text-sm text-gray-500">Total Billed</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between"><Clock className="h-5 w-5 text-blue-500" /><span className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.upcoming_appointments?.length || 0}</span></div>
                <p className="mt-1 text-sm text-gray-500">Upcoming Appointments</p>
              </div>
            </div>

            {(dashboardData?.upcoming_appointments?.length || 0) > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {dashboardData.upcoming_appointments.map((a: Appointment) => (
                    <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{a.doctor?.full_name || 'Doctor'} <span className="text-xs text-gray-500">({a.doctor?.specialization})</span></p>
                        <p className="text-sm text-gray-500">{a.appointment_date} at {a.appointment_time}</p>
                        {a.purpose && <p className="text-xs text-gray-400 mt-1">{a.purpose}</p>}
                      </div>
                      {statusBadge(a.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'appointments' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">All Appointments</h3>
            {appointments.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No appointments found.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{a.doctor?.full_name || 'Doctor'} <span className="text-xs text-gray-500">({a.doctor?.specialization})</span></p>
                      <p className="text-sm text-gray-500">{a.appointment_date} at {a.appointment_time}</p>
                      {a.purpose && <p className="text-xs text-gray-400 mt-1">{a.purpose}</p>}
                    </div>
                    {statusBadge(a.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'bills' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Bills & Payments</h3>
            {bills.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No bills found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-700">
                      <th className="pb-3 pr-4 font-medium">Bill #</th>
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((b) => (
                      <tr key={b.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">#{b.id}</td>
                        <td className="py-3 pr-4 text-gray-500">{new Date(b.created_at).toLocaleDateString()}</td>
                        <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">${b.total_amount.toLocaleString()}</td>
                        <td className="py-3">{statusBadge(b.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">My Profile</h3>
            {patient && (
              <ProfileForm patient={patient} token={token} onSaved={(p) => setPatient(p)} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileForm({ patient, token, onSaved }: { patient: Patient; token: string; onSaved: (p: Patient) => void }) {
  const [form, setForm] = useState({ ...patient })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/portal/profile', {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (res.ok) onSaved(d.patient)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
        <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
        <input type="date" value={form.dob || ''} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
        <select value={form.gender || ''} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</label>
        <input value={form.blood_group || ''} onChange={e => setForm(p => ({ ...p, blood_group: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
        <textarea value={form.address || ''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={2} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
        <input value={form.city || ''} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
        <input value={form.state || ''} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </div>
      <div className="sm:col-span-2">
        <button disabled={saving} className="rounded-xl bg-rose-600 px-8 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-all">{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  )
}