import { createClient } from '@supabase/supabase-js'
import CreateAdminForm from './create-admin-form'
import DeleteAdminButton from './delete-admin-button'

export const dynamic = 'force-dynamic'

export default async function AdminAccountsPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-2xl text-red-400 space-y-4">
          <h2 className="text-xl font-bold">Missing Environment Variable</h2>
          <p>
            You need to add your <strong>Service Role Key</strong> to your <code>.env.local</code> file to use the Admin Management features.
          </p>
          <div className="bg-black/50 p-4 rounded font-mono text-sm border border-red-500/10">
            SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
          </div>
          <p className="text-sm text-red-400/80 mt-4">
            You can find this key in your Supabase Dashboard: <br/>
            Project Settings &rarr; API &rarr; Project API Keys &rarr; <code>service_role</code> (secret)
          </p>
          <p className="text-sm font-bold text-white mt-4">
            After adding it, you MUST restart your Next.js development server!
          </p>
        </div>
      </div>
    )
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false }
    }
  )

  const { data: admins } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 space-y-8 relative z-10">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Admin Accounts</h2>
        <p className="text-cyan-400/80 font-medium tracking-wide">Manage lounge staff access</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Current Admins</h3>
          <div className="bg-black/40 border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-cyan-950/40 border-b border-cyan-500/30 text-xs uppercase font-bold text-cyan-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/20">
                {admins?.map((admin) => (
                  <tr key={admin.id} className="hover:bg-cyan-900/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{admin.email}</td>
                    <td className="px-6 py-4 text-cyan-500/80 font-medium">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteAdminButton adminId={admin.id} adminEmail={admin.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <CreateAdminForm />
        </div>
      </div>
    </div>
  )
}
