"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-1 h-9 w-9 p-0 rounded-full"
      onClick={() => router.back()}
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
}