"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthTabs } from "@/components/auth/auth-tabs"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/dashboard")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-isabelline via-pale-dogwood/20 to-rose-quartz/10">
        <Loader2 className="h-8 w-8 animate-spin text-space-cadet" />
      </div>
    )
  }

  return <AuthTabs />
}
