"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Beaker, ArrowRight, ClipboardCheck } from "lucide-react"

// Mock data for the experiments
const experimentData = [
  {
    id: "EXP-1023",
    title: "Enzyme Stability Analysis",
    progress: 75,
    startDate: "2025-03-15",
    endDate: "2025-04-10",
    status: "In Progress",
    department: "Biochemistry",
    lead: "Dr. Sarah Miller",
    completion: [
      { name: "Planning", value: 100 },
      { name: "Execution", value: 80 },
      { name: "Analysis", value: 60 },
      { name: "Reporting", value: 20 }
    ]
  },
  {
    id: "EXP-1024",
    title: "Kinetic Binding Study",
    progress: 35,
    startDate: "2025-03-18",
    endDate: "2025-05-02",
    status: "In Progress",
    department: "Molecular Biology",
    lead: "Dr. James Chen",
    completion: [
      { name: "Planning", value: 100 },
      { name: "Execution", value: 45 },
      { name: "Analysis", value: 10 },
      { name: "Reporting", value: 0 }
    ]
  },
  {
    id: "EXP-1025",
    title: "Substrate Specificity",
    progress: 15,
    startDate: "2025-03-20",
    endDate: "2025-04-25",
    status: "In Progress",
    department: "Enzymology",
    lead: "Dr. Alex Johnson",
    completion: [
      { name: "Planning", value: 100 },
      { name: "Execution", value: 20 },
      { name: "Analysis", value: 0 },
      { name: "Reporting", value: 0 }
    ]
  }
]

export function ExperimentTracker() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Beaker className="h-5 w-5 text-primary" />
          <span>Experiment Progress Tracker</span>
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experimentData.map((experiment, index) => (
            <motion.div 
              key={experiment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{experiment.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{experiment.id}</span>
                    <span>•</span>
                    <span>{experiment.department}</span>
                  </div>
                </div>
                <Badge 
                  variant={experiment.status === "Completed" ? "success" : "secondary"}
                  className="ml-auto"
                >
                  {experiment.status}
                </Badge>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{experiment.progress}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${experiment.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              <div className="mt-4 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={experiment.completion}
                    layout="vertical"
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Completion']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm flex justify-between items-center">
                <div className="text-muted-foreground">
                  <span>{experiment.startDate}</span>
                  <span> to </span>
                  <span>{experiment.endDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  <span>Lead: {experiment.lead}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
