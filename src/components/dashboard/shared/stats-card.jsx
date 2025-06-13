"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"

export function StatsCard({ title, value, icon, className, trend, trendValue }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className={cn("overflow-hidden border-l-4", 
        trend === "up" ? "border-l-green-500" : 
        trend === "down" ? "border-l-amber-500" : 
        "border-l-blue-500", 
        className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && (
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <motion.p 
              className={cn(
                "text-xs mt-1 flex items-center",
                trend === "up" ? "text-green-500" : 
                trend === "down" ? "text-amber-500" : ""
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trendValue}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
