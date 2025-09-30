import { useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../state/AuthContext'

export default function EmailOtpForm() {
  const { setAuth } = useAuth()
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/auth/request-otp', { email, name })
      setStep('verify')
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to send OTP'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/verify-otp', { email, code, name })
      setAuth(data.token, data.user)
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Verification failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function resendOtp() {
    if (!email) return
    setError(null)
    setLoading(true)
    try {
      await api.post('/auth/request-otp', { email, name })
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to resend OTP'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Sign up with Email + OTP</h2>
      {step === 'request' && (
        <form onSubmit={requestOtp} className="space-y-3">
          <input
            className="input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{String(error)}</p>}
          <button className="button-primary w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}
      {step === 'verify' && (
        <form onSubmit={verifyOtp} className="space-y-3">
          <input className="input" type="email" value={email} disabled />
          <input
            className="input"
            type="text"
            placeholder="Enter OTP"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{String(error)}</p>}
          <button className="button-primary w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" className="w-full underline text-sm" onClick={resendOtp} disabled={loading || !email}>
            {loading ? 'Resending...' : 'Resend OTP'}
          </button>
        </form>
      )}
    </div>
  )
}
