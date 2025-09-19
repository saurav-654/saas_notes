"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, MessageSquare, Loader2, ArrowLeft, AlertCircle } from "lucide-react"

export function PhoneLogin() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    alert("This feature is unavailable");
  }
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
  
  }

  const resetForm = () => {
    setOtpSent(false)
    setOtp("")
    setError("")
    setLoading(false)
  }

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-space-cadet dark:text-isabelline">
            Phone Number
          </Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 h-4 w-4 text-rose-quartz" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-ultra-violet to-rose-quartz hover:from-ultra-violet/90 hover:to-rose-quartz/90"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send OTP
            </>
          )}
        </Button>

        <p className="text-xs text-center text-ultra-violet/70 dark:text-pale-dogwood/70">
          We'll send a verification code to your phone
        </p>
      </form>
    )
  }

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-ultra-violet dark:text-pale-dogwood">Verification code sent to</p>
        <p className="font-medium text-space-cadet dark:text-isabelline">{phone}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp" className="text-space-cadet dark:text-isabelline">
          Enter 6-digit code
        </Label>
        <Input
          id="otp"
          type="text"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          required
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-ultra-violet to-rose-quartz hover:from-ultra-violet/90 hover:to-rose-quartz/90"
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-ultra-violet/70 dark:text-pale-dogwood/70">Demo OTP: 123456</p>
    </form>
  )
}
