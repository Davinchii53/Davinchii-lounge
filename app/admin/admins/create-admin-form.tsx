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
    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-xl p-6 max-w-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
      <h3 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] relative z-10">Create New Admin</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative z-10">
          <label className="block text-sm font-bold text-cyan-400 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all placeholder:text-neutral-600"
          />
        </div>
        <div className="relative z-10">
          <label className="block text-sm font-bold text-cyan-400 mb-1">Preset Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all placeholder:text-neutral-600"
          />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full relative z-10 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-cyan-300 font-bold py-2.5 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Admin Account'}
        </button>
      </form>
    </div>
  )
}
