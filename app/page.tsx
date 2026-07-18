'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ShaderBackground from '@/components/ui/shader-background'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Check if the user is an admin
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single()
        
      if (adminData) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }
    
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 font-sans text-neutral-100 relative overflow-hidden">
      <ShaderBackground />
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-[var(--surface)] p-8 shadow-lg"
      >
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-serif font-normal tracking-tight text-white">Davinchii</h1>
          <p className="text-sm font-medium text-neutral-400">Login to your lounge account</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 py-2.5 text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 transition-colors duration-150"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 py-2.5 text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 transition-colors duration-150"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 active:translate-y-px"
        >
          {loading ? 'Signing in...' : 'Start Session'}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-semibold text-white hover:text-blue-400 hover:underline transition-all underline-offset-4">
            Sign up here
          </a>
        </p>
      </form>
    </div>
  )
}