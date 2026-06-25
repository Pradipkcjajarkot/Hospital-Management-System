import { useState } from 'react'
import { ChevronRight } from "lucide-react"

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '', dob: '', gender: '',
  blood_group: '', address: '', city: '', state: '', pincode: '',
  emergency_contact_name: '', emergency_contact_phone: '',
  medical_history: '', allergies: '', status: 'active',
}

export default function RegisterPatient() {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(field: string, value: string) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
        setForm(emptyForm)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await res.json()
        alert(Object.values(data.errors || { message: data.message || 'Error' }).flat().join('\n'))
      }
    } catch {
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Register New Patient</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the details to register a new patient.</p>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          Patient registered successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Personal Information</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'First Name', key: 'first_name', required: true },
                { label: 'Last Name', key: 'last_name', required: true },
              ].map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    {f.label}{f.required && <span className="text-rose-500 ml-0.5">*</span>}
                  </label>
                  <input value={(form as any)[f.key]} onChange={(e) => set(f.key, e.target.value)} required={f.required}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                </div>
              ))}
              {[
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'Date of Birth', key: 'dob', type: 'date' },
                { label: 'Gender', key: 'gender', type: 'select', options: ['', 'male', 'female', 'other'] },
                { label: 'Blood Group', key: 'blood_group', type: 'select', options: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
                { label: 'Status', key: 'status', type: 'select', options: ['active', 'inactive', 'discharged'] },
              ].map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={(form as any)[f.key]} onChange={(e) => set(f.key, e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                      {f.options.map((o) => <option key={o} value={o}>{o || 'Select...'}</option>)}
                    </select>
                  ) : (
                    <input type={f.type || 'text'} value={(form as any)[f.key]} onChange={(e) => set(f.key, e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Address Details</h3>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Address</label>
              <textarea value={form.address} onChange={(e) => set('address', e.target.value)} rows={2}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'City', key: 'city' },
                { label: 'State', key: 'state' },
                { label: 'Pincode', key: 'pincode' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={(e) => set(f.key, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Emergency Contact</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Contact Name</label>
                <input value={form.emergency_contact_name} onChange={(e) => set('emergency_contact_name', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Contact Phone</label>
                <input value={form.emergency_contact_phone} onChange={(e) => set('emergency_contact_phone', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-gray-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Medical Information</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Medical History</label>
                <textarea value={form.medical_history} onChange={(e) => set('medical_history', e.target.value)} rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Allergies</label>
                <textarea value={form.allergies} onChange={(e) => set('allergies', e.target.value)} rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-rose-400/25 focus:border-rose-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
          <button type="button" onClick={() => setForm(emptyForm)}
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600">
            Reset
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            {saving ? 'Saving...' : 'Register Patient'} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
