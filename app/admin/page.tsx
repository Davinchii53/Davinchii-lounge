import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch metrics
  const { count: activePodsCount } = await supabase
    .from('pods')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'idle')
    .neq('status', 'maintenance') // essentially active

  const { count: totalPodsCount } = await supabase
    .from('pods')
    .select('id', { count: 'exact', head: true })

  const { count: pendingOrdersCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div className="p-8 space-y-8 relative z-10">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Dashboard Overview</h2>
        <p className="text-cyan-400/80 font-medium tracking-wide">At-a-glance lounge metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">Active Pods</p>
          <div className="mt-2 flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{activePodsCount ?? 0}</span>
            <span className="text-sm text-cyan-500/70">/ {totalPodsCount ?? 0} total</span>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-amber-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(245,158,11,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <p className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Pending Orders</p>
          <div className="mt-2 flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-bold text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{pendingOrdersCount ?? 0}</span>
            <span className="text-sm text-amber-500/70">awaiting</span>
          </div>
          {Number(pendingOrdersCount) > 0 && (
            <Link href="/admin/orders" className="relative z-10 text-sm font-bold text-amber-400 hover:text-amber-300 mt-4 block flex items-center gap-1 transition-colors">
              View Kitchen Orders 
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
