'use client'

import { Icons } from '@/components/icons'
import { UserAuthForm } from '@/components/user-auth-form'
import { useState } from 'react'

export default function LoginPage() {
  const [authType, setAuthType] = useState<'login' | 'register'>('login')

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" />
          Grid Wit
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &quot;Unlock your mind. One word at a time.&quot;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {authType === 'login' ? 'Welcome back!' : 'Create an account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {authType === 'login' 
                ? 'Enter your email below to sign in to your account'
                : 'Enter your email below to create your account'
              }
            </p>
          </div>
          <UserAuthForm type={authType} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {authType === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button 
                  onClick={() => setAuthType('register')}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setAuthType('login')}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}