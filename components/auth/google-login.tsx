"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Chrome, Loader2 } from "lucide-react"

export function GoogleLogin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setLoading(true)

    // Simulate Google OAuth flow
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful Google login
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: "user@gmail.com",
          name: "Google User",
          role: "user",
          provider: "google",
        }),
      )
      router.push("/dashboard")
    } catch (error) {
      console.error("Google sign in failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="w-full border-pale-dogwood hover:bg-pale-dogwood/10 hover:border-rose-quartz bg-transparent"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </>
        )}
      </Button>

      <p className="text-xs text-center text-ultra-violet/70 dark:text-pale-dogwood/70">
        Sign in with your Google account to get started quickly
      </p>
    </div>
  )
}
