"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailLogin } from "./email-login"
import { GoogleLogin } from "./google-login"
import { PhoneLogin } from "./phone-login"
import { Mail, Smartphone, Chrome } from "lucide-react"

export function AuthTabs() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-isabelline via-pale-dogwood/20 to-rose-quartz/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-pale-dogwood/50 backdrop-blur-md bg-card/80">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-space-cadet to-ultra-violet bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-ultra-violet/80 dark:text-pale-dogwood/80">
            Sign in to access your notes dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-isabelline/50 dark:bg-ultra-violet/20">
              <TabsTrigger
                value="email"
                className="flex items-center gap-2 data-[state=active]:bg-space-cadet data-[state=active]:text-isabelline"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="flex items-center gap-2 data-[state=active]:bg-space-cadet data-[state=active]:text-isabelline"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Phone</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="email" className="space-y-4">
                <EmailLogin />
              </TabsContent>
              <TabsContent value="phone" className="space-y-4">
                <PhoneLogin />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
