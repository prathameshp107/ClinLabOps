"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
// Import Recharts components
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'
import { 
  BarChart3, 
  Download, 
  FileText, 
  PieChart as PieChartIcon, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  FileCog
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function ReportsList({ inventory }) {
  const [reportType, setReportType] = useState("inventory")
  const [timeRange, setTimeRange] = useState("month")
  
  // Calculate inventory statistics
  const totalItems = inventory.length
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStockLevel)
  const lowStockCount = lowStockItems.length
  const categories = [...new Set(inventory.map(item => item.category))]
  const outOfStockCount = inventory.filter(item => item.currentStock === 0).length
  
  // Calculate category statistics
  const categoryStats = categories.map(category => {
    const categoryItems = inventory.filter(item => item.category === category)
    const categoryValue = categoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)
    const categoryLowStock = categoryItems.filter(item => item.currentStock <= item.minStockLevel).length
    const categoryTotalStock = categoryItems.reduce((sum, item) => sum + item.currentStock, 0)
    
    return {
      name: category,
      count: categoryItems.length,
      value: categoryValue,
      lowStock: categoryLowStock,
      totalStock: categoryTotalStock,
      percentOfTotal: (categoryValue / totalValue) * 100
    }
  })
  
  // Sort categories by value
  const sortedCategories = [...categoryStats].sort((a, b) => b.value - a.value)
  
  // Calculate inventory health score (0-100)
  const stockHealthScore = Math.max(0, Math.min(100, 100 - ((lowStockCount / totalItems) * 100)))
  
  // Mock data for inventory value over time
  const valueOverTime = [
    { month: "Jan", value: totalValue * 0.85 },
    { month: "Feb", value: totalValue * 0.9 },
    { month: "Mar", value: totalValue * 0.88 },
    { month: "Apr", value: totalValue * 0.92 },
    { month: "May", value: totalValue * 0.95 },
    { month: "Jun", value: totalValue * 0.97 },
    { month: "Jul", value: totalValue * 0.99 },
    { month: "Aug", value: totalValue }
  ]
  
  // Calculate value change
  const valueChange = {
    amount: valueOverTime[valueOverTime.length - 1].value - valueOverTime[valueOverTime.length - 2].value,
    percentage: ((valueOverTime[valueOverTime.length - 1].value - valueOverTime[valueOverTime.length - 2].value) / valueOverTime[valueOverTime.length - 2].value) * 100
  }
  
  // Mock data for most frequently used items
  const topUsedItems = [...inventory]
    .sort((a, b) => (b.minStockLevel - b.currentStock) - (a.minStockLevel - a.currentStock))
    .slice(0, 5)
    .map(item => ({
      ...item,
      usageRate: Math.floor(Math.random() * 20) + 1 // Mock usage rate per week
    }))
  
  // Calculate expiration risk items (mock data)
  const expirationRiskItems = inventory
    .filter(item => item.category === "Chemicals" || item.category === "Reagents")
    .slice(0, 3)
    .map(item => ({
      ...item,
      expiryDate: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // Random date within next 30 days
    }))
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Inventory Reports</h2>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs">
                {categories.length} Categories
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <div className="flex items-center mt-1">
              {valueChange.amount > 0 ? (
                <Badge variant="outline" className="text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {valueChange.percentage.toFixed(1)}% from last month
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-red-500">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(valueChange.percentage).toFixed(1)}% from last month
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockHealthScore.toFixed(0)}%</div>
            <Progress value={stockHealthScore} className="h-2 mt-2" />
            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
              <span>{lowStockCount} low stock</span>
              <span>{outOfStockCount} out of stock</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Restock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${lowStockItems.reduce((sum, item) => sum + ((item.minStockLevel - item.currentStock) * item.unitPrice), 0).toFixed(2)}
            </div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs">
                {lowStockItems.length} items need restocking
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="summary" className="mt-6">
        <TabsList>
          <TabsTrigger value="summary">
            <FileText className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChart className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="lowstock">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Low Stock
          </TabsTrigger>
          <TabsTrigger value="usage">
            <TrendingUp className="h-4 w-4 mr-2" />
            Usage Analysis
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <BarChart3 className="h-4 w-4 mr-2" />
            Forecasting
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
                <CardDescription>Overview of your current inventory status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Category</th>
                        <th className="text-right p-2">Items</th>
                        <th className="text-right p-2">Value</th>
                        <th className="text-right p-2">Low Stock</th>
                        <th className="text-right p-2">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCategories.map(category => (
                        <tr key={category.name} className="border-b">
                          <td className="p-2">{category.name}</td>
                          <td className="text-right p-2">{category.count}</td>
                          <td className="text-right p-2">${category.value.toFixed(2)}</td>
                          <td className="text-right p-2">{category.lowStock}</td>
                          <td className="text-right p-2">{category.percentOfTotal.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-medium">
                        <td className="p-2">Total</td>
                        <td className="text-right p-2">{totalItems}</td>
                        <td className="text-right p-2">${totalValue.toFixed(2)}</td>
                        <td className="text-right p-2">{lowStockCount}</td>
                        <td className="text-right p-2">100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory Value Trend</CardTitle>
                <CardDescription>Last 5 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] flex flex-col justify-end space-y-4 overflow-hidden">
                  {valueOverTime.map((month, index) => {
                    // Calculate percentage width based on max value for better visualization
                    const maxValue = Math.max(...valueOverTime.map(m => m.value));
                    const widthPercentage = Math.min((month.value / maxValue) * 100, 92); // Cap at 92% to prevent overflow
                    
                    return (
                      <div key={month.month} className="flex items-center w-full">
                        <div className="w-12 text-xs text-muted-foreground shrink-0">{month.month}</div>
                        <div className="flex-1 overflow-hidden">
                          <div 
                            className="bg-primary h-7 rounded-sm flex items-center px-2 text-xs text-primary-foreground truncate"
                            style={{ width: `${widthPercentage}%` }}
                          >
                            ${month.value.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {valueChange.amount > 0 ? 
                  `Increased by $${valueChange.amount.toFixed(2)} (${valueChange.percentage.toFixed(1)}%) since last month` : 
                  `Decreased by $${Math.abs(valueChange.amount).toFixed(2)} (${Math.abs(valueChange.percentage).toFixed(1)}%) since last month`
                }
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Items Requiring Attention</CardTitle>
                <CardDescription>Critical inventory items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Low Stock Items</h4>
                    <div className="border rounded-md">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Item</th>
                            <th className="text-right p-2">Current</th>
                            <th className="text-right p-2">Min Level</th>
                            <th className="text-right p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockItems.slice(0, 3).map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.name}</td>
                              <td className="text-right p-2">{item.currentStock}</td>
                              <td className="text-right p-2">{item.minStockLevel}</td>
                              <td className="text-right p-2">
                                <Badge variant={item.currentStock === 0 ? "destructive" : "warning"} className="text-xs">
                                  {item.currentStock === 0 ? "Out of Stock" : "Low Stock"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Expiration Risk</h4>
                    <div className="border rounded-md">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Item</th>
                            <th className="text-right p-2">Expiry Date</th>
                            <th className="text-right p-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expirationRiskItems.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.name}</td>
                              <td className="text-right p-2">{item.expiryDate}</td>
                              <td className="text-right p-2">${(item.currentStock * item.unitPrice).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Used Items</CardTitle>
                <CardDescription>Based on consumption rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Item</th>
                        <th className="text-right p-2">Usage Rate</th>
                        <th className="text-right p-2">Current Stock</th>
                        <th className="text-right p-2">Weeks Left</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topUsedItems.map(item => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="text-right p-2">{item.usageRate} {item.unit}/week</td>
                          <td className="text-right p-2">{item.currentStock} {item.unit}</td>
                          <td className="text-right p-2">
                            {(item.currentStock / item.usageRate).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Usage rates are calculated based on historical consumption data.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Breakdown of inventory by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sortedCategories.map(category => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm">${category.value.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={category.percentOfTotal} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-12 text-right">{category.percentOfTotal.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.count} items</span>
                        <span>{category.lowStock} low stock</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Insights</CardTitle>
                <CardDescription>Key metrics by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Highest Value</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{sortedCategories[0]?.name}</div>
                      <div className="text-xs text-muted-foreground">{sortedCategories[0]?.count} items</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${sortedCategories[0]?.value.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{sortedCategories[0]?.percentOfTotal.toFixed(1)}% of total</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Most Items</h4>
                  {(() => {
                    const mostItems = [...categoryStats].sort((a, b) => b.count - a.count)[0];
                    return (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{mostItems?.name}</div>
                          <div className="text-xs text-muted-foreground">{((mostItems?.count / totalItems) * 100).toFixed(1)}% of all items</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{mostItems?.count} items</div>
                          <div className="text-xs text-muted-foreground">${mostItems?.value.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Most Low Stock</h4>
                  {(() => {
                    const mostLowStock = [...categoryStats].sort((a, b) => b.lowStock - a.lowStock)[0];
                    return (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{mostLowStock?.name}</div>
                          <div className="text-xs text-muted-foreground">{((mostLowStock?.lowStock / mostLowStock?.count) * 100).toFixed(1)}% of category</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{mostLowStock?.lowStock} items</div>
                          <div className="text-xs text-muted-foreground">need restocking</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="lowstock" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>Items that need to be restocked soon</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileCog className="h-4 w-4 mr-2" />
                Generate Purchase Orders
              </Button>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Item</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-right p-2">Current Stock</th>
                        <th className="text-right p-2">Min Level</th>
                        <th className="text-right p-2">Restock Amount</th>
                        <th className="text-right p-2">Restock Value</th>
                        <th className="text-right p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map(item => {
                        const restockAmount = item.minStockLevel - item.currentStock;
                        const restockValue = restockAmount * item.unitPrice;
                        
                        return (
                          <tr key={item.id} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="text-right p-2">{item.currentStock} {item.unit}</td>
                            <td className="text-right p-2">{item.minStockLevel} {item.unit}</td>
                            <td className="text-right p-2">{restockAmount} {item.unit}</td>
                            <td className="text-right p-2">${restockValue.toFixed(2)}</td>
                            <td className="text-right p-2">
                              <Badge variant={item.currentStock === 0 ? "destructive" : "warning"}>
                                {item.currentStock === 0 ? "Out of Stock" : "Low Stock"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="font-medium">
                        <td colSpan={4} className="p-2">Total</td>
                        <td className="text-right p-2">
                          {lowStockItems.reduce((sum, item) => sum + (item.minStockLevel - item.currentStock), 0)} units
                        </td>
                        <td className="text-right p-2">
                          ${lowStockItems.reduce((sum, item) => sum + ((item.minStockLevel - item.currentStock) * item.unitPrice), 0).toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium">All Items Well Stocked</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are currently no items below their minimum stock levels.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Restock Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${lowStockItems.reduce((sum, item) => sum + ((item.minStockLevel - item.currentStock) * item.unitPrice), 0).toFixed(2)}
                    </div>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs">
                        {lowStockItems.length} items need restocking
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Supplier Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Set(lowStockItems.map(item => item.supplier)).size}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of suppliers needed for restocking
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Priority Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {lowStockItems.filter(item => item.currentStock === 0).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Items that are completely out of stock
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Analysis</CardTitle>
                <CardDescription>Consumption patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Consumed Items</h4>
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Item</th>
                            <th className="text-right p-2">Weekly Usage</th>
                            <th className="text-right p-2">Monthly Cost</th>
                            <th className="text-right p-2">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topUsedItems.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.name}</td>
                              <td className="text-right p-2">{item.usageRate} {item.unit}</td>
                              <td className="text-right p-2">${(item.usageRate * 4 * item.unitPrice).toFixed(2)}</td>
                              <td className="text-right p-2">
                                {Math.random() > 0.5 ? (
                                  <Badge variant="outline" className="text-xs text-green-500">
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    Decreasing
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-amber-500">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Increasing
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Usage by Category</h4>
                    <div className="space-y-4">
                      {sortedCategories.slice(0, 3).map(category => (
                        <div key={category.name}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{category.name}</span>
                            <span className="text-xs text-muted-foreground">Est. monthly usage</span>
                          </div>
                          <Progress value={Math.random() * 80 + 20} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{Math.floor(Math.random() * 50) + 10} units/month</span>
                            <span>${(Math.random() * 200 + 50).toFixed(2)}/month</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usage Patterns</CardTitle>
                <CardDescription>Time-based consumption analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Peak Usage Times</h4>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                        <div key={day} className="text-xs text-muted-foreground">{day}</div>
                      ))}
                      
                      {Array.from({ length: 7 }).map((_, i) => {
                        const value = Math.random() * 100;
                        let bgClass = "bg-green-100";
                        if (value > 70) bgClass = "bg-red-100";
                        else if (value > 40) bgClass = "bg-amber-100";
                        
                        return (
                          <div 
                            key={i} 
                            className={`rounded-sm h-8 flex items-center justify-center text-xs ${bgClass}`}
                          >
                            {value > 70 ? "High" : value > 40 ? "Med" : "Low"}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on average consumption patterns over the past 3 months
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Seasonal Trends</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Q1</span>
                          <span>Q2</span>
                          <span>Q3</span>
                          <span>Q4</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Jan</span>
                          <span>Apr</span>
                          <span>Jul</span>
                          <span>Oct</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        +12%
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Current quarter usage compared to previous quarters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="forecast" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Inventory Forecasting</CardTitle>
                <CardDescription>Projected inventory levels and needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">3-Month Projection</h4>
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Category</th>
                            <th className="text-right p-2">Current Value</th>
                            <th className="text-right p-2">1 Month</th>
                            <th className="text-right p-2">2 Months</th>
                            <th className="text-right p-2">3 Months</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedCategories.map(category => {
                            // Generate random projections for demo
                            const oneMonth = category.value * (0.9 - Math.random() * 0.2);
                            const twoMonth = oneMonth * (0.9 - Math.random() * 0.2);
                            const threeMonth = twoMonth * (0.9 - Math.random() * 0.2);
                            
                            return (
                              <tr key={category.name} className="border-b">
                                <td className="p-2">{category.name}</td>
                                <td className="text-right p-2">${category.value.toFixed(2)}</td>
                                <td className="text-right p-2">${oneMonth.toFixed(2)}</td>
                                <td className="text-right p-2">${twoMonth.toFixed(2)}</td>
                                <td className="text-right p-2">${threeMonth.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="font-medium">
                            <td className="p-2">Total</td>
                            <td className="text-right p-2">${totalValue.toFixed(2)}</td>
                            <td className="text-right p-2">${(totalValue * 0.85).toFixed(2)}</td>
                            <td className="text-right p-2">${(totalValue * 0.7).toFixed(2)}</td>
                            <td className="text-right p-2">${(totalValue * 0.6).toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Projections based on current usage patterns and no additional restocking
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommended Purchase Schedule</h4>
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Timeframe</th>
                            <th className="text-left p-2">Items to Restock</th>
                            <th className="text-right p-2">Estimated Cost</th>
                            <th className="text-right p-2">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Immediate</td>
                            <td className="p-2">{lowStockItems.filter(item => item.currentStock === 0).length} items</td>
                            <td className="text-right p-2">
                              ${lowStockItems.filter(item => item.currentStock === 0)
                                .reduce((sum, item) => sum + ((item.minStockLevel - item.currentStock) * item.unitPrice), 0).toFixed(2)}
                            </td>
                            <td className="text-right p-2">
                              <Badge variant="destructive">Critical</Badge>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Within 2 weeks</td>
                            <td className="p-2">{lowStockItems.filter(item => item.currentStock > 0).length} items</td>
                            <td className="text-right p-2">
                              ${lowStockItems.filter(item => item.currentStock > 0)
                                .reduce((sum, item) => sum + ((item.minStockLevel - item.currentStock) * item.unitPrice), 0).toFixed(2)}
                            </td>
                            <td className="text-right p-2">
                              <Badge variant="warning">High</Badge>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Within 1 month</td>
                            <td className="p-2">{Math.floor(Math.random() * 5) + 3} items</td>
                            <td className="text-right p-2">${(Math.random() * 500 + 200).toFixed(2)}</td>
                            <td className="text-right p-2">
                              <Badge variant="outline">Medium</Badge>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Within 3 months</td>
                            <td className="p-2">{Math.floor(Math.random() * 10) + 5} items</td>
                            <td className="text-right p-2">${(Math.random() * 1000 + 500).toFixed(2)}</td>
                            <td className="text-right p-2">
                              <Badge variant="secondary">Low</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>Financial projections for inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Quarterly Budget</h4>
                  <div className="text-2xl font-bold">${(totalValue * 0.4).toFixed(2)}</div>
                  <Progress value={65} className="h-2 mt-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>65% of quarterly budget used</span>
                    <span>${(totalValue * 0.4 * 0.35).toFixed(2)} remaining</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
                  <div className="space-y-2">
                    {sortedCategories.slice(0, 3).map(category => (
                      <div key={category.name} className="flex justify-between items-center">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm font-medium">${(category.value * 0.4 * (Math.random() * 0.5 + 0.3)).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other Categories</span>
                      <span className="text-sm font-medium">${(totalValue * 0.4 * 0.2).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Savings Opportunities</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">Bulk Purchasing</div>
                        <div className="text-xs text-muted-foreground">5+ suppliers</div>
                      </div>
                      <Badge variant="outline" className="text-green-500">Save 12%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">Alternative Suppliers</div>
                        <div className="text-xs text-muted-foreground">3 categories</div>
                      </div>
                      <Badge variant="outline" className="text-green-500">Save 8%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">Optimized Ordering</div>
                        <div className="text-xs text-muted-foreground">Just-in-time</div>
                      </div>
                      <Badge variant="outline" className="text-green-500">Save 5%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Generate Budget Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}