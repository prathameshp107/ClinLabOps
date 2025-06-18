"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  BarChart3, 
  Box, 
  Clock, 
  DollarSign, 
  Download, 
  Package, 
  PieChart as PieChartIcon, 
  ShoppingCart, 
  Truck 
} from "lucide-react"

export function InventoryDashboard({ inventoryItems }) {
  const [chartView, setChartView] = useState("category")
  
  // Calculate dashboard metrics
  const totalItems = inventoryItems.length
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)
  const lowStockItems = inventoryItems.filter(item => item.isLowStock).length
  const lowStockPercentage = (lowStockItems / totalItems) * 100
  
  // Calculate category distribution for charts
  const categoryData = getCategoryData(inventoryItems)
  const locationData = getLocationData(inventoryItems)
  const valueByCategory = getValueByCategory(inventoryItems)
  
  // Recent activity (mock data)
  const recentActivity = [
    { action: "Item Restocked", item: "Sodium Chloride", quantity: 20, timestamp: "10 minutes ago", user: "John Doe" },
    { action: "Item Added", item: "Digital Scale", quantity: 2, timestamp: "1 hour ago", user: "Jane Smith" },
    { action: "Low Stock Alert", item: "Nitrile Gloves", quantity: 5, timestamp: "2 hours ago", user: "System" },
    { action: "Item Transferred", item: "Microscope Slides", quantity: 10, timestamp: "Yesterday", user: "Mike Johnson" },
  ]
  
  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57']
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems} items</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(inventoryItems.map(item => item.category)).size} categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Average ${(totalValue / totalItems).toFixed(2)} per item
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems} items</div>
            <div className="mt-2">
              <Progress value={lowStockPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {lowStockPercentage.toFixed(1)}% of inventory needs reordering
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity.length} actions</div>
            <p className="text-xs text-muted-foreground">
              Last activity {recentActivity[0].timestamp}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Distribution</CardTitle>
              <Tabs value={chartView} onValueChange={setChartView} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="category">By Category</TabsTrigger>
                  <TabsTrigger value="location">By Location</TabsTrigger>
                  <TabsTrigger value="value">By Value</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              Overview of your inventory distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <TabsContent value="category" className="mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} items`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="location" className="mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} items`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="value" className="mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={valueByCategory}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>
              Items that need to be reordered soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems
                .filter(item => item.isLowStock)
                .slice(0, 5)
                .map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.currentStock} {item.unit} remaining
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Low Stock
                      </Badge>
                      <Button variant="outline" size="sm">
                        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                ))}
              
              {inventoryItems.filter(item => item.isLowStock).length > 5 && (
                <Button variant="link" className="w-full mt-2">
                  View all {inventoryItems.filter(item => item.isLowStock).length} low stock items
                </Button>
              )}
              
              {inventoryItems.filter(item => item.isLowStock).length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="rounded-full bg-green-50 p-3 mb-3">
                    <Box className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">All stocked up!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You don't have any items that need reordering at the moment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest inventory movements and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className={`rounded-full p-2 ${getActivityIconBackground(activity.action)}`}>
                  {getActivityIcon(activity.action)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm">
                    <span className="font-medium">{activity.item}</span> - {activity.quantity} units
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{activity.timestamp}</span>
                    <span className="mx-1">•</span>
                    <span>by {activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to get category data for charts
function getCategoryData(items) {
  const categoryCount = {}
  
  items.forEach(item => {
    if (categoryCount[item.category]) {
      categoryCount[item.category]++
    } else {
      categoryCount[item.category] = 1
    }
  })
  
  return Object.entries(categoryCount).map(([name, value]) => ({ name, value }))
}

// Helper function to get location data for charts
function getLocationData(items) {
  const locationCount = {}
  
  items.forEach(item => {
    if (locationCount[item.location]) {
      locationCount[item.location]++
    } else {
      locationCount[item.location] = 1
    }
  })
  
  return Object.entries(locationCount).map(([name, value]) => ({ name, value }))
}

// Helper function to get value by category for charts
function getValueByCategory(items) {
  const categoryValue = {}
  
  items.forEach(item => {
    const itemValue = item.currentStock * item.unitPrice
    if (categoryValue[item.category]) {
      categoryValue[item.category] += itemValue
    } else {
      categoryValue[item.category] = itemValue
    }
  })
  
  return Object.entries(categoryValue).map(([name, value]) => ({ name, value }))
}

// Custom label for pie chart
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Helper function to get activity icon
function getActivityIcon(action) {
  switch (action) {
    case "Item Restocked":
      return <Truck className="h-4 w-4 text-green-600" />
    case "Item Added":
      return <Package className="h-4 w-4 text-blue-600" />
    case "Low Stock Alert":
      return <AlertCircle className="h-4 w-4 text-amber-600" />
    case "Item Transferred":
      return <ArrowUp className="h-4 w-4 text-purple-600" />
    default:
      return <Package className="h-4 w-4" />
  }
}

// Helper function to get activity icon background
function getActivityIconBackground(action) {
  switch (action) {
    case "Item Restocked":
      return "bg-green-100"
    case "Item Added":
      return "bg-blue-100"
    case "Low Stock Alert":
      return "bg-amber-100"
    case "Item Transferred":
      return "bg-purple-100"
    default:
      return "bg-gray-100"
  }
}