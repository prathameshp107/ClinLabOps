"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu, X, LayoutDashboard, ClipboardList, Users, FlaskConical,
  Settings, Shield, FolderKanban, BellRing, Sun, Moon, LogOut,
  ChevronRight, BarChart2, BookOpen, Home, Package, Search
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"

export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile devices and handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto close sidebar on mobile
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      } else if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine if a path is active or its parent
  const isActiveOrParent = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  // Navigation links with categories
  const navLinks = [
    {
      category: "Overview",
      links: [
        { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: "Analytics", path: "/analytics", icon: <BarChart2 className="h-5 w-5" /> },
      ],
    },
    {
      category: "Management",
      links: [
        { name: "Users", path: "/user-management", icon: <Users className="h-5 w-5" /> },
        { name: "Projects", path: "/projects", icon: <FolderKanban className="h-5 w-5" /> },
        { name: "Tasks", path: "/tasks", icon: <ClipboardList className="h-5 w-5" />, badge: "New" },
      ],
    },
    {
      category: "Lab Operations",
      links: [
        { name: "Experiments", path: "/experiments", icon: <FlaskConical className="h-5 w-5" /> },
        { name: "Equipment", path: "/equipment", icon: <Package className="h-5 w-5" /> },
        { name: "Inventory", path: "/inventory", icon: <Package className="h-5 w-5" /> },
      ],
    },
    {
      category: "System",
      links: [
        { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
        { name: "Logs", path: "/system-logs", icon: <Package className="h-5 w-5" /> },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r bg-card lg:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
          } transition-all duration-300 ease-in-out`}
        layout
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className={`flex h-16 items-center border-b px-6 ${!isSidebarOpen && "lg:justify-center lg:px-0"}`}>
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
            >
              <BookOpen className="h-6 w-6 text-primary" />
              {(isSidebarOpen || !isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                  className={`${!isSidebarOpen && "lg:hidden"}`}
                >
                  LabTasker
                </motion.span>
              )}
            </Link>

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto lg:hidden"
                onClick={toggleSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className={`ml-auto ${isSidebarOpen ? "" : "hidden lg:flex"}`}
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>

          {/* Navigation links */}
          <div className="flex-1 py-4">
            <div className="space-y-6 px-3">
              {navLinks.map((category, i) => (
                <div key={i} className="space-y-2">
                  {isSidebarOpen && (
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >
                      {category.category}
                    </motion.h3>
                  )}

                  <div className="space-y-1">
                    {category.links.map((link, j) => {
                      const isActive = pathname === link.path;
                      const isParent = isActiveOrParent(link.path);

                      return (
                        <Link
                          key={j}
                          href={link.path}
                          className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                            ${isActive
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : isParent
                                ? "bg-muted text-foreground hover:bg-muted/80"
                                : "transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                            }
                            ${!isSidebarOpen && "lg:justify-center lg:px-0 lg:py-3"}
                          `}
                        >
                          <div className={`${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"} mr-3 ${!isSidebarOpen && "lg:mr-0"}`}>
                            {link.icon}
                          </div>

                          {isSidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`${!isSidebarOpen && "lg:hidden"}`}
                            >
                              {link.name}
                            </motion.span>
                          )}

                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-indicator"
                              className="absolute right-0 h-full w-1 bg-primary rounded-l-md"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Badge */}
                          {link.badge && (
                            <Badge className="ml-2">{link.badge}</Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User profile */}
          <div className={`border-t p-4 ${!isSidebarOpen && "lg:p-2"}`}>
            <div className="flex items-center gap-3">
              <Avatar className={`h-9 w-9 ${!isSidebarOpen && "lg:h-10 lg:w-10"}`}>
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex-1 overflow-hidden ${!isSidebarOpen && "lg:hidden"}`}
                >
                  <div className="font-medium leading-none mb-1">Dr. Sarah Johnson</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full md:w-[300px] bg-background"
            />
          </div>

          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />

            {/* Notifications */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <BellRing className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-destructive-foreground">3</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* User menu */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Users className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>My Account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
