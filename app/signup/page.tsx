'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ShaderBackground from '@/components/ui/shader-background'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (!data.session) {
      setError('Account created, but no session was returned. Try logging in.')
      setLoading(false)
      router.push('/')
      return
    }

    // Proxy.ts guards routes, just send the user to the dashboard
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 font-sans text-neutral-100 relative overflow-hidden">
      <ShaderBackground />
      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-[var(--surface)] p-8 shadow-lg"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-normal tracking-tight text-white">Create Account</h1>
          <p className="text-sm font-medium text-neutral-400">Join Davinchii Lounge</p>
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
              minLength={8}
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
          {loading ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <a href="/" className="font-semibold text-white hover:text-blue-400 hover:underline transition-all underline-offset-4">
            Sign in here
          </a>
        </p>
      </form>
    </div>
  )
}