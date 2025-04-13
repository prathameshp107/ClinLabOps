"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  const router = useRouter();
  
  // Get user data for personalized message
  const getUserName = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.fullName || 'User';
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return 'User';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full bg-background/80 backdrop-blur-md rounded-xl p-8 border border-border/40 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, {getUserName()}. You don't have permission to access the admin dashboard. 
            This area is restricted to administrators only.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button 
              className="flex-1"
              onClick={() => router.push('/tasks')}
            >
              Go to Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}