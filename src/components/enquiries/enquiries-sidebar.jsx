"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  Home, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Star, 
  PlusCircle,
  Filter,
  Calendar,
  BarChart4
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const sidebarNavItems = [
  {
    title: "All Enquiries",
    href: "/enquiries",
    icon: Home,
    count: 24
  },
  {
    title: "Pending",
    href: "/enquiries?status=pending",
    icon: Clock,
    count: 8,
    variant: "yellow"
  },
  {
    title: "In Progress",
    href: "/enquiries?status=in-progress",
    icon: AlertCircle,
    count: 12,
    variant: "blue"
  },
  {
    title: "Completed",
    href: "/enquiries?status=completed",
    icon: CheckCircle,
    count: 4,
    variant: "green"
  },
  {
    title: "High Priority",
    href: "/enquiries?priority=high",
    icon: Star,
    count: 5,
    variant: "red"
  },
  {
    title: "Assigned to Me",
    href: "/enquiries?assigned=me",
    icon: Users,
    count: 7
  },
  {
    title: "Reports",
    href: "/enquiries/reports",
    icon: FileText,
    count: 15
  },
  {
    title: "Analytics",
    href: "/enquiries/analytics",
    icon: BarChart4
  }
];

const recentCustomers = [
  {
    id: "c1",
    name: "Emily Chen",
    company: "BioTech Innovations",
    lastActive: "2 days ago"
  },
  {
    id: "c2",
    name: "James Wilson",
    company: "MediLab Research",
    lastActive: "5 days ago"
  },
  {
    id: "c3",
    name: "Sarah Johnson",
    company: "PharmaCorp",
    lastActive: "1 week ago"
  },
  {
    id: "c4",
    name: "Michael Rodriguez",
    company: "GeneTech Solutions",
    lastActive: "2 weeks ago"
  }
];

export function EnquiriesSidebar({ className }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleCreateEnquiry = () => {
    router.push("/enquiries/new");
  };

  // Get badge variant based on count
  const getBadgeVariant = (item) => {
    if (item.variant) {
      switch (item.variant) {
        case "yellow":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500";
        case "blue":
          return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-500";
        case "green":
          return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-500";
        case "red":
          return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-500";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200";
      }
    }
    return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200";
  };

  // Filter nav items based on search query
  const filteredNavItems = sidebarNavItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="space-y-3">
            <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
              Enquiries
            </h2>
            <div className="space-y-2">
              <Button 
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleCreateEnquiry}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Enquiry
              </Button>
              <div className="relative">
                <Input
                  placeholder="Search enquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-3 space-y-3 px-2 py-2 bg-muted/50 rounded-md">
              <h3 className="text-sm font-medium">Filter By Date</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Today
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  This Week
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  This Month
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Custom
                </Button>
              </div>
              
              <h3 className="text-sm font-medium mt-3">Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                  Pending
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                  In Progress
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  Completed
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  Urgent
                </Button>
              </div>
              
              <h3 className="text-sm font-medium mt-3">Priority</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  High
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Medium
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Low
                </Button>
              </div>
            </div>
          )}
        </div>
        <Separator className="my-2" />
        <div className="px-3">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <Button
                key={item.title}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => router.push(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
                {item.count && (
                  <Badge className={cn("ml-auto", getBadgeVariant(item))}>
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
        <Separator className="my-2" />
        <div className="px-3">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Recent Customers
          </h2>
          <ScrollArea className="h-[120px]">
            <div className="space-y-1 px-1">
              {recentCustomers.map((customer) => (
                <Button
                  key={customer.id}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  <div className="flex flex-col items-start">
                    <span>{customer.name}</span>
                    <span className="text-xs text-muted-foreground">{customer.company}</span>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {customer.lastActive}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <Separator className="my-2" />
        <div className="px-3">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Deadlines
          </h2>
          <ScrollArea className="h-[150px]">
            <div className="space-y-2 px-1">
              <div className="rounded-md border p-3">
                <div className="font-medium">Final Report: BioTech Analysis</div>
                <div className="text-xs text-muted-foreground mt-1">Due in 2 days</div>
                <div className="text-xs text-muted-foreground">Emily Chen - BioTech Innovations</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="font-medium">Test Results: MediLab Samples</div>
                <div className="text-xs text-muted-foreground mt-1">Due in 5 days</div>
                <div className="text-xs text-muted-foreground">James Wilson - MediLab Research</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="font-medium">Progress Update: PharmaCorp</div>
                <div className="text-xs text-muted-foreground mt-1">Due in 1 week</div>
                <div className="text-xs text-muted-foreground">Sarah Johnson - PharmaCorp</div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
