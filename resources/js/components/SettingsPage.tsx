import { useState, useEffect, useRef } from 'react'
import { Settings, Building2, Mail, Phone, MapPin, Shield, Clock, KeyRound, Save, CheckCircle2, Upload, Image as ImageIcon, Trash2, Globe } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logoPreview, setLogoPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    try { const r = await fetch('/api/settings'); const d = await r.json(); const s = d.settings ?? {}; setSettings(s); setLogoPreview(s.hospital_logo || '') } catch { /* ignore */ }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('logo', file)
    try {
      const res = await fetch('/api/upload-logo', { method: 'POST', body: formData })
      const d = await res.json()
      if (res.ok) { setLogoPreview(d.url); setSettings(prev => ({ ...prev, hospital_logo: d.url })) }
      else alert(d.message || 'Upload failed')
    } catch { alert('Upload failed') }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  function handleRemoveLogo() {
    setLogoPreview('')
    setSettings(prev => ({ ...prev, hospital_logo: '' }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings }),
      })
      if (res.ok) {
        const d = await res.json()
        setSettings(d.settings ?? {})
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else { alert('Save failed') }
    } catch { alert('Save failed') }
    finally { setSaving(false) }
  }

  const generalFields = [
    { key: 'hospital_name', label: 'Hospital Name', icon: Building2, placeholder: 'MediCare Hospital' },
    { key: 'hospital_email', label: 'Email', icon: Mail, placeholder: 'info@medicare.com', type: 'email' },
    { key: 'hospital_phone', label: 'Phone', icon: Phone, placeholder: '+1 234 567 890' },
    { key: 'hospital_address', label: 'Address', icon: MapPin, placeholder: '123 Medical Center Blvd' },
  ]

  const securityFields = [
    { key: 'two_factor_auth', label: 'Two-Factor Auth', icon: Shield, options: ['enabled', 'disabled'] },
    { key: 'session_timeout', label: 'Session Timeout (minutes)', icon: Clock, placeholder: '30' },
    { key: 'password_policy', label: 'Password Policy', icon: KeyRound, options: ['strong', 'medium', 'weak'] },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage hospital and system settings.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          {saving ? 'Saving...' : saved ? <><CheckCircle2 className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">{t('language')}</h3>
        <div className="flex items-center gap-4">
          <Globe className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}>
              {t('english')}
            </button>
            <button onClick={() => setLang('ne')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${lang === 'ne' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}>
              {t('nepali')}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Hospital Logo</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-all">
              <Upload className="h-4 w-4" /> Upload Logo
            </button>
            {logoPreview && (
              <button onClick={handleRemoveLogo} className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            )}
            <p className="text-xs text-gray-400">Recommended: 200x60px. PNG, JPG, SVG or WebP (max 2MB)</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">General Settings</h3>
          <div className="space-y-4">
            {generalFields.map(({ key, label, icon: Icon, placeholder, type }) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  <Icon className="mr-1 inline h-3.5 w-3.5" /> {label}
                </label>
                <input type={type || 'text'} value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={placeholder}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Security</h3>
          <div className="space-y-4">
            {securityFields.map(({ key, label, icon: Icon, placeholder, options }) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  <Icon className="mr-1 inline h-3.5 w-3.5" /> {label}
                </label>
                {options ? (
                  <select value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                    {options.map((o) => <option key={o} value={o}>{o.replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
                  </select>
                ) : (
                  <input value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/webp" className="hidden" onChange={handleLogoUpload} />
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
