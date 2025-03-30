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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  Edit, 
  Eye, 
  GitBranch, 
  MoreHorizontal, 
  Trash2, 
  Users 
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

export function ExperimentList({ experiments, onView }) {
  // Status badge styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }
  
  // Priority badge styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Experiment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiments.map((experiment) => (
            <TableRow key={experiment.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{experiment.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {experiment.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn("rounded-md", getStatusStyles(experiment.status))}>
                  {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn("rounded-md", getPriorityStyles(experiment.priority))}>
                  {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  {experiment.teamMembers && experiment.teamMembers.length > 0 ? (
                    <>
                      {experiment.teamMembers.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="h-7 w-7 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {member.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {experiment.teamMembers.length > 3 && (
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted text-xs font-medium">
                          +{experiment.teamMembers.length - 3}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">No team assigned</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <GitBranch className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>v{experiment.version}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{format(parseISO(experiment.updatedAt), "MMM d, yyyy")}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(experiment)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}