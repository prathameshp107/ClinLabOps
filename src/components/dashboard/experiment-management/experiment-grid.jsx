import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Beaker, 
  Calendar, 
  Clock, 
  GitBranch, 
  Users 
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

export function ExperimentGrid({ experiments, onView }) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiments.map((experiment) => (
        <Card key={experiment.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{experiment.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <GitBranch className="h-3.5 w-3.5 mr-1" />
                  Version {experiment.version}
                </CardDescription>
              </div>
              <div className="flex space-x-1">
                <Badge className={cn("rounded-md", getStatusStyles(experiment.status))}>
                  {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                </Badge>
                <Badge className={cn("rounded-md", getPriorityStyles(experiment.priority))}>
                  {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {experiment.description}
            </p>
            
            <div className="space-y-2 text-sm">
              {experiment.startDate && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  <span>
                    {format(parseISO(experiment.startDate), "MMM d, yyyy")}
                    {experiment.endDate && ` - ${format(parseISO(experiment.endDate), "MMM d, yyyy")}`}
                  </span>
                </div>
              )}
              
              {experiment.teamMembers && experiment.teamMembers.length > 0 && (
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-2" />
                  <span>{experiment.teamMembers.length} team members</span>
                </div>
              )}
              
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-2" />
                <span>Updated {format(parseISO(experiment.updatedAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-3">
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => onView(experiment)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}