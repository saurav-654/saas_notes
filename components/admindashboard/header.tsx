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
import { 
  StickyNote, 
  User, 
  LogOut, 
  UserPlus, 
  Building, 
  Crown, 
  Loader2 
} from "lucide-react";
import axios from "axios";

interface HeaderProps {
  user: {
    name: string;
    email?: string;
    role: string;
  };
  tenantPlan?: string; // Add tenant plan prop
  onPlanUpgraded?: () => void; // Callback to refresh data after upgrade
}

export function Header({ user, tenantPlan = "FREE", onPlanUpgraded }: HeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleAddMember = () => {
    router.push("/addmember");
  };

  const handleUpgradePlan = async () => {
    try {
      setUpgrading(true);
      
      // Get tenant slug from user data or localStorage
      const storedUser = localStorage.getItem("user");
      let tenantSlug = "acme"; // default fallback
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Try to get slug from stored data, or use a default
        tenantSlug = userData.data?.tenant?.slug || userData.tenant?.slug || "acme";
      }
      const uri = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.post(
        `${uri}api/tenants/${tenantSlug}/upgrade`, // ✅ Updated URL format
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Upgrade response:", response.data);

      // ✅ Updated to match your backend response format
      if (response.data.success === true) {
        // Enhanced success message using your response data
        const { newPlan, previousPlan, name } = response.data.data;
        alert(`🎉 Congratulations! ${name} has been successfully upgraded from ${previousPlan} to ${newPlan} plan!`);
        
        // Call the callback to refresh parent component data
        if (onPlanUpgraded) {
          onPlanUpgraded();
        }
      } else {
        // Handle case where success is false
        throw new Error(response.data.message || "Upgrade failed");
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      
      let errorMessage = "Failed to upgrade plan. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "❌ Only admins can upgrade the plan.";
      } else if (error.response?.status === 400) {
        errorMessage = "⚠️ Tenant is already on PRO plan.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setUpgrading(false);
    }
  };

  const isPro = tenantPlan === "PRO";

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
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-2 text-xs text-ultra-violet dark:text-pale-dogwood">
                <Building className="h-3 w-3" />
                <span className="capitalize">{user.role}</span>
                {/* Plan Badge */}
                
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Upgrade Button - Only show for FREE plan */}
          {!isPro && (
            <>
              {/* Desktop version */}
              <Button
                onClick={handleUpgradePlan}
                disabled={upgrading}
                size="sm"
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
              >
                {upgrading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Crown className="h-4 w-4" />
                )}
                {upgrading ? "Upgrading..." : "Upgrade to PRO"}
              </Button>
              
              {/* Mobile version */}
              <Button
                onClick={handleUpgradePlan}
                disabled={upgrading}
                size="icon"
                className="md:hidden h-8 w-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
              >
                {upgrading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Crown className="h-4 w-4" />
                )}
              </Button>
            </>
          )}

          {/* Add Member Button */}
          <>
            {/* Desktop version */}
            <Button
              onClick={handleAddMember}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 border-space-cadet text-space-cadet hover:bg-space-cadet hover:text-isabelline"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
            
            {/* Mobile version */}
            <Button
              onClick={handleAddMember}
              variant="outline"
              size="icon"
              className="sm:hidden h-8 w-8 border-space-cadet text-space-cadet hover:bg-space-cadet hover:text-isabelline"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </>

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
                 
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Upgrade option in dropdown for mobile */}
              {!isPro && (
                <>
                  <DropdownMenuItem 
                    onClick={handleUpgradePlan}
                    disabled={upgrading}
                    className="text-orange-600 dark:text-orange-400"
                  >
                    {upgrading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Crown className="mr-2 h-4 w-4" />
                    )}
                    {upgrading ? "Upgrading..." : "Upgrade to PRO"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem onClick={handleAddMember}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => { alert("Profile coming soon") }}>
                <User className="mr-2 h-4 w-4" />
                Profile
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
