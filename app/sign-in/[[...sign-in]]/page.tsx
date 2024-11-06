import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-zinc-900 hover:bg-zinc-800 text-sm normal-case",
            footerActionLink: "text-zinc-900 hover:text-zinc-800",
            card: "shadow-none"
          },
        }}
      />
    </div>
  )
} 