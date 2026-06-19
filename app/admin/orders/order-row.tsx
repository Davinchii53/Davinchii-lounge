'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminOrderRow({ order }: { order: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('orders').update({ status: 'completed' }).eq('id', order.id)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded">
              {order.status}
            </span>
            <p className="text-xs text-neutral-500 mt-2">
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{order.sessions?.pods?.label || 'Unknown Pod'}</p>
            <p className="text-xs text-neutral-500">{order.sessions?.customers?.display_name || order.sessions?.customers?.email}</p>
          </div>
        </div>
        
        <ul className="space-y-2 mb-6">
          {order.order_items?.map((item: any) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-300">
                <span className="text-neutral-500 mr-2">{item.quantity}x</span>
                {item.menu_items?.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleComplete}
        disabled={loading}
        className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? 'Updating...' : 'Mark Delivered'}
      </button>
    </div>
  )
}
