"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StickyNote, User, LogOut, Settings, Building } from "lucide-react";
import axios from "axios";

interface HeaderProps {
  user: {
    name: string;
    email?: string;
    role: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // ✅ Use environment variable for logout API call
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
      
      // Optional: Call backend logout endpoint if you have one
      try {
        await axios.post(`${backendUrl}/logout`, {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (error) {
        // If logout endpoint fails, still proceed with local logout
        console.warn("Backend logout failed, proceeding with local logout:", error);
      }
      
      // Remove user data from localStorage
      localStorage.removeItem("user");
      
      // Redirect to home/login page
      router.push("/");
      
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, clear local storage and redirect
      localStorage.removeItem("user");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = () => {
    // You can implement this to call a profile endpoint or navigate to profile page
    console.log("Profile clicked for user:", user.email);
    alert("Profile functionality coming soon!");
    
    // Example: Navigate to profile page
    // router.push("/profile");
    
    // Example: Fetch user profile data
    // const fetchProfile = async () => {
    //   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
    //   try {
    //     const response = await axios.get(`${backendUrl}/profile`, {
    //       withCredentials: true,
    //     });
    //     console.log("Profile data:", response.data);
    //   } catch (error) {
    //     console.error("Failed to fetch profile:", error);
    //   }
    // };
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-space-cadet to-ultra-violet">
              <StickyNote className="h-4 w-4 text-isabelline" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-space-cadet dark:text-isabelline">
                Notes App
              </h1>
              <div className="flex items-center gap-2 text-xs text-ultra-violet dark:text-pale-dogwood">
                <Building className="h-3 w-3" />
                <span className="capitalize">
                  {user.role}
                </span>
                {/* Optional: Add user status or plan info */}
                <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex items-center justify-center h-8 w-8 rounded-full"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-pale-dogwood to-rose-quartz">
                  <User className="h-3 w-3 text-space-cadet" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="text-sm font-medium text-space-cadet dark:text-isabelline">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="text-xs text-ultra-violet dark:text-pale-dogwood">
                      {user.email}
                    </p>
                  )}
                  <p className="text-xs text-ultra-violet dark:text-pale-dogwood">
                    Role: <span className="capitalize">{user.role}</span>
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => { 
                console.log("Settings clicked");
                alert("Settings functionality coming soon!"); 
              }}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={loading}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {loading ? "Signing out..." : "Sign Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
