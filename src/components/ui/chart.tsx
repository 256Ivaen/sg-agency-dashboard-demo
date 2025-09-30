"use client"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"

import { cn } from "@/lib/utils"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#4ECDC4"]

interface ChartProps {
  data: any[]
  className?: string
}

export function PieChartComponent({ data, className }: ChartProps) {
  console.log("PieChart data:", data) // Debug log

  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-[300px] text-muted-foreground border rounded", className)}>
        <p className="text-sm">No data available for pie chart</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChartComponent({ data, className }: ChartProps) {
  console.log("BarChart data:", data) // Debug log

  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-[300px] text-muted-foreground border rounded", className)}>
        <p className="text-sm">No data available for bar chart</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]}
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChartComponent({ data, className }: ChartProps) {
  console.log("LineChart data:", data) // Debug log

  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-[300px] text-muted-foreground border rounded", className)}>
        <p className="text-sm">No data available for line chart</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]}
            labelFormatter={(label) => `${label}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
