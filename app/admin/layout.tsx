import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '../dashboard/logout-button'
import ShaderBackground from '@/components/ui/shader-background'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const isAdmin = user.user_metadata?.is_admin === true

  if (!isAdmin) {
    redirect('/dashboard') // Redirect non-admins back to the customer dashboard
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Admins', href: '/admin/admins' },
    { name: 'Customers', href: '/admin/customers' },
    { name: 'Pods', href: '/admin/pods' },
    { name: 'Kitchen Orders', href: '/admin/orders' },
    { name: 'Menu', href: '/admin/menu' },
  ]

  return (
    <div className="flex min-h-screen bg-black text-neutral-100 font-sans relative overflow-hidden">
      <ShaderBackground />
      
      {/* Sidebar */}
      <aside className="relative z-10 w-64 border-r border-cyan-500/30 bg-black/40 backdrop-blur-md flex flex-col shrink-0 shadow-[4px_0_24px_rgba(6,182,212,0.1)]">
        <div className="p-6 border-b border-cyan-500/30">
          <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Davinchii Admin</h1>
          <p className="text-xs text-cyan-400 mt-1 uppercase tracking-wider font-semibold">Lounge Control</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-cyan-500/20 hover:text-cyan-300 hover:shadow-[inset_0_0_12px_rgba(6,182,212,0.3)] transition-all duration-300 border border-transparent hover:border-cyan-500/50"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-cyan-500/30">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
