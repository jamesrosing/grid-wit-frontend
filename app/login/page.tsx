'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UserAuthForm } from '@/components/user-auth-form'
import { Icons } from '@/components/icons'

export default function AuthenticationPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center'>
      <div className='container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-8 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <Icons.logo className='mr-2 h-6 w-6' />
            Grid Wit
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                {"Crosswords are like a mental gym where every clue is a new exercise for your brain."}
              </p>
              <footer className='text-sm'>Will Shortz</footer>
            </blockquote>
          </div>
        </div>
        <div className='p-4 lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Welcome to Grid Wit
              </h1>
              <p className='text-sm text-muted-foreground'>
                Sign in to your account to continue
              </p>
            </div>
            <UserAuthForm />
            {error && (
              <p className='text-sm text-red-500'>
                {error}
              </p>
            )}
            <p className='text-center text-xs text-muted-foreground'>
              By clicking continue, you agree to our{' '}
          <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}