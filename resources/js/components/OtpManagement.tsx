import { useState, useEffect } from 'react'
import { Search, RefreshCw, CheckCircle, XCircle, Clock, Mail } from "lucide-react"
import axios from 'axios'

interface OtpLog {
  id: number
  email: string
  otp: string
  purpose: string
  status: string
  expires_at: string | null
  verified_at: string | null
  created_at: string
}

export default function OtpManagement() {
  const [otps, setOtps] = useState<OtpLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [resending, setResending] = useState<number | null>(null)

  useEffect(() => {
    loadOtps()
  }, [page, search])

  async function loadOtps() {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/admin/otps?page=${page}&search=${search}`)
      setOtps(data.data)
      setTotalPages(data.last_page || 1)
    } catch (e) {
      console.error('Failed to load OTPs', e)
    } finally {
      setLoading(false)
    }
  }

  async function resendOtp(id: number) {
    setResending(id)
    try {
      await axios.post(`/api/admin/otps/${id}/resend`)
      loadOtps()
    } catch (e) {
      console.error('Failed to resend OTP', e)
    } finally {
      setResending(null)
    }
  }

  function statusBadge(status: string) {
    const styles: Record<string, string> = {
      sent: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      verified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      resent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OTP Management</h1>
        <button onClick={loadOtps} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">OTP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Purpose</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Expires</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sent At</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : otps.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No OTP logs found</td></tr>
              ) : otps.map(otp => (
                <tr key={otp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{otp.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{otp.otp}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{otp.purpose}</span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(otp.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {otp.expires_at ? new Date(otp.expires_at).toLocaleString() : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(otp.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {otp.status === 'sent' && (
                      <button
                        onClick={() => resendOtp(otp.id)}
                        disabled={resending === otp.id}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                      >
                        {resending === otp.id ? 'Resending...' : 'Resend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded text-sm ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
