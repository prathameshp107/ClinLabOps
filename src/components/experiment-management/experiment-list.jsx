import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Eye,
  GitBranch,
  MoreHorizontal,
  Trash2,
  Users,
  Beaker,
  FlaskConical,
  Microscope
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function ExperimentList({ experiments, onView }) {
  // Status badge styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  // Priority badge styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  // Get experiment icon based on type
  const getExperimentIcon = (type) => {
    switch (type) {
      case "chemical":
        return <Beaker className="h-4 w-4 text-blue-500" />
      case "biological":
        return <FlaskConical className="h-4 w-4 text-green-500" />
      case "analytical":
        return <Microscope className="h-4 w-4 text-purple-500" />
      default:
        return <Beaker className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="rounded-xl border border-border/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="w-[350px] pl-6 py-4 font-semibold">Experiment</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="font-semibold">Team</TableHead>
            <TableHead className="font-semibold">Version</TableHead>
            <TableHead className="font-semibold">Updated</TableHead>
            <TableHead className="text-right pr-6 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiments.map((experiment, index) => (
            <motion.tr
              key={experiment.id || experiment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="group border-border/40 hover:bg-muted/30 transition-colors"
            >
              <TableCell className="pl-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all">
                    {getExperimentIcon(experiment.type || "chemical")}
                  </div>
                  <div>
                    <div className="font-semibold text-base group-hover:text-primary transition-colors">{experiment.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1 max-w-[250px] mt-0.5">
                      {experiment.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border shadow-sm", getStatusStyles(experiment.status))}>
                  {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border shadow-sm", getPriorityStyles(experiment.priority))}>
                  {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  {experiment.teamMembers && experiment.teamMembers.length > 0 ? (
                    <>
                      {experiment.teamMembers.slice(0, 3).map((member, idx) => (
                        <Avatar key={idx} className="h-8 w-8 border-2 border-background ring-1 ring-border/20">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                            {member.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {experiment.teamMembers.length > 3 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-[10px] font-medium border-2 border-background ring-1 ring-border/20">
                          +{experiment.teamMembers.length - 3}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Unassigned</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center bg-muted/30 w-fit px-2 py-1 rounded-md border border-border/30">
                  <GitBranch className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                  <span className="text-xs font-medium">v{experiment.version}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-2 opacity-70" />
                  <span className="text-sm">{format(parseISO(experiment.updatedAt), "MMM d")}</span>
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(experiment)}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}