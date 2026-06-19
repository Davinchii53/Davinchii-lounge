'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfileNameEditor({ customerId, currentName, fallbackEmail }: { customerId: string, currentName: string | null, fallbackEmail: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(currentName || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.from('customers').update({ display_name: name.trim() || null }).eq('id', customerId)
    
    setLoading(false)
    setIsEditing(false)
    router.refresh()
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter username"
          maxLength={30}
          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white px-2 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => { setIsEditing(false); setName(currentName || '') }}
          disabled={loading}
          className="text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center gap-3 mt-1 group">
      <p className="text-lg text-neutral-400">{currentName || fallbackEmail}</p>
      <button
        onClick={() => setIsEditing(true)}
        className="text-xs font-medium text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all border border-neutral-700 hover:border-neutral-500 rounded px-2 py-1 bg-neutral-900/50"
      >
        Edit Name
      </button>
    </div>
  )
}
