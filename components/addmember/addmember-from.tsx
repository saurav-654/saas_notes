"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddMember } from "@/components/addmember/addmember";
import { Header } from "@/components/addmember/header";
import { Loader2 } from "lucide-react";

interface User {
  name: string;
  email?: string;
  role: string;
}

export default function AddMemberPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    
    if (!stored) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      let userData: User;

      // Handle different user data structures
      if (parsed.data && parsed.data.user) {
        userData = {
          name: parsed.data.user.name,
          email: parsed.data.user.email,
          role: parsed.data.user.role
        };
      } else if (parsed.name && parsed.email && parsed.role) {
        userData = {
          name: parsed.name,
          email: parsed.email,
          role: parsed.role
        };
      } else {
        console.error("Invalid user data structure");
        router.push("/");
        return;
      }

      // Check if user is admin
      if (userData.role !== 'ADMIN') {
        console.error("Access denied. Admin role required.");
        router.push("/dashboard"); // Redirect non-admins to regular dashboard
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-isabelline via-pale-dogwood/20 to-rose-quartz/10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-space-cadet" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-isabelline via-pale-dogwood/20 to-rose-quartz/10">
      <Header user={user} showBackButton={true} showAddMember={false} />
      <AddMember />
    </div>
  );
}