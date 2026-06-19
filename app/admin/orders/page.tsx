import { createClient } from '@/lib/supabase/server'
import AdminOrderRow from './order-row'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: pendingOrders } = await supabase
    .from('orders')
    .select(`
      id, created_at, status, total_idr,
      sessions (
        pods (label),
        customers (email, display_name)
      ),
      order_items (
        id, quantity,
        menu_items (name)
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Kitchen View</h2>
        <p className="text-neutral-400">Manage pending F&B orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingOrders?.map(order => (
          <AdminOrderRow key={order.id} order={order} />
        ))}
        
        {(!pendingOrders || pendingOrders.length === 0) && (
          <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
            No pending orders. The kitchen is clear!
          </div>
        )}
      </div>
    </div>
  )
}
