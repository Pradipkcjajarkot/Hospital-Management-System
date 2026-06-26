import { useState, useEffect } from 'react'
import { Search, Stethoscope, Award, Clock, MapPin, Mail, Star, Phone, GraduationCap, BadgeDollarSign, CalendarDays, ArrowLeft, CalendarCheck } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

export default function DoctorDirectory({ setPage }: { setPage: (p: string) => void }) {
  const { t } = useLanguage()
  const [doctors, setDoctors] = useState<any[]>([])
  const [depts, setDepts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/public/doctors').then(r => r.json()),
      fetch('/api/public/departments').then(r => r.json()),
    ]).then(([docs, deps]) => {
      setDoctors(docs)
      setDepts(deps)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase()
    const nameMatch = (d.first_name + ' ' + d.last_name).toLowerCase().includes(q) || d.specialization?.toLowerCase().includes(q) || d.department?.toLowerCase().includes(q)
    const deptMatch = !deptFilter || d.department_id === parseInt(deptFilter)
    return nameMatch && deptMatch
  })

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
      </div>
    )
  }

  if (selectedDoctor) {
    const d = selectedDoctor
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <button onClick={() => setSelectedDoctor(null)} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 transition-all"><ArrowLeft className="h-4 w-4" /> {t('back')} to all doctors</button>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="bg-gradient-to-r from-rose-500 to-red-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/60 bg-white/20 text-3xl font-bold shadow-lg">
                {d.profile_photo_url ? (
                  <img src={d.profile_photo_url} alt={`Dr. ${d.first_name} ${d.last_name}`} className="h-full w-full object-cover" />
                ) : (
                  <>{d.first_name?.[0] || ''}{d.last_name?.[0] || ''}</>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Dr. {d.first_name} {d.last_name}</h1>
                <p className="mt-1 text-rose-100">{d.specialization}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.department && <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">{d.department}</span>}
                  {d.status === 'active' && <span className="rounded-full bg-green-400/30 px-3 py-1 text-xs font-medium backdrop-blur-sm">{t('userActive')}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div className="space-y-4">
              {d.qualification && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"><GraduationCap className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">Qualification</p><p className="text-sm text-gray-500 dark:text-gray-400">{d.qualification}</p></div>
                </div>
              )}
              {d.experience_years && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><Award className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">Experience</p><p className="text-sm text-gray-500 dark:text-gray-400">{d.experience_years} years</p></div>
                </div>
              )}
              {d.consultation_fee && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"><BadgeDollarSign className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">Consultation Fee</p><p className="text-sm text-gray-500 dark:text-gray-400">${d.consultation_fee}</p></div>
                </div>
              )}
              {d.license_number && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"><Star className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">License</p><p className="text-sm text-gray-500 dark:text-gray-400">{d.license_number}</p></div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {d.available_days && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"><CalendarDays className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">Available Days</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(Array.isArray(d.available_days) ? d.available_days : JSON.parse(d.available_days || '[]')).map((day: string) => (
                        <span key={day} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"><Clock className="h-4 w-4" /></div>
                <div><p className="text-sm font-medium text-gray-900 dark:text-white">Hours</p><p className="text-sm text-gray-500 dark:text-gray-400">{d.available_time_start || '09:00'} - {d.available_time_end || '17:00'}</p></div>
              </div>
              {d.email && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"><Mail className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">{t('email')}</p><p className="text-sm text-gray-500 dark:text-gray-400">{d.email}</p></div>
                </div>
              )}
              {d.phone && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"><Phone className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">{t('phone')}</p><p className="text-sm text-gray-500 dark:text-gray-400">{d.phone}</p></div>
                </div>
              )}
              {d.address && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"><MapPin className="h-4 w-4" /></div>
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">Location</p><p className="text-sm text-gray-500 dark:text-gray-400">{d.address}{d.city ? `, ${d.city}` : ''}{d.state ? `, ${d.state}` : ''}</p></div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 dark:border-gray-700">
            <button onClick={() => { setSelectedDoctor(null); setPage('booking') }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all">
              <CalendarCheck className="h-4 w-4" /> {t('bookAppointment')} with Dr. {d.first_name} {d.last_name}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('ourDoctors')}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Meet our team of experienced medical professionals</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder={t('searchDoctor')}
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-900/30"
            />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="">{t('ourDepartments')}</option>
            {depts.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">{t('noDoctors')}</div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d: any) => (
              <button key={d.id} onClick={() => setSelectedDoctor(d)} className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition-all hover:shadow-lg hover:border-rose-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-rose-700">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-red-100 text-xl font-bold text-rose-700 dark:from-rose-900/40 dark:to-red-900/40 dark:text-rose-400">
                    {d.profile_photo_url ? (
                      <img src={d.profile_photo_url} alt={`Dr. ${d.first_name} ${d.last_name}`} className="h-full w-full object-cover" />
                    ) : (
                      <>{d.first_name?.[0] || ''}{d.last_name?.[0] || ''}</>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dr. {d.first_name} {d.last_name}</h3>
                    <p className="text-sm text-rose-600 dark:text-rose-400">{d.specialization}</p>
                    {d.department && <p className="text-xs text-gray-400 truncate">{d.department}</p>}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  {d.experience_years && (
                    <span className="flex items-center gap-2"><Award className="h-4 w-4" /> {d.experience_years} years experience</span>
                  )}
                  {d.qualification && (
                    <span className="flex items-center gap-2"><Star className="h-4 w-4" /> {d.qualification}</span>
                  )}
                  {d.consultation_fee && (
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Fee: ${d.consultation_fee}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
