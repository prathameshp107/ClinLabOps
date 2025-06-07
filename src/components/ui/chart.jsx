"use client"

import { createContext, useContext } from "react"
import { Tooltip } from "recharts"

const ChartContext = createContext({})

export function ChartContainer({ children, config, className }) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={className}>{children}</div>
    </ChartContext.Provider>
  )
}

export function ChartTooltip({ children, ...props }) {
  return <Tooltip {...props} />
}

export function ChartTooltipContent({ nameKey }) {
  return ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <p className="text-sm font-medium text-gray-900">{payload[0].payload[nameKey]}</p>
          <p className="text-sm text-gray-600">{payload[0].value}</p>
        </div>
      )
    }
    return null
  }
}

export function ChartLegend({ children, className }) {
  return children
}

export function ChartLegendContent({ nameKey }) {
  const { config } = useContext(ChartContext)
  
  return ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-2">
        {payload.map((entry, index) => {
          const itemConfig = config[entry.value]
          return (
            <div key={`legend-${index}`} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600">{itemConfig?.label || entry.value}</span>
            </div>
          )
        })}
      </div>
    )
  }
} 