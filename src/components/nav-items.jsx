import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'layoutDashboard',
  },
  {
    title: 'Tasks',
    href: '/tasks',
    icon: 'listTodo',
    badge: '3',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: 'folderKanban',
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: 'calendar',
  },
  {
    title: 'Team',
    href: '/team',
    icon: 'users',
  },
]
const secondaryNavItems = [
  {
    title: 'Settings',
    href: '/settings',
    icon: 'settings',
  },
  {
    title: 'Help & Support',
    href: '/help',
    icon: 'helpCircle',
  },
]

export function NavItems({ isCollapsed = false, onNavItemClick, navItems }) {
  const pathname = usePathname()
  const mainItems = navItems?.main || mainNavItems
  const secondaryItems = navItems?.secondary || secondaryNavItems

  const renderNavItem = (item, index) => {
    const Icon = Icons[item.icon] || Icons.helpCircle
    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
    const content = (
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start',
          isCollapsed ? 'h-10 w-10 p-0' : 'h-10',
          isActive && 'font-medium'
        )}
        onClick={onNavItemClick}
      >
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span className="ml-3">{item.title}</span>}
        {item.badge && (
          <span
            className={cn(
              'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full text-xs',
              isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {item.badge}
          </span>
        )}
      </Button>
    )
    if (isCollapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      )
    }
    return content
  }

  return (
    <nav className="grid gap-1">
      <div className="space-y-1">
        {mainItems.map((item, index) => (
          <Link key={item.href} href={item.href} className="block">
            {renderNavItem(item, index)}
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        {secondaryItems.map((item, index) => (
          <Link key={item.href} href={item.href} className="block">
            {renderNavItem(item, index + mainItems.length)}
          </Link>
        ))}
      </div>
    </nav>
  )
}
