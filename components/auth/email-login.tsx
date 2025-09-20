"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import axios from 'axios'


export function EmailLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      axios.defaults.withCredentials = true;
      setLoading(true)
      const uri = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.post(`${uri}api/login`,{
        email,
        password
      });
      
      if(response){
        console.log('Login Successful',response.data)
        localStorage.setItem('user',JSON.stringify(response.data))
        
        // Check user role and redirect accordingly
        const userRole = response.data.data?.user?.role;
        
        if (userRole === 'ADMIN') {
          console.log('Redirecting to admin dashboard');
          router.push('/amindashboard');
        } else {
          console.log('Redirecting to user dashboard');
          router.push('/dashboard');
        }
      }

    }catch (error:any) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    }finally{
      setLoading(false)
    }
 

    // Simulate authentication
  
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-space-cadet dark:text-isabelline">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-rose-quartz" />
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-space-cadet dark:text-isabelline">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-rose-quartz" />
          <Input
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        className="w-full bg-gradient-to-r from-space-cadet to-ultra-violet hover:from-space-cadet/90 hover:to-ultra-violet/90"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In with Email"
        )}
      </Button>

     
    </form>
  )
}
