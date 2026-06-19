import { createClient } from '@/lib/supabase/server'
import AdminMenuRow from './menu-row'

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
  const supabase = await createClient()

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .order('category')
    .order('name')

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Menu Management</h2>
        <p className="text-neutral-400">Manage F&B availability and pricing</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950 border-b border-neutral-800 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {menuItems?.map((item) => (
              <AdminMenuRow key={item.id} item={item} />
            ))}
            {(!menuItems || menuItems.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
