"use client"

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"

// Mock data for the chart
const data = [
  { name: "Day 1", sample1: 4000, sample2: 2400, sample3: 1800 },
  { name: "Day 2", sample1: 3000, sample2: 1398, sample3: 2800 },
  { name: "Day 3", sample1: 2000, sample2: 9800, sample3: 2200 },
  { name: "Day 4", sample1: 2780, sample2: 3908, sample3: 2000 },
  { name: "Day 5", sample1: 1890, sample2: 4800, sample3: 2181 },
  { name: "Day 6", sample1: 2390, sample2: 3800, sample3: 2500 },
  { name: "Day 7", sample1: 3490, sample2: 4300, sample3: 2100 },
]

export function ExperimentChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
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
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="sample1" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
          name="Sample A"
        />
        <Line 
          type="monotone" 
          dataKey="sample2" 
          stroke="#82ca9d" 
          name="Sample B"
        />
        <Line 
          type="monotone" 
          dataKey="sample3" 
          stroke="#ffc658" 
          name="Sample C"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}