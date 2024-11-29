'use client'

import { HTMLAttributes, useState } from "react"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from 'sonner'

export function UserAuthForm({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error('Authentication failed')
      }
    } catch (_err) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  async function onGoogleSignIn() {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error('Authentication failed')
      }
    } catch (_err) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        Sign in with GitHub
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={onGoogleSignIn} disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Sign in with Google
      </Button>
    </div>
  )
}
