import { useState } from 'react'

interface PortalLoginProps {
  onLogin: (token: string) => void
  onBack: () => void
}

export default function PortalLogin({ onLogin, onBack }: PortalLoginProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/portal/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, password, remember }) })
      const d = await res.json()
      if (res.ok) { onLogin(d.token) }
      else { setError(d.message || 'Login failed') }
    } catch { setError('Connection error') }
    finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/portal/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, password }) })
      const d = await res.json()
      if (res.ok) { onLogin(d.token) }
      else { setError(d.message || 'Registration failed') }
    } catch { setError('Connection error') }
    finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <button onClick={onBack} className="mb-6 text-sm text-gray-500 hover:text-rose-600">&larr; Back to website</button>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Portal</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Access your health records and appointments</p>
        </div>

        <div className="mb-6 flex rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
          <button onClick={() => setTab('login')} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Login</button>
          <button onClick={() => setTab('register')} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Register</button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <button disabled={loading} className="w-full rounded-xl bg-rose-600 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-all">{loading ? 'Logging in...' : 'Login'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
                <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
                <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
              <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password *</label>
              <input required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <button disabled={loading} className="w-full rounded-xl bg-rose-600 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-all">{loading ? 'Registering...' : 'Create Account'}</button>
          </form>
        )}
      </div>
    </div>
  )
}