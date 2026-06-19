'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminMenuRow({ item }: { item: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('menu_items').update({ available: !item.available }).eq('id', item.id)
    setLoading(false)
    router.refresh()
  }

  return (
    <tr className="hover:bg-neutral-800/50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-medium text-white">{item.name}</div>
        <div className="text-xs text-neutral-500 uppercase tracking-wider">{item.category}</div>
      </td>
      <td className="px-6 py-4 text-neutral-300">
        Rp {item.price_idr.toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          item.available 
            ? 'bg-green-500/10 text-green-400 ring-green-500/20'
            : 'bg-red-500/10 text-red-400 ring-red-500/20'
        }`}>
          {item.available ? 'Available' : 'Out of Stock'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={handleToggle}
          disabled={loading}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : item.available ? 'Mark Out of Stock' : 'Mark Available'}
        </button>
      </td>
    </tr>
  )
}
