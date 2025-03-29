"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ModernSidebar } from "./modern-sidebar"

export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ModernSidebar />
      
      <motion.main
        className="flex-1 overflow-auto"
        initial={{ paddingLeft: isMobile ? 0 : 280 }}
        animate={{ paddingLeft: isMobile ? 0 : (isSidebarOpen ? 280 : 80) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
