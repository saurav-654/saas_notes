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
import { StickyNote, User, LogOut, UserPlus, Building, ArrowLeft } from "lucide-react";

interface HeaderProps {
  user: {
    name: string;
    email?: string;
    role: string;
  };
  showBackButton?: boolean;
  showAddMember?: boolean;
}

export function Header({ user, showBackButton = false, showAddMember = true }: HeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleAddMember = () => {
    router.push("/addmember");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
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
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Add Member Button - Only show for admins */}
          {user.role === 'ADMIN' && showAddMember && (
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
          )}

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

              {/* Add Member option in dropdown for mobile */}
              {user.role === 'ADMIN' && (
                <>
                  <DropdownMenuItem onClick={handleAddMember}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

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
