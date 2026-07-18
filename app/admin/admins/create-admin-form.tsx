'use client'

import { useState } from 'react'
import { createAdminAccount } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

export default function CreateAdminForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const result = await createAdminAccount(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Admin account created successfully!')
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-[var(--surface)] border border-white/10 rounded-xl p-6 max-w-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      <h3 className="text-lg font-bold text-white mb-4 relative z-10">Create New Admin</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative z-10">
          <label className="block text-sm font-bold text-cyan-400 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-neutral-600"
          />
        </div>
        <div className="relative z-10">
          <label className="block text-sm font-bold text-cyan-400 mb-1">Preset Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-neutral-600"
          />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full relative z-10 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 active:translate-y-px"
        >
          {loading ? 'Creating...' : 'Create Admin Account'}
        </button>
      </form>
    </div>
  )
}
