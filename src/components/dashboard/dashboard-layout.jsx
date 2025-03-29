"use client"

import { useState, useEffect } from "react"
import { ModernSidebar } from "@/components/dashboard/modern-sidebar"
// Remove the import for ModernHeader since it doesn't exist yet
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Function to handle sidebar toggle state
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar with toggle state handler */}
      <ModernSidebar 
        onToggle={handleSidebarToggle} 
        className="fixed h-screen z-30"
        isCollapsed={isSidebarCollapsed}
      />
      
      {/* Main content area that adjusts based on sidebar state */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "ml-[70px]" : "ml-[280px]"
      )}>
        {/* Simple header instead of ModernHeader */}
        <header className="h-16 border-b border-border/40 bg-background/95 sticky top-0 z-20 px-6 flex items-center">
          <h1 className="text-xl font-semibold">LabTasker</h1>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
