import { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Login - Grid Wit",
  description: "Login to your Grid Wit account to access your crossword puzzles.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
