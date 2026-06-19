'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function TopUpForm({ customerId, customerName }: { customerId: string, customerName: string }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: rpcError } = await supabase.rpc('top_up_balance', {
      p_customer_id: customerId,
      p_amount_idr: Number(amount)
    })

    if (rpcError) {
      setError(rpcError.message)
      setLoading(false)
      return
    }

    setAmount('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleTopUp} className="flex gap-2 items-start">
      <div className="flex flex-col gap-1">
        <input
          type="number"
          placeholder="Amount IDR"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-sm text-white w-32 focus:outline-none focus:border-neutral-600"
          required
        />
        {error && <span className="text-xs text-red-500 max-w-[128px] leading-tight">{error}</span>}
      </div>
      <button
        type="submit"
        disabled={loading || !amount}
        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? '...' : 'Top Up'}
      </button>
    </form>
  )
}
