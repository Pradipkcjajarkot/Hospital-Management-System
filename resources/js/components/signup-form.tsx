import { type FormEvent, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function SignUpForm() {
    const { t } = useLanguage()
    const [username, setUsername] = useState('')
    const [gmail, setGmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'))
            setLoading(false)
            return
        }
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify({ name: username, email: gmail, phone, password, password_confirmation: confirmPassword }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            window.location.href = '/dashboard'
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-800">{t('createAccount')}</h1>
                <p className="text-sm text-gray-500">{t('signupSubtitle')}</p>
            </div>
            {error && <p className="text-center text-sm text-red-600">{error}</p>}
            {success && <p className="text-center text-sm text-green-600">{success}</p>}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-username" className="text-sm font-medium text-gray-700">{t('username')}</label>
                    <input
                        id="signup-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        placeholder="johndoe"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-gmail" className="text-sm font-medium text-gray-700">{t('gmail')}</label>
                    <input
                        id="signup-gmail"
                        type="email"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        placeholder="johndoe@gmail.com"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-phone" className="text-sm font-medium text-gray-700">{t('phoneNumber')}</label>
                    <input
                        id="signup-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        placeholder="+1 234 567 8900"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">{t('password')}</label>
                    <div className="relative">
                        <input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            placeholder="••••••••"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPassword ? (
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700">{t('confirmPassword')}</label>
                    <div className="relative">
                        <input
                            id="signup-confirm-password"
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            placeholder="••••••••"
                            required
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirm ? (
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50">
                    {loading ? t('creatingAccount') : t('signUp')}
                </button>
            </div>
        </form>
    )
}
