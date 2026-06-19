import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'
import SessionPanel from './session-panel'
import FnbPanel from './fnb-panel'
import ProfileNameEditor from './profile-name-editor'
import BalanceHistory from './balance-history'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('email, time_balance_seconds, display_name')
    .eq('id', user.id)
    .single()

  if (!customer) {
    redirect('/')
  }

  const { data: activeSession } = await supabase
    .from('sessions')
    .select('id, pod_id, started_at')
    .eq('customer_id', user.id)
    .is('ended_at', null)
    .maybeSingle()

  let podLabel: string | null = null
  let podZone: string | null = null
  let podSpecs: string | null = null

  if (activeSession) {
    const { data: pod } = await supabase
      .from('pods')
      .select('label, zone, specs')
      .eq('id', activeSession.pod_id)
      .single()
    podLabel = pod?.label ?? null
    podZone = pod?.zone ?? null
    podSpecs = pod?.specs ?? null
  }

  const { data: idlePods } = await supabase
    .from('pods')
    .select('id, label, zone, specs')
    .eq('status', 'idle')
    .order('zone')
    .order('label')

  const { data: adjustments } = await supabase
    .from('balance_adjustments')
    .select('id, created_at, type, seconds_delta, note')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .order('category')
    .order('name')

  let sessionOrders: any[] = []
  if (activeSession) {
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        id, total_idr, total_seconds_charged, status, created_at,
        order_items (
          menu_item_id, quantity,
          menu_items (name)
        )
      `)
      .eq('session_id', activeSession.id)
      .order('created_at', { ascending: false })
    sessionOrders = orders ?? []
  }

  const formatBalance = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 font-sans text-neutral-100">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-blue-900/10 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back,</h1>
            <ProfileNameEditor customerId={user.id} currentName={customer.display_name} fallbackEmail={customer.email} />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-neutral-500 uppercase tracking-wide font-medium">Balance</p>
              <p className="text-4xl font-bold bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">{formatBalance(customer.time_balance_seconds)}</p>
            </div>
            <div className="pl-4 border-l border-white/10">
              <LogoutButton hasActiveSession={!!activeSession} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SessionPanel
              activeSession={activeSession ? { 
                ...activeSession, 
                podLabel,
                podZone,
                podSpecs,
                time_balance_seconds: customer.time_balance_seconds
              } : null}
              idlePods={idlePods ?? []}
            />
            {activeSession && (
              <FnbPanel 
                sessionId={activeSession.id}
                menuItems={menuItems ?? []}
                sessionOrders={sessionOrders}
              />
            )}
          </div>
          <div className="space-y-6">
            <BalanceHistory adjustments={adjustments ?? []} />
          </div>
        </div>
      </div>
    </div>
  )
}