import { z } from "zod"
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react"

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    value: "in-progress",
    label: "In Progress",
    icon: AlertCircle,
    color: "text-blue-500",
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
]

export const priorities = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
]

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  priority: z.string(),
  dueDate: z.string().optional(),
  assignedTo: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
  }),
  project: z.object({
    id: z.string(),
    name: z.string(),
  }),
  createdAt: z.string(),
})
