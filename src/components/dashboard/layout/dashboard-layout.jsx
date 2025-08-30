"use client"

import { useState, useEffect } from "react"
import { ModernSidebar } from "@/components/dashboard/layout/modern-sidebar"
// Remove the import for ModernHeader since it doesn't exist yet
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarCollapseIcon } from "@/components/ui/sidebar-collapse-icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LogOut, User, ChevronDown, Bell, Sun, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import UserAvatar from "@/components/tasks/user-avatar"
import { TooltipProvider } from "@/components/ui/tooltip"

export function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3) // Mock notification count
  const [theme, setTheme] = useState('light') // Simple theme state
  const router = useRouter()

  // Function to handle sidebar toggle state
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed)
  }

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('userData')
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData))
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
  }, [])

  // Load theme from localStorage and apply it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light'
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  // Function to apply theme to DOM
  const applyTheme = (newTheme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const handleLogout = () => setShowLogoutDialog(true)
  const confirmLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    router.push('/login')
  }

  return (
    <TooltipProvider>
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
          isSidebarCollapsed ? "ml-0" : "ml-[240px]"
        )}>
          {/* Simple header instead of ModernHeader */}
          <header className="h-16 border-b border-border/40 bg-background/95 sticky top-0 z-20 px-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSidebarToggle(!isSidebarCollapsed)}
                className="mr-4"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <SidebarCollapseIcon className={cn("h-5 w-5 transition-transform duration-300", !isSidebarCollapsed ? "rotate-180" : "rotate-0")} />
              </Button>
              <h1 className="text-xl font-semibold">LabTasker</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                    {notificationCount}
                  </Badge>
                )}
              </Button>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* User Profile on Navbar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-9 rounded-full">
                    <UserAvatar user={{ name: "User" }} size="md" />
                    <span className="font-semibold text-[14px] text-foreground truncate max-w-[120px] hidden md:inline">{userData?.fullName || 'User'}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Log out of LabTasker?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out of your account. You will need to log in again to access your data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
