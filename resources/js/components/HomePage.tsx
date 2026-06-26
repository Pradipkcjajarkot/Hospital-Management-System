import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowRight, Calendar, User, Stethoscope, Building2, Activity, Star, Quote, Clock, MapPin, Ambulance, Bed, FlaskConical, Pill, Heart, Baby, Eye, Shield, Award, DollarSign, FileText, Phone, Mail, CheckCircle, Ambulance as Emergency, Syringe, Monitor, Brain } from "lucide-react"

interface HomeData {
  departments: any[]
  doctors: any[]
  testimonials: any[]
  blogPosts: any[]
  events: any[]
  settings: Record<string, string>
  stats: { patients: number; doctors: number; departments: number; years: number }
}

export default function HomePage({ setPage }: { setPage: (p: string) => void }) {
  const { t } = useLanguage()
  const [data, setData] = useState<HomeData | null>(null)
  const [aptForm, setAptForm] = useState({ name: '', phone: '', department: '', doctor: '', date: '', time: '', notes: '' })
  const [aptSaving, setAptSaving] = useState(false)

  useEffect(() => {
    fetch('/api/public/home').then((r) => r.json()).then(setData).catch(() => {})
  }, [])

  async function handleAppointment(e: React.FormEvent) {
    e.preventDefault(); setAptSaving(true)
    try {
      const res = await fetch('/api/public/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptForm),
      })
      if (res.ok) { alert('Appointment booked successfully!'); setAptForm({ name: '', phone: '', department: '', doctor: '', date: '', time: '', notes: '' }) }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Booking failed') }
    finally { setAptSaving(false) }
  }

  if (!data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
      </div>
    )
  }

  const s = data.settings || {}

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000')] bg-cover bg-center bg-no-repeat opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-300 backdrop-blur-sm animate-pulse-glow">
              <Activity className="h-4 w-4 text-rose-400" /> {t('getStarted')} Healthcare
            </div>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl animate-float">
              Your Health Is Our<br />
              <span className="bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent">Top Priority</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-300 animate-float" style={{ animationDelay: '0.5s' }}>
              {s.hospital_name || t('hospitalName')}. {t('heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-breathe">
              <button onClick={() => setPage('booking')} className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-rose-600/25 hover:bg-rose-700 transition-all">
                <Calendar className="h-4 w-4" /> {t('bookAppointment')}
              </button>
              <button onClick={() => setPage('doctors')} className="flex items-center gap-2 rounded-xl border border-gray-600 px-6 py-3 text-sm font-medium text-gray-200 hover:bg-white/10 transition-all">
                <Stethoscope className="h-4 w-4" /> {t('searchDoctor')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-xl sm:grid-cols-3 sm:p-8 lg:grid-cols-5 dark:bg-gray-900 dark:shadow-gray-900/50">
            {[
              { label: t('ourDoctors'), value: data.stats.doctors, icon: Stethoscope },
              { label: t('totalPatients'), value: data.stats.patients.toLocaleString(), icon: User },
              { label: t('departments'), value: data.stats.departments, icon: Building2 },
              { label: t('bedWardTitle'), value: '200+', icon: Bed },
              { label: 'Years Experience', value: data.stats.years + '+', icon: Award },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center animate-float" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Hospital */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-red-50 p-2 dark:from-rose-900/20 dark:to-red-900/10">
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-white dark:bg-gray-800">
                  <Building2 className="h-24 w-24 text-rose-200 dark:text-rose-800" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-rose-600 px-6 py-4 text-white shadow-lg">
                <p className="text-2xl font-bold">{data.stats.years}+</p>
                <p className="text-xs text-rose-100">Years of Excellence</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">{t('getStarted')} {s.hospital_name || t('hospitalName')}</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                We are committed to providing compassionate, high-quality healthcare services to our community. 
                With state-of-the-art facilities and a team of dedicated medical professionals, we ensure every patient receives personalized care.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 dark:border-rose-900/30 dark:bg-rose-900/10 animate-slide-in-left">
                  <Heart className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">Our Mission</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">To deliver exceptional healthcare with compassion, innovation, and a commitment to improving lives.</p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10 animate-slide-in-right">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">Our Vision</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">To be the most trusted healthcare provider, setting standards of excellence in medical care.</p>
                </div>
              </div>
              <button onClick={() => setPage('departments')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all">
                {t('readMore')} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Departments */}
      <section className="bg-gray-50 px-4 py-20 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">{t('ourDepartments')}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Comprehensive medical care across all specialties</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'General Medicine', icon: Stethoscope },
              { name: 'Cardiology', icon: Heart },
              { name: 'Orthopedics', icon: Activity },
              { name: 'Pediatrics', icon: Baby },
              { name: 'Gynecology', icon: User },
              { name: 'Neurology', icon: Brain },
              { name: 'Emergency', icon: Ambulance },
              { name: 'Laboratory', icon: FlaskConical },
            ].map((dept, i) => (
              <div key={dept.name} className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg hover:border-rose-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-rose-800 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-red-50 text-rose-600 group-hover:from-rose-100 group-hover:to-red-100 transition-colors dark:from-rose-900/30 dark:to-red-900/30 dark:text-rose-400">
                  <dept.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{dept.name}</h3>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => setPage('departments')} className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
              {t('viewAll')} {t('departments')} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">Our Services</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Comprehensive healthcare services under one roof</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Online Appointment', desc: 'Book your appointment online and skip the queue with our easy scheduling system.', icon: Calendar },
              { name: 'Emergency Care', desc: '24/7 emergency services with rapid response teams and advanced life support.', icon: Ambulance },
              { name: 'Ambulance', desc: 'Quick and reliable ambulance services available round the clock for emergencies.', icon: Emergency },
              { name: 'Laboratory', desc: 'Fully automated diagnostic lab with accurate and timely test results.', icon: FlaskConical },
              { name: 'Pharmacy', desc: 'Well-stocked pharmacy with quality medicines at affordable prices.', icon: Pill },
              { name: 'ICU', desc: 'Advanced intensive care unit with modern monitoring equipment and skilled staff.', icon: Monitor },
              { name: 'Surgery', desc: 'State-of-the-art operation theaters for general and specialized surgeries.', icon: Syringe },
              { name: 'Health Checkup', desc: 'Comprehensive health checkup packages tailored for all age groups.', icon: Heart },
            ].map((service, i) => (
              <div key={service.name} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-rose-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-rose-800 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-400">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="bg-gray-50 px-4 py-20 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">{t('ourDoctors')}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Experienced specialists dedicated to your health</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.doctors.map((d: any, i: number) => (
              <div key={d.id} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-red-100 text-2xl font-bold text-rose-700 dark:from-rose-900/40 dark:to-red-900/40 dark:text-rose-400">
                  {d.profile_photo_url ? (
                    <img src={d.profile_photo_url} alt={`Dr. ${d.first_name} ${d.last_name}`} className="h-full w-full object-cover" />
                  ) : (
                    <>{(d.first_name?.[0] || '') + (d.last_name?.[0] || '')}</>
                  )}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Dr. {d.first_name} {d.last_name}</h3>
                <p className="text-sm text-rose-600 dark:text-rose-400">{d.specialization}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{d.experience_years} years experience</p>
                <div className="mt-4 flex gap-2 justify-center">
                  <button onClick={() => setPage('doctors')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">{t('viewDetails')}</button>
                  <button onClick={() => setPage('booking')} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700">{t('bookAppointment')}</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => setPage('doctors')} className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
              {t('viewAll')} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Appointment Booking */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">{t('bookingWizard')}</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Schedule your visit with our specialists. We'll confirm your appointment shortly.</p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Clock, text: 'Monday - Friday: 8:00 AM - 8:00 PM' },
                  { icon: Clock, text: 'Saturday: 9:00 AM - 5:00 PM' },
                  { icon: Clock, text: 'Sunday: Emergency Only' },
                  { icon: Phone, text: s.hospital_phone || '+1 234 567 890' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                      <item.icon className="h-4 w-4" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleAppointment} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('fullName')} *</label>
                  <input type="text" required value={aptForm.name} onChange={e => setAptForm({ ...aptForm, name: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Enter your name" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('phone')} *</label>
                  <input type="tel" required value={aptForm.phone} onChange={e => setAptForm({ ...aptForm, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('departments')}</label>
                  <select value={aptForm.department} onChange={e => setAptForm({ ...aptForm, department: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="">Select Department</option>
                    {data.departments.map((d: any) => (
                      <option key={d.id} value={d.name || d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('doctors')}</label>
                  <select value={aptForm.doctor} onChange={e => setAptForm({ ...aptForm, doctor: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="">Select Doctor</option>
                    {data.doctors.map((d: any) => (
                      <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('selectDate')} *</label>
                  <input type="date" required value={aptForm.date} onChange={e => setAptForm({ ...aptForm, date: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Time</label>
                  <input type="time" value={aptForm.time} onChange={e => setAptForm({ ...aptForm, time: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Notes</label>
                  <textarea rows={3} value={aptForm.notes} onChange={e => setAptForm({ ...aptForm, notes: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Any specific concerns..." />
                </div>
              </div>
              <button type="submit" disabled={aptSaving} className="mt-4 w-full rounded-xl bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-all">
                {aptSaving ? t('loading') : t('bookAppointment')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 px-4 py-20 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">Why Choose Us</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">We are committed to providing the best healthcare experience</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Experienced Doctors', desc: 'Our team includes highly qualified and experienced medical professionals.', icon: Award },
              { name: 'Modern Equipment', desc: 'We use the latest medical technology and equipment for accurate diagnosis.', icon: Monitor },
              { name: '24/7 Emergency', desc: 'Round-the-clock emergency services with rapid response teams.', icon: Ambulance },
              { name: 'Affordable Treatment', desc: 'Quality healthcare at competitive prices with transparent billing.', icon: DollarSign },
              { name: 'Online Reports', desc: 'Access your test results and medical records online anytime.', icon: FileText },
              { name: 'Quality Healthcare', desc: 'Compassionate care delivered with the highest standards of excellence.', icon: Shield },
            ].map((feature, i) => (
              <div key={feature.name} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-rose-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-rose-800 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600 group-hover:from-emerald-100 group-hover:to-green-100 transition-colors dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">What Our Patients Say</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Real stories from real people</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {data.testimonials.map((t: any, i: number) => (
                <div key={t.id} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-rose-100 dark:text-rose-900/30" />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">"{t.content}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-red-100 text-sm font-bold text-rose-700 dark:from-rose-900/40 dark:to-red-900/40 dark:text-rose-400">
                      {t.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</p>
                      {t.role && <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {data.blogPosts.length > 0 && (
        <section className="bg-gray-50 px-4 py-20 dark:bg-gray-900/50 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">{t('ourBlog')}</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Health articles, hospital announcements, and medical tips</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {data.blogPosts.map((post: any, i: number) => (
                <div key={post.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">{post.category || 'General'}</p>
                  <h3 className="mt-2 font-semibold text-gray-900 dark:text-white line-clamp-2">{post.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt || post.content}</p>
                  <button onClick={() => setPage('blog')} className="mt-4 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400">
                    {t('readMore')} →
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => setPage('blog')} className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
                {t('viewAll')} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Events Preview */}
      {data.events.length > 0 && (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">{t('upcomingEvents')}</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Health camps, workshops, and community programs</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {data.events.map((e: any, i: number) => (
                <div key={e.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-50 text-center dark:bg-rose-900/30">
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{new Date(e.event_date).getDate()}</span>
                    <span className="text-[10px] font-medium text-rose-500 uppercase">{new Date(e.event_date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{e.title}</h3>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{e.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      {e.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>}
                      {e.event_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {e.event_time}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => setPage('events')} className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
                {t('viewAll')} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="bg-gray-50 px-4 py-20 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-up">{t('contactUs')}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Get in touch with us for any inquiries or assistance</p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{t('address')}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.hospital_address || '123 Medical Center Blvd, City'}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{t('phone')}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.hospital_phone || '+1 234 567 890'}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{t('email')}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.hospital_email || 'info@medicare.com'}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Working Hours</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mon-Fri: 8AM-8PM<br />Sat: 9AM-5PM<br />Sun: Emergency</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => setPage('contact')} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all">
              <Mail className="h-4 w-4" /> {t('sendMessage')}
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-rose-600 to-red-600 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Get Started?</h2>
          <p className="mt-3 text-base text-rose-100 sm:text-lg">Visit our hospital or contact us to book an appointment.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={() => setPage('booking')} className="rounded-xl bg-white px-8 py-3 text-sm font-medium text-rose-600 shadow-lg hover:bg-gray-50 transition-all">
              {t('bookAppointment')}
            </button>
            <button onClick={() => setPage('contact')} className="rounded-xl border border-white/40 px-8 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all">
              {t('contactUs')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}