'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient, type User } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type AuthContextType = {
  user: User | null
  supabase: SupabaseClient
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function getUser() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error.message)
          return
        }

        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (mounted) {
            if (session) {
              setUser(session.user)
              router.refresh()
              if (event === 'SIGNED_IN') {
                toast.success('Successfully signed in!')
              }
            } else {
              setUser(null)
              if (event === 'SIGNED_OUT') {
                toast.success('Successfully signed out!')
                router.push('/login')
              }
            }
          }
        })

        return () => {
          mounted = false
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error in getUser:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getUser()
  }, [supabase, router])

  const value = {
    user,
    supabase,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useSupabase() {
  const { supabase } = useAuth()
  return supabase
}
