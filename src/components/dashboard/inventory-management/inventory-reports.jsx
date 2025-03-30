"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  ArrowDownToLine, 
  BarChart3, 
  Calendar, 
  Download, 
  FileText, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Printer, 
  Share2 
} from "lucide-react"

export function InventoryReports({ inventoryItems }) {
  const [timeRange, setTimeRange] = useState("month")
  
  // Generate mock data for reports
  const valueByCategory = getValueByCategory(inventoryItems)
  const stockMovementData = generateStockMovementData()
  const inventoryTrendsData = generateInventoryTrendsData()
  const topItemsData = getTopItems(inventoryItems)
  const lowStockData = getLowStockItems(inventoryItems)
  
  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57']
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Reports</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          // Continuing from where we left off
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="stock-movement">Stock Movement</TabsTrigger>
                    <TabsTrigger value="inventory-trends">Inventory Trends</TabsTrigger>
                    <TabsTrigger value="detailed-reports">Detailed Reports</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PieChartIcon className="h-5 w-5 mr-2" />
                            Inventory Value by Category
                          </CardTitle>
                          <CardDescription>
                            Distribution of inventory value across categories
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={valueByCategory}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  nameKey="category"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {valueByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Top Items by Value
                          </CardTitle>
                          <CardDescription>
                            Highest value items in inventory
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={topItemsData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                <Bar dataKey="value" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <ArrowDownToLine className="h-5 w-5 mr-2" />
                          Low Stock Items
                        </CardTitle>
                        <CardDescription>
                          Items that need to be restocked soon
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={lowStockData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar name="Current Stock" dataKey="currentStock" fill="#8884d8" />
                              <Bar name="Min Stock Level" dataKey="minStockLevel" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="stock-movement" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <LineChartIcon className="h-5 w-5 mr-2" />
                          Stock Movement Over Time
                        </CardTitle>
                        <CardDescription>
                          Inventory inflow and outflow over the selected time period
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-96">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={stockMovementData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="inflow" stroke="#82ca9d" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="outflow" stroke="#ff7300" activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="inventory-trends" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <LineChartIcon className="h-5 w-5 mr-2" />
                          Inventory Value Trends
                        </CardTitle>
                        <CardDescription>
                          Total inventory value over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-96">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={inventoryTrendsData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                              <Legend />
                              <Line type="monotone" dataKey="totalValue" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="detailed-reports" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Inventory Valuation Report
                          </CardTitle>
                          <CardDescription>
                            Detailed valuation of all inventory items
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">Last generated: Yesterday</p>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Stock Movement Report
                          </CardTitle>
                          <CardDescription>
                            Detailed log of all stock movements
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">Last generated: 3 days ago</p>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Expiry Report
                          </CardTitle>
                          <CardDescription>
                            Items approaching expiration date
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">Last generated: Today</p>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Generate Custom Report</CardTitle>
                        <CardDescription>
                          Create a custom report with specific parameters
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Select defaultValue="inventory-valuation">
                            <SelectTrigger>
                              <SelectValue placeholder="Report Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inventory-valuation">Inventory Valuation</SelectItem>
                              <SelectItem value="stock-movement">Stock Movement</SelectItem>
                              <SelectItem value="expiry">Expiry Report</SelectItem>
                              <SelectItem value="supplier">Supplier Report</SelectItem>
                              <SelectItem value="location">Location Report</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="chemicals">Chemicals</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="consumables">Consumables</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select defaultValue="pdf">
                            <SelectTrigger>
                              <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button className="mt-4">
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )
          }
          
          // Helper functions for generating mock data
          function getValueByCategory(items) {
            const categories = {};
            
            // If no items provided, generate mock data
            if (!items || items.length === 0) {
              return [
                { category: "Chemicals", value: 12500 },
                { category: "Equipment", value: 28000 },
                { category: "Glassware", value: 5600 },
                { category: "Consumables", value: 8900 },
                { category: "Reagents", value: 15200 }
              ];
            }
            
            // Calculate value by category from provided items
            items.forEach(item => {
              const category = item.category;
              const value = item.currentStock * item.unitPrice;
              
              if (categories[category]) {
                categories[category] += value;
              } else {
                categories[category] = value;
              }
            });
            
            return Object.keys(categories).map(category => ({
              category,
              value: categories[category]
            }));
          }
          
          function getTopItems(items) {
            // If no items provided, generate mock data
            if (!items || items.length === 0) {
              return [
                { name: "Centrifuge", value: 8500 },
                { name: "Microscope", value: 6200 },
                { name: "Spectrophotometer", value: 5800 },
                { name: "PCR Machine", value: 4500 },
                { name: "Analytical Balance", value: 3200 }
              ];
            }
            
            // Calculate value for each item
            const itemsWithValue = items.map(item => ({
              name: item.name,
              value: item.currentStock * item.unitPrice
            }));
            
            // Sort by value and take top 5
            return itemsWithValue
              .sort((a, b) => b.value - a.value)
              .slice(0, 5);
          }
          
          function getLowStockItems(items) {
            // If no items provided, generate mock data
            if (!items || items.length === 0) {
              return [
                { name: "Nitrile Gloves", currentStock: 5, minStockLevel: 10 },
                { name: "Buffer Solution", currentStock: 3, minStockLevel: 8 },
                { name: "Petri Dishes", currentStock: 12, minStockLevel: 20 },
                { name: "Pipette Tips", currentStock: 15, minStockLevel: 25 },
                { name: "Ethanol", currentStock: 2, minStockLevel: 5 }
              ];
            }
            
            // Filter low stock items
            return items
              .filter(item => item.currentStock <= item.minStockLevel)
              .sort((a, b) => (a.currentStock / a.minStockLevel) - (b.currentStock / b.minStockLevel))
              .slice(0, 5)
              .map(item => ({
                name: item.name,
                currentStock: item.currentStock,
                minStockLevel: item.minStockLevel
              }));
          }
          
          function generateStockMovementData() {
            const data = [];
            const now = new Date();
            
            for (let i = 30; i >= 0; i--) {
              const date = new Date(now);
              date.setDate(date.getDate() - i);
              
              data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                inflow: Math.floor(Math.random() * 50) + 10,
                outflow: Math.floor(Math.random() * 40) + 5
              });
            }
            
            return data;
          }
          
          function generateInventoryTrendsData() {
            const data = [];
            const now = new Date();
            let value = 50000; // Starting value
            
            for (let i = 90; i >= 0; i--) {
              const date = new Date(now);
              date.setDate(date.getDate() - i);
              
              // Random fluctuation between -3% and +5%
              const change = value * (Math.random() * 0.08 - 0.03);
              value += change;
              
              data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                totalValue: value
              });
            }
            
            return data;
          }