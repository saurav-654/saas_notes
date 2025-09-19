"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function AddMember() {
  const [formData, setFormData] = useState({
    useremail: "",
    userPassword: "",
    userName: "",
    userrole: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.useremail || !formData.userPassword || !formData.userName || !formData.userrole) {
      setError("All fields are required");
      return;
    }

    if (formData.userPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Get admin user info from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("Admin authentication required. Please log in again.");
        router.push("/");
        return;
      }

      const adminData = JSON.parse(storedUser);
      console.log("The admindata", adminData);

      const adminEmail = adminData?.data?.user?.email;
      console.log("Admin email:", adminEmail);

      if (!adminEmail) {
        setError("Admin email not found. Please log in again.");
        router.push("/");
        return;
      }

      // Log the request payload
      const requestPayload = {
        email: adminEmail, // Admin's email for verification
        ...formData
      };
      console.log("Request payload:", requestPayload);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adduser`, requestPayload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Response:", response.data);

      if (response.data.success === "true") {
        setSuccess("Member added successfully!");
        // Reset form
        setFormData({
          useremail: "",
          userPassword: "",
          userName: "",
          userrole: ""
        });
        
        setTimeout(() => {
          router.push("/amindashboard"); // Fixed typo: was "admindashboard"
        }, 2000);
      }

    } catch (error: any) {
      console.error("Add member error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Unauthorized. Only admins can add members.");
      } else if (error.response?.status === 409) {
        setError("User already exists with this email.");
      } else if (error.response?.status === 400) {
        setError("Invalid data provided. Please check all fields.");
      } else {
        setError("Failed to add member. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-isabelline via-pale-dogwood/20 to-rose-quartz/10 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-space-cadet to-ultra-violet">
              <UserPlus className="h-6 w-6 text-isabelline" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-space-cadet dark:text-isabelline mb-2">
            Add New Member
          </h1>
          <p className="text-ultra-violet dark:text-pale-dogwood text-sm sm:text-base">
            Add a new team member to your organization
          </p>
        </div>

        <Card className="border-pale-dogwood/30 bg-white/70 dark:bg-ultra-violet/20">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-space-cadet dark:text-isabelline">
              Member Information
            </CardTitle>
            <CardDescription>
              Fill in the details for the new team member
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-space-cadet dark:text-isabelline">
                  Full Name *
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.userName}
                  onChange={(e) => handleInputChange("userName", e.target.value)}
                  className="bg-white/70 dark:bg-ultra-violet/20 border-pale-dogwood/30 focus:border-space-cadet dark:focus:border-isabelline"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="useremail" className="text-space-cadet dark:text-isabelline">
                  Email Address *
                </Label>
                <Input
                  id="useremail"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.useremail}
                  onChange={(e) => handleInputChange("useremail", e.target.value)}
                  className="bg-white/70 dark:bg-ultra-violet/20 border-pale-dogwood/30 focus:border-space-cadet dark:focus:border-isabelline"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="userPassword" className="text-space-cadet dark:text-isabelline">
                  Password *
                </Label>
                <Input
                  id="userPassword"
                  type="password"
                  placeholder="Enter password (min 6 characters)"
                  value={formData.userPassword}
                  onChange={(e) => handleInputChange("userPassword", e.target.value)}
                  className="bg-white/70 dark:bg-ultra-violet/20 border-pale-dogwood/30 focus:border-space-cadet dark:focus:border-isabelline"
                  disabled={loading}
                  minLength={6}
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="userrole" className="text-space-cadet dark:text-isabelline">
                  Role *
                </Label>
                <Select 
                  value={formData.userrole} 
                  onValueChange={(value) => handleInputChange("userrole", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-white/70 dark:bg-ultra-violet/20 border-pale-dogwood/30 focus:border-space-cadet dark:focus:border-isabelline">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-space-cadet to-ultra-violet hover:from-space-cadet/90 hover:to-ultra-violet/90 h-11"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Member...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Member
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/amindashboard")}
                  className="flex-1 sm:flex-initial border-space-cadet text-space-cadet hover:bg-space-cadet hover:text-isabelline h-11"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}