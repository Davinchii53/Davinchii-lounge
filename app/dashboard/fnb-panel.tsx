'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

type MenuItem = {
  id: string
  name: string
  category: string
  price_idr: number
  available: boolean
}

type OrderItem = {
  menu_item_id: string
  quantity: number
  menu_items: { name: string }
}

type Order = {
  id: string
  total_idr: number
  total_seconds_charged: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function FnbPanel({
  sessionId,
  menuItems,
  sessionOrders
}: {
  sessionId: string
  menuItems: MenuItem[]
  sessionOrders: Order[]
}) {
  const [cart, setCart] = useState<{ [id: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [overrideOrders, setOverrideOrders] = useState<Order[] | undefined>(undefined)

  useEffect(() => {
    setOverrideOrders(undefined)
  }, [sessionOrders])

  const displayOrders = overrideOrders !== undefined ? overrideOrders : sessionOrders

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0
      const next = current + delta
      if (next <= 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: next }
    })
  }

  const handleSubmit = async () => {
    if (Object.keys(cart).length === 0) return
    setError('')
    setLoading(true)

    const optimisticItems: OrderItem[] = Object.entries(cart).map(([id, qty]) => {
      const item = menuItems.find(m => m.id === id)
      return {
        menu_item_id: id,
        quantity: qty,
        menu_items: { name: item?.name ?? 'Unknown' }
      }
    })

    const currentTotalIdr = Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = menuItems.find(m => m.id === id)
      return sum + (item ? item.price_idr * qty : 0)
    }, 0)

    const optimisticOrder: Order = {
      id: 'optimistic-' + Date.now(),
      total_idr: currentTotalIdr,
      total_seconds_charged: 0,
      status: 'pending',
      created_at: new Date().toISOString(),
      order_items: optimisticItems
    }

    setOverrideOrders([optimisticOrder, ...sessionOrders])
    setCart({})

    const itemsPayload = Object.entries(cart).map(([id, quantity]) => ({
      menu_item_id: id,
      quantity
    }))

    const supabase = createClient()
    const { error: orderError } = await supabase.rpc('create_order', {
      p_session_id: sessionId,
      p_items: itemsPayload
    })

    if (orderError) {
      setError(orderError.message)
      setLoading(false)
      setOverrideOrders(undefined)
      setCart(cart)
      return
    }

    setLoading(false)
    router.refresh()
  }

  const totalIdr = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => m.id === id)
    return sum + (item ? item.price_idr * qty : 0)
  }, 0)

  const foodItems = menuItems.filter(m => m.category === 'food' && m.available)
  const drinkItems = menuItems.filter(m => m.category === 'drink' && m.available)

  const renderMenuSection = (title: string, items: MenuItem[]) => {
    if (items.length === 0) return null
    return (
      <div className="space-y-2 relative z-10">
        <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{title}</h3>
        <div className="grid grid-cols-1 gap-2">
          {items.map(item => {
            const qty = cart[item.id] || 0
            return (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/10 transition-colors hover:bg-cyan-900/20 hover:border-cyan-500/30">
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-neutral-400 font-mono">Rp {item.price_idr.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-3 bg-black/60 rounded-md border border-cyan-500/20 px-2 py-1 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
                  <button onClick={() => handleUpdateQuantity(item.id, -1)} className="text-cyan-500 hover:text-cyan-300 px-1 disabled:opacity-20 transition-colors font-bold" disabled={qty === 0}>-</button>
                  <span className="text-sm w-4 text-center text-white font-mono">{qty}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, 1)} className="text-cyan-500 hover:text-cyan-300 px-1 transition-colors font-bold">+</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700"></div>

      <div className="relative z-10">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">Requisitions / F&B</h2>
        <div className="space-y-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {renderMenuSection('Food', foodItems)}
          {renderMenuSection('Drinks', drinkItems)}
        </div>
      </div>

      {Object.keys(cart).length > 0 && (
        <div className="pt-4 border-t border-white/10 space-y-4 relative z-10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total</span>
            <span className="font-mono text-xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Rp {totalIdr.toLocaleString()}</span>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:shadow-none"
          >
            {loading ? 'Processing...' : 'Transmit Order'}
          </button>
        </div>
      )}

      {displayOrders.length > 0 && (
        <div className="pt-6 border-t border-white/10 relative z-10">
          <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Active Requisitions</h3>
          <div className="space-y-3">
            {displayOrders.map(order => (
              <div key={order.id} className="p-4 rounded-lg bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm border ${order.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-mono font-medium text-neutral-300">Rp {order.total_idr.toLocaleString()}</span>
                </div>
                <div className="space-y-1.5">
                  {order.order_items.map((oi, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-neutral-400 font-medium">
                      <span><span className="text-cyan-500">{oi.quantity}x</span> {oi.menu_items.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
