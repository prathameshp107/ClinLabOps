"use client"

import { useState, useEffect } from "react"
import { ModernSidebar } from "@/components/dashboard/modern-sidebar"
// Remove the import for ModernHeader since it doesn't exist yet
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Handle responsive sidebar behavior
  useEffect(() => {
    const MOBILE_BREAKPOINT = 768
    
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(isCurrentlyMobile)
      if (isCurrentlyMobile) {
        setIsSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed)
  }

  return (
    <div className="relative flex h-screen bg-background overflow-hidden">
      {/* Sidebar with responsive behavior */}
      <ModernSidebar 
        onToggle={handleSidebarToggle} 
        className={cn(
          "fixed h-screen transition-transform duration-300 ease-in-out",
          isMobile && isSidebarCollapsed ? "-translate-x-full" : "translate-x-0",
          "z-30 shadow-lg"
        )}
        isCollapsed={isSidebarCollapsed}
        toggleButtonClassName={cn(
          "absolute right-0 top-20 transform translate-x-1/2",
          "bg-white rounded-full p-2 shadow-md",
          "transition-transform duration-300",
          !isSidebarCollapsed && "rotate-180"
        )}
      />
      
      {/* Main content area with responsive margins */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        !isMobile && (isSidebarCollapsed ? "ml-[70px]" : "ml-[280px]"),
        "bg-gray-50"
      )}>
        {/* Content wrapper with improved scrolling */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}
