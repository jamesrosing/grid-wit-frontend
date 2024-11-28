import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session and trying to access protected route, redirect to login
    if (!session && !req.nextUrl.pathname.startsWith('/login')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }

    // If session exists and trying to access login page, redirect to home
    if (session && req.nextUrl.pathname.startsWith('/login')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bookmarks/:path*',
    '/favorites/:path*',
    '/in-progress/:path*',
    '/profile/:path*',
    '/login'
  ]
}