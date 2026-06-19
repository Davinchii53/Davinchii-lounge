import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl

  if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (url.pathname.startsWith('/admin')) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!adminData) {
        // Not an admin, bounce to customer dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Check MFA
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      
      if (!mfaError && mfaData) {
        if (mfaData.currentLevel !== 'aal2') {
          // They need AAL2. 
          // If nextLevel is aal2, they have enrolled but not verified.
          // If nextLevel is aal1, they have not enrolled.
          const target = mfaData.nextLevel === 'aal2' ? '/admin/verify-2fa' : '/admin/setup-2fa'
          
          if (url.pathname !== target && url.pathname !== '/admin/setup-2fa' && url.pathname !== '/admin/verify-2fa') {
            return NextResponse.redirect(new URL(target, request.url))
          }
        }
      }
    }
  }

  if (url.pathname === '/' || url.pathname === '/signup') {
    if (user) {
      // Check if admin to decide where to redirect
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (adminData) {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
