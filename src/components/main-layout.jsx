'use client'

import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { cn } from '@/lib/utils'

/**
 * Main layout component that provides the overall structure of the application
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to render
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {JSX.Element} The rendered component
 */
export function MainLayout({ children, className, ...props }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  // Close mobile menu when route changes
  React.useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar
          collapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
          className="hidden md:block"
        />
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        {/* Mobile Sidebar */}
        <div
          className={cn(
            'fixed left-0 top-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out md:hidden',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar
            collapsed={false}
            setCollapsed={() => { }}
            className="h-full w-64 shadow-lg"
          />
        </div>
        {/* Main Content */}
        <main
          className={cn(
            'flex-1 overflow-auto',
            isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64',
            'transition-[margin] duration-300 ease-in-out',
            className
          )}
          {...props}
        >
          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
          <SiteFooter className="border-t" />
        </main>
      </div>
    </div>
  )
}