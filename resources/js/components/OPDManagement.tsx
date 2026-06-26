import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, Plus, X, ChevronRight, Activity, Heart, Weight, Thermometer, Wind, Eye, Stethoscope, Pill, Loader2, CheckCircle2 } from "lucide-react"

interface Patient { id: number; first_name: string; last_name: string; full_name: string; email: string; phone: string; }
interface Doctor { id: number; full_name: string; specialization: string; }
interface OpdRegistration { id: number; patient_id: number; doctor_id: number; registration_date: string; complaints: string; symptoms: string; status: string; created_at: string; patient: Patient | null; doctor: Doctor | null; vitals: OpdVital[]; consultation: Consultation | null; }
interface OpdVital { id: number; bp_systolic: number; bp_diastolic: number; pulse: number; temperature: number; respiratory_rate: number; spO2: number; weight: number; height: number; recorded_at: string; }
interface Consultation { id: number; diagnosis: string; notes: string; investigations: string; follow_up_date: string; doctor: Doctor | null; prescriptions: Prescription[]; }
interface Prescription { id: number; medicine_name: string; dosage: string; frequency: string; duration: string; instructions: string; }

export default function OPDManagement() {
  const { t } = useLanguage()
  const [registrations, setRegistrations] = useState<OpdRegistration[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selected, setSelected] = useState<OpdRegistration | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'consultation'>('vitals')

  async function fetchData() {
    const [regRes, patRes, docRes] = await Promise.all([
      fetch('/api/opd').then(r => r.json()),
      fetch('/api/patients').then(r => r.json()),
      fetch('/api/doctors').then(r => r.json()),
    ])
    setRegistrations(regRes.registrations || [])
    setPatients(patRes.patients || [])
    setDoctors(docRes.doctors || [])
  }

  useEffect(() => { fetchData() }, [])

  const statusColors: Record<string, string> = { waiting: 'bg-yellow-100 text-yellow-700', in_consultation: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', referred: 'bg-purple-100 text-purple-700' }

  async function openRegistration(r: OpdRegistration) {
    const res = await fetch(`/api/opd/${r.id}`)
    const d = await res.json()
    setSelected(d.registration)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('opdList')}</h2>
        <button onClick={() => { setShowAdd(true); setSelected(null) }} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-all"><Plus className="h-4 w-4" /> {t('opdRegistration')}</button>
      </div>

      {showAdd && <AddRegistrationForm patients={patients} doctors={doctors} onDone={() => { setShowAdd(false); fetchData() }} onCancel={() => setShowAdd(false)} />}

      {selected ? (
        <RegistrationDetail registration={selected} doctors={doctors} onBack={() => setSelected(null)} onRefresh={async () => { const r = await fetch(`/api/opd/${selected.id}`); const d = await r.json(); setSelected(d.registration) }} activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
      ) : (
        <div className="space-y-3">
          {registrations.length === 0 ? (
            <p className="py-8 text-center text-gray-500">{t('opdNoPatients')}</p>
          ) : registrations.map((r) => (
            <button key={r.id} onClick={() => openRegistration(r)} className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm hover:border-rose-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-rose-700 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>{r.status.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-400">{r.registration_date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{r.patient?.full_name || 'Unknown Patient'}</h3>
                  <p className="text-sm text-gray-500">{r.doctor?.full_name || 'No doctor assigned'}</p>
                  {r.complaints && <p className="mt-1 text-xs text-gray-400 line-clamp-1">{r.complaints}</p>}
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

function AddRegistrationForm({ patients, doctors, onDone, onCancel }: { patients: Patient[]; doctors: Doctor[]; onDone: () => void; onCancel: () => void }) {
  const { t } = useLanguage()
  const [patientId, setPatientId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [complaints, setComplaints] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/opd', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId || null, registration_date: new Date().toISOString().split('T')[0], complaints, symptoms }) })
      if (res.ok) onDone()
      else alert('Failed')
    } catch { alert('Failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">{t('opdRegistration')}</h3>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Patient *</label>
          <select required value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option value="">Select patient</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.phone})</option>)}
          </select>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Doctor</label>
          <select value={doctorId} onChange={e => setDoctorId(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option value="">Select doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.full_name} - {d.specialization}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Complaints</label><textarea rows={3} value={complaints} onChange={e => setComplaints(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Symptoms</label><textarea rows={3} value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button disabled={saving} className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">{saving ? 'Saving...' : t('save')}</button>
          <button type="button" onClick={onCancel} className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">{t('cancel')}</button>
        </div>
      </form>
    </div>
  )
}

function VitalsForm({ registration, onDone }: { registration: OpdRegistration; onDone: () => void }) {
  const { t } = useLanguage()
  const [bpS, setBpS] = useState('')
  const [bpD, setBpD] = useState('')
  const [pulse, setPulse] = useState('')
  const [temp, setTemp] = useState('')
  const [rr, setRr] = useState('')
  const [spo2, setSpo2] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/opd/${registration.id}/vitals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bp_systolic: bpS || null, bp_diastolic: bpD || null, pulse: pulse || null, temperature: temp || null, respiratory_rate: rr || null, spO2: spo2 || null, weight: weight || null, height: height || null }) })
      if (res.ok) onDone()
      else alert('Failed')
    } catch { alert('Failed') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">BP Systolic</label><input type="number" value={bpS} onChange={e => setBpS(e.target.value)} placeholder="120" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">BP Diastolic</label><input type="number" value={bpD} onChange={e => setBpD(e.target.value)} placeholder="80" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Pulse</label><input type="number" value={pulse} onChange={e => setPulse(e.target.value)} placeholder="72" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Temp (°C)</label><input type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} placeholder="37.0" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Resp Rate</label><input type="number" value={rr} onChange={e => setRr(e.target.value)} placeholder="16" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">SpO2 (%)</label><input type="number" value={spo2} onChange={e => setSpo2(e.target.value)} placeholder="98" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Weight (kg)</label><input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Height (cm)</label><input type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      <div className="col-span-full flex items-center gap-3 pt-2">
        <button disabled={saving} className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"><Activity className="mr-1.5 inline h-4 w-4" />{saving ? 'Saving...' : t('opdVitals')}</button>
      </div>
    </form>
  )
}

function ConsultationForm({ registration, doctors, onDone }: { registration: OpdRegistration; doctors: Doctor[]; onDone: () => void }) {
  const { t } = useLanguage()
  const [doctorId, setDoctorId] = useState(registration.doctor_id?.toString() || '')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [investigations, setInvestigations] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [rx, setRx] = useState<{ medicine_name: string; dosage: string; frequency: string; duration: string; instructions: string }[]>([])
  const [saving, setSaving] = useState(false)

  function addRx() { setRx([...rx, { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' }]) }
  function updateRx(i: number, f: string, v: string) { const n = [...rx]; n[i] = { ...n[i], [f]: v }; setRx(n) }
  function removeRx(i: number) { setRx(rx.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const body: any = { doctor_id: doctorId || registration.doctor_id, diagnosis, notes, investigations, follow_up_date: followUp || null }
      if (rx.length > 0) body.prescriptions = rx.filter(r => r.medicine_name)
      const res = await fetch(`/api/opd/${registration.id}/consultation`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) onDone()
      else alert('Failed')
    } catch { alert('Failed') }
    finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Doctor</label>
          <select value={doctorId} onChange={e => setDoctorId(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option value="">Select doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
          </select>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Date</label><input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosis</label><textarea rows={3} value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label><textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
        <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Investigations Ordered</label><textarea rows={2} value={investigations} onChange={e => setInvestigations(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-medium text-gray-900 dark:text-white"><Pill className="mr-1.5 inline h-4 w-4" />{t('opdPrescription')}</h4>
          <button type="button" onClick={addRx} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"><Plus className="mr-1 inline h-3 w-3" />{t('addMedicine')}</button>
        </div>
        {rx.map((r, i) => (
          <div key={i} className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/30 sm:grid-cols-5">
            <input placeholder="Medicine" value={r.medicine_name} onChange={e => updateRx(i, 'medicine_name', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            <input placeholder="Dosage" value={r.dosage} onChange={e => updateRx(i, 'dosage', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            <input placeholder="Frequency" value={r.frequency} onChange={e => updateRx(i, 'frequency', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            <input placeholder="Duration" value={r.duration} onChange={e => updateRx(i, 'duration', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            <button type="button" onClick={() => removeRx(i)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"><X className="h-3 w-3" /></button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button disabled={saving} className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"><Stethoscope className="mr-1.5 inline h-4 w-4" />{saving ? 'Completing...' : t('opdConsultation')}</button>
      </div>
    </form>
  )
}

function RegistrationDetail({ registration, doctors, onBack, onRefresh, activeSubTab, setActiveSubTab }: {
  registration: OpdRegistration; doctors: Doctor[]; onBack: () => void; onRefresh: () => void; activeSubTab: 'vitals' | 'consultation'; setActiveSubTab: (t: 'vitals' | 'consultation') => void
}) {
  const { t } = useLanguage()
  return (
    <div>
      <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600">&larr; Back</button>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{registration.patient?.full_name || 'Unknown'}</h3>
            <p className="text-sm text-gray-500">{registration.patient?.email} &middot; {registration.patient?.phone}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${registration.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' : registration.status === 'in_consultation' ? 'bg-blue-100 text-blue-700' : registration.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{registration.status.replace('_', ' ')}</span>
              <span className="text-xs text-gray-400">{registration.registration_date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setActiveSubTab('vitals')} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${activeSubTab === 'vitals' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}><Activity className="mr-1.5 inline h-4 w-4" />{t('opdVitals')}</button>
        <button onClick={() => setActiveSubTab('consultation')} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${activeSubTab === 'consultation' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}><Stethoscope className="mr-1.5 inline h-4 w-4" />{t('opdConsultation')}</button>
      </div>

      {activeSubTab === 'vitals' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">{t('opdVitals')}</h4>
          {registration.vitals && registration.vitals.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
                {registration.vitals[registration.vitals.length - 1].bp_systolic && (
                  <div className="rounded-xl bg-blue-50 p-3 text-center dark:bg-blue-900/20"><Heart className="mx-auto mb-1 h-5 w-5 text-blue-500" /><p className="text-lg font-bold text-gray-900 dark:text-white">{registration.vitals[registration.vitals.length - 1].bp_systolic}/{registration.vitals[registration.vitals.length - 1].bp_diastolic}</p><p className="text-xs text-gray-500">BP</p></div>
                )}
                {registration.vitals[registration.vitals.length - 1].pulse && (
                  <div className="rounded-xl bg-green-50 p-3 text-center dark:bg-green-900/20"><Activity className="mx-auto mb-1 h-5 w-5 text-green-500" /><p className="text-lg font-bold text-gray-900 dark:text-white">{registration.vitals[registration.vitals.length - 1].pulse}</p><p className="text-xs text-gray-500">Pulse</p></div>
                )}
                {registration.vitals[registration.vitals.length - 1].temperature && (
                  <div className="rounded-xl bg-orange-50 p-3 text-center dark:bg-orange-900/20"><Thermometer className="mx-auto mb-1 h-5 w-5 text-orange-500" /><p className="text-lg font-bold text-gray-900 dark:text-white">{registration.vitals[registration.vitals.length - 1].temperature}°C</p><p className="text-xs text-gray-500">Temp</p></div>
                )}
                {registration.vitals[registration.vitals.length - 1].spO2 && (
                  <div className="rounded-xl bg-purple-50 p-3 text-center dark:bg-purple-900/20"><Wind className="mx-auto mb-1 h-5 w-5 text-purple-500" /><p className="text-lg font-bold text-gray-900 dark:text-white">{registration.vitals[registration.vitals.length - 1].spO2}%</p><p className="text-xs text-gray-500">SpO2</p></div>
                )}
              </div>
            </div>
          ) : null}
          {registration.status !== 'completed' && <VitalsForm registration={registration} onDone={onRefresh} />}
        </div>
      )}

      {activeSubTab === 'consultation' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">{t('opdConsultation')}</h4>
          {registration.consultation ? (
            <div>
              <div className="space-y-3">
                {registration.consultation.diagnosis && <div><h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosis</h5><p className="text-gray-900 dark:text-white">{registration.consultation.diagnosis}</p></div>}
                {registration.consultation.notes && <div><h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</h5><p className="text-gray-900 dark:text-white">{registration.consultation.notes}</p></div>}
                {registration.consultation.investigations && <div><h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Investigations</h5><p className="text-gray-900 dark:text-white">{registration.consultation.investigations}</p></div>}
                {registration.consultation.follow_up_date && <div><h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up</h5><p className="text-gray-900 dark:text-white">{registration.consultation.follow_up_date}</p></div>}
              </div>
              {registration.consultation.prescriptions?.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t('opdPrescription')}</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm"><thead><tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-700"><th className="pb-2 pr-3">Medicine</th><th className="pb-2 pr-3">Dosage</th><th className="pb-2 pr-3">Frequency</th><th className="pb-2 pr-3">Duration</th><th className="pb-2">Instructions</th></tr></thead>
                      <tbody>{registration.consultation.prescriptions.map((p, i) => (
                        <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800"><td className="py-2 pr-3 font-medium text-gray-900 dark:text-white">{p.medicine_name}</td><td className="py-2 pr-3 text-gray-500">{p.dosage}</td><td className="py-2 pr-3 text-gray-500">{p.frequency}</td><td className="py-2 pr-3 text-gray-500">{p.duration}</td><td className="py-2 text-gray-500">{p.instructions}</td></tr>
                      ))}</tbody></table>
                  </div>
                </div>
              )}
              {registration.consultation.doctor && <p className="mt-4 text-xs text-gray-400">Attended by: {registration.consultation.doctor.full_name}</p>}
            </div>
          ) : (
            <ConsultationForm registration={registration} doctors={doctors} onDone={onRefresh} />
          )}
        </div>
      )}
    </div>
  )
}