import { useState, useEffect } from 'react'
import { CheckCircle2, Calendar, Clock, User, Stethoscope, ChevronRight, ChevronLeft, Loader2, Building2, Check } from "lucide-react"

interface Department { id: number; name: string }
interface Doctor { id: number; first_name: string; last_name: string; full_name: string; specialization: string; consultation_fee: number; department: string; profile_photo_url: string | null }
interface BookingWizardProps { setPage: (p: string) => void }

const steps = ['Department', 'Doctor', 'Date & Time', 'Details', 'Confirm']

export default function BookingWizard({ setPage }: BookingWizardProps) {
  const [step, setStep] = useState(0)
  const [departments, setDepartments] = useState<Department[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const [selectedDept, setSelectedDept] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [purpose, setPurpose] = useState('')

  useEffect(() => { fetch('/api/public/departments').then(r => r.json()).then(setDepartments).catch(() => {}) }, [])
  useEffect(() => {
    if (!selectedDept) return
    fetch('/api/public/doctors').then(r => r.json()).then((data) => {
      setDoctors((Array.isArray(data) ? data : data.doctors || []).filter((d: Doctor) => d.department === selectedDept))
    }).catch(() => {})
  }, [selectedDept])

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) { setSlots([]); return }
    setLoading(true)
    fetch(`/api/public/doctors/${selectedDoctor.id}/slots?date=${selectedDate}`).then(r => r.json()).then(d => {
      setSlots(d.slots || [])
    }).catch(() => setSlots([])).finally(() => setLoading(false))
  }, [selectedDoctor, selectedDate])

  const today = new Date().toISOString().split('T')[0]

  const canProceed = () => {
    if (step === 0) return !!selectedDept
    if (step === 1) return !!selectedDoctor
    if (step === 2) return !!selectedDate && !!selectedTime
    if (step === 3) return !!firstName && !!lastName && !!email && !!phone
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/public/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, doctor_id: selectedDoctor!.id, appointment_date: selectedDate, appointment_time: selectedTime, purpose }),
      })
      if (res.ok) { setDone(true) }
      else { const d = await res.json(); alert(d.message || 'Booking failed') }
    } catch { alert('Booking failed') }
    finally { setSubmitting(false) }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Appointment Booked!</h2>
        <p className="mb-2 text-gray-600 dark:text-gray-400">Your appointment with <strong>{selectedDoctor?.full_name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been scheduled.</p>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">We will contact you at {email} or {phone} for confirmation.</p>
        <button onClick={() => setPage('home')} className="rounded-xl bg-rose-600 px-8 py-3 text-white hover:bg-rose-700 transition-all">Back to Home</button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book an Appointment</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Schedule your visit in just a few steps</p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`ml-2 hidden text-sm font-medium sm:inline ${i <= step ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`mx-3 h-px w-8 sm:w-16 ${i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

        {step === 0 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><Building2 className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Department</h2><p className="text-sm text-gray-500">Choose the department you need</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {departments.map((dept) => (
                <button key={dept.id} onClick={() => setSelectedDept(dept.name)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    selectedDept === dept.name ? 'border-rose-500 bg-rose-50 dark:border-rose-400 dark:bg-rose-900/20' : 'border-gray-200 hover:border-rose-200 dark:border-gray-700 dark:hover:border-rose-700'
                  }`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{dept.name}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><Stethoscope className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Doctor</h2><p className="text-sm text-gray-500">Choose a specialist</p></div>
            </div>
            {doctors.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No doctors available in this department.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {doctors.map((doc) => (
                  <button key={doc.id} onClick={() => setSelectedDoctor(doc)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      selectedDoctor?.id === doc.id ? 'border-rose-500 bg-rose-50 dark:border-rose-400 dark:bg-rose-900/20' : 'border-gray-200 hover:border-rose-200 dark:border-gray-700 dark:hover:border-rose-700'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-red-100 text-sm font-bold text-rose-700">
                        {doc.profile_photo_url ? <img src={doc.profile_photo_url} alt={doc.full_name} className="h-full w-full object-cover" /> : <>{doc.first_name[0]}{doc.last_name[0]}</>}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{doc.full_name}</h3>
                        <p className="text-xs text-gray-500">{doc.specialization}</p>
                        {doc.consultation_fee > 0 && <p className="text-xs font-medium text-rose-600">${doc.consultation_fee}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><Calendar className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Date & Time</h2><p className="text-sm text-gray-500">Pick your preferred slot</p></div>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input type="date" value={selectedDate} min={today}
                onChange={e => { setSelectedDate(e.target.value); setSelectedTime('') }}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-rose-500" /></div>
            ) : selectedDate && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Available Slots</label>
                {slots.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">No available slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((time) => (
                      <button key={time} onClick={() => setSelectedTime(time)}
                        className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                          selectedTime === time ? 'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-400 dark:bg-rose-900/20 dark:text-rose-400'
                            : 'border-gray-200 text-gray-700 hover:border-rose-200 dark:border-gray-700 dark:text-gray-300 dark:hover:border-rose-700'
                        }`}>
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><User className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Details</h2><p className="text-sm text-gray-500">We'll use this to confirm your appointment</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="John" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Doe" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="john@example.com" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="+1 234 567 890" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Visit (optional)</label>
                <textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Brief description of your symptoms or reason..." />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><CheckCircle2 className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Appointment</h2><p className="text-sm text-gray-500">Review your details before confirming</p></div>
            </div>
            <div className="space-y-3 rounded-xl bg-gray-50 p-5 dark:bg-gray-700/50">
              <div className="flex justify-between border-b border-gray-200 pb-2 dark:border-gray-600"><span className="text-sm text-gray-500">Department</span><span className="text-sm font-medium text-gray-900 dark:text-white">{selectedDept}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 dark:border-gray-600"><span className="text-sm text-gray-500">Doctor</span><span className="text-sm font-medium text-gray-900 dark:text-white">{selectedDoctor?.full_name}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 dark:border-gray-600"><span className="text-sm text-gray-500">Date</span><span className="text-sm font-medium text-gray-900 dark:text-white">{selectedDate}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 dark:border-gray-600"><span className="text-sm text-gray-500">Time</span><span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTime}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 dark:border-gray-600"><span className="text-sm text-gray-500">Patient</span><span className="text-sm font-medium text-gray-900 dark:text-white">{firstName} {lastName}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 dark:border-gray-600"><span className="text-sm text-gray-500">Email</span><span className="text-sm font-medium text-gray-900 dark:text-white">{email}</span></div>
              <div className="flex justify-between border-b border-gray-200 pb-2 dark:border-gray-600"><span className="text-sm text-gray-500">Phone</span><span className="text-sm font-medium text-gray-900 dark:text-white">{phone}</span></div>
              {purpose && <div className="flex justify-between"><span className="text-sm text-gray-500">Reason</span><span className="text-sm font-medium text-gray-900 dark:text-white">{purpose}</span></div>}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : setPage('home')}
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <ChevronLeft className="h-4 w-4" /> {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < 4 ? (
            <button onClick={() => canProceed() && setStep(s => s + 1)} disabled={!canProceed()}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-all">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-all">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</> : <><CheckCircle2 className="h-4 w-4" /> Confirm Booking</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}