import { createClient } from '@/lib/supabase/server'
import TopUpForm from './topup-form'
import RemoveCustomerButton from './remove-customer-button'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('customers')
    .select('id, email, display_name, time_balance_seconds, created_at')
    .order('created_at', { ascending: false })

  const formatBalance = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Customers Management</h2>
        <p className="text-neutral-400">View and top up customer balances</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950 border-b border-neutral-800 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {customers?.map((customer) => (
              <tr key={customer.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{customer.display_name || 'No name'}</div>
                  <div className="text-neutral-500">{customer.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                    {formatBalance(customer.time_balance_seconds)}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-500">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 flex items-center">
                  <TopUpForm customerId={customer.id} customerName={customer.display_name || customer.email} />
                  <RemoveCustomerButton customerId={customer.id} customerName={customer.display_name || customer.email} />
                </td>
              </tr>
            ))}
            {(!customers || customers.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
