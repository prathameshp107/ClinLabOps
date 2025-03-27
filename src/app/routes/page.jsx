"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Home, 
  FileText, 
  Settings, 
  Users, 
  LogIn, 
  UserPlus, 
  CreditCard, 
  BarChart, 
  Beaker, 
  Microscope, 
  ClipboardList,
  HelpCircle,
  Mail,
  BookOpen,
  ExternalLink
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const currentPath = usePathname()
  
  // Define all app routes with metadata
  const routes = [
    {
      name: "Home",
      path: "/",
      description: "Main landing page",
      icon: <Home className="h-5 w-5" />,
      category: "Main"
    },
    {
      name: "Login",
      path: "/login",
      description: "User authentication",
      icon: <LogIn className="h-5 w-5" />,
      category: "Auth"
    },
    {
      name: "Register",
      path: "/register",
      description: "New user registration",
      icon: <UserPlus className="h-5 w-5" />,
      category: "Auth"
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      description: "User dashboard with overview",
      icon: <BarChart className="h-5 w-5" />,
      category: "Main"
    },
    {
      name: "Pricing",
      path: "/pricing",
      description: "Subscription plans and pricing",
      icon: <CreditCard className="h-5 w-5" />,
      category: "Info"
    },
    {
      name: "Profile",
      path: "/profile",
      description: "User profile settings",
      icon: <Users className="h-5 w-5" />,
      category: "User"
    },
    {
      name: "Settings",
      path: "/settings",
      description: "Application settings",
      icon: <Settings className="h-5 w-5" />,
      category: "User"
    },
    {
      name: "Lab Management",
      path: "/lab-management",
      description: "Manage laboratory resources",
      icon: <Beaker className="h-5 w-5" />,
      category: "Lab"
    },
    {
      name: "Experiments",
      path: "/experiments",
      description: "Track and manage experiments",
      icon: <Microscope className="h-5 w-5" />,
      category: "Lab"
    },
    {
      name: "Tasks",
      path: "/tasks",
      description: "Manage research tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      category: "Lab"
    },
    {
      name: "Documentation",
      path: "/docs",
      description: "Application documentation",
      icon: <BookOpen className="h-5 w-5" />,
      category: "Info"
    },
    {
      name: "Help & Support",
      path: "/support",
      description: "Get help with the application",
      icon: <HelpCircle className="h-5 w-5" />,
      category: "Info"
    },
    {
      name: "Contact",
      path: "/contact",
      description: "Contact the team",
      icon: <Mail className="h-5 w-5" />,
      category: "Info"
    },
    {
      name: "About",
      path: "/about",
      description: "About LabTasker",
      icon: <FileText className="h-5 w-5" />,
      category: "Info"
    }
  ]

  // Filter routes based on search query
  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group routes by category
  const groupedRoutes = filteredRoutes.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = []
    }
    acc[route.category].push(route)
    return acc
  }, {})

  // Get categories in order
  const categories = Object.keys(groupedRoutes).sort()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">LabTasker Navigation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore all available routes and pages in the LabTasker application
        </p>
        
        {/* Search input */}
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              Found {filteredRoutes.length} routes matching "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No routes found</h3>
          <p className="text-muted-foreground">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold">{category}</h2>
                <Badge variant="outline" className="ml-3">
                  {groupedRoutes[category].length} routes
                </Badge>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {groupedRoutes[category].map((route) => (
                  <motion.div key={route.path} variants={itemVariants}>
                    <Link href={route.path} passHref>
                      <Card className={`h-full cursor-pointer transition-all hover:shadow-md ${currentPath === route.path ? 'border-primary bg-primary/5' : ''}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="mr-3 p-2 rounded-md bg-primary/10">
                                {route.icon}
                              </div>
                              <CardTitle className="text-xl">{route.name}</CardTitle>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {route.description}
                          </CardDescription>
                          {currentPath === route.path && (
                            <Badge variant="secondary" className="mt-2">Current Page</Badge>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">
          Can't find what you're looking for?
        </p>
        <Button variant="outline">
          <HelpCircle className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </div>
    </div>
  )
}