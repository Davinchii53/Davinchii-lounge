'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Setup2FA() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const setup = async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Davinchii Lounge'
      })
      if (error) {
        setError(error.message)
        return
      }
      setFactorId(data.id)
      setQrCode(data.totp.qr_code)
    }
    setup()
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!factorId || !code) return

    setLoading(true)
    setError('')

    const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code
    })

    if (verifyErr) {
      setError(verifyErr.message)
      setLoading(false)
      return
    }

    // Success
    setLoading(false)
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Set up 2FA</h2>
        <p className="text-neutral-400 text-sm mb-6">Scan this QR code with Google Authenticator or Authy to secure your admin account.</p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded">{error}</p>}

        {qrCode ? (
          <div className="mb-6 flex justify-center bg-white p-4 rounded-lg w-max mx-auto">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          </div>
        ) : (
          <p className="text-neutral-500 mb-6 text-center">Loading QR Code...</p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neutral-600 text-center tracking-widest text-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !qrCode || code.length < 6}
            className="w-full bg-white hover:bg-neutral-200 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  )
}
