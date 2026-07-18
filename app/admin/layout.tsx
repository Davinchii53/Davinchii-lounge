import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '../dashboard/logout-button'

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
    <div className="flex min-h-screen bg-[var(--background)] text-neutral-100 font-sans relative overflow-hidden">
      
      {/* Sidebar */}
      <aside className="relative z-10 w-64 border-r border-white/10 bg-[var(--surface)] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white tracking-tight">Davinchii Admin</h1>
          <p className="text-xs text-cyan-400 mt-1 font-semibold">Lounge Control</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-white/5 hover:text-white transition-colors duration-150 border border-transparent"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
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
