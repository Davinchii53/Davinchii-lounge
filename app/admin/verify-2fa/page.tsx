'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Verify2FA() {
  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkFactors = async () => {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (error) {
        setError('Failed to fetch MFA status')
        return
      }

      if (data.currentLevel === 'aal2') {
        router.push('/admin') // Already verified
        return
      }

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError || !factorsData) {
        setError('Failed to fetch factors')
        return
      }

      const totpFactor = factorsData.totp[0]
      if (!totpFactor) {
        router.push('/admin/setup-2fa')
        return
      }

      setFactorId(totpFactor.id)
    }

    checkFactors()
  }, [router, supabase])

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
        <h2 className="text-2xl font-bold text-white mb-2">Admin Security</h2>
        <p className="text-neutral-400 text-sm mb-6">Enter the 6-digit code from your authenticator app to access the admin dashboard.</p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded">{error}</p>}

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
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !factorId || code.length < 6}
            className="w-full bg-white hover:bg-neutral-200 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Access'}
          </button>
        </form>
      </div>
    </div>
  )
}
