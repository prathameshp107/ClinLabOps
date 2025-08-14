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
  Users,
  ArrowRight,
  FlaskConical,
  Microscope
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

export function ExperimentGrid({ experiments, onView }) {
  // Status badge styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 border-green-200 dark:border-green-800/50"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/70 dark:text-gray-300 border-gray-200 dark:border-gray-700/50"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/70 dark:text-gray-300 border-gray-200 dark:border-gray-700/50"
    }
  }

  // Priority badge styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300 border-red-200 dark:border-red-800/50"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-300 border-orange-200 dark:border-orange-800/50"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 border-green-200 dark:border-green-800/50"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/70 dark:text-gray-300 border-gray-200 dark:border-gray-700/50"
    }
  }

  // Get experiment icon based on type
  const getExperimentIcon = (type) => {
    switch (type) {
      case "chemical":
        return <Beaker className="h-5 w-5 text-blue-500" />
      case "biological":
        return <FlaskConical className="h-5 w-5 text-green-500" />
      case "analytical":
        return <Microscope className="h-5 w-5 text-purple-500" />
      default:
        return <Beaker className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiments.map((experiment) => (
        <Card
          key={experiment.id}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30 group"
        >
          <CardHeader className="pb-3 pt-10 relative"> {/* Increased top padding to make room for badges */}
            <div className="absolute top-0 right-0 mt-3 mr-4 flex space-x-1.5"> {/* Adjusted top margin */}
              <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border", getStatusStyles(experiment.status))}>
                {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
              </Badge>
              <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border", getPriorityStyles(experiment.priority))}>
                {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
              </Badge>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2.5 rounded-lg">
                {getExperimentIcon(experiment.type || "chemical")}
              </div>
              <div className="max-w-[calc(100%-60px)]"> {/* Added max width to prevent overflow */}
                <CardTitle className="line-clamp-1 text-lg">{experiment.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <GitBranch className="h-3.5 w-3.5 mr-1.5" />
                  Version {experiment.version}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-5 mt-1">
              {experiment.description}
            </p>

            <div className="space-y-3 text-sm">
              {experiment.startDate && typeof experiment.startDate === 'string' && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2.5 text-primary/70" />
                  <span>
                    {format(parseISO(experiment.startDate), "MMM d, yyyy")}
                    {experiment.endDate && typeof experiment.endDate === 'string' && ` - ${format(parseISO(experiment.endDate), "MMM d, yyyy")}`}
                  </span>
                </div>
              )}

              {experiment.teamMembers && experiment.teamMembers.length > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2.5 text-primary/70" />
                    <span>{experiment.teamMembers.length} team members</span>
                  </div>

                  <div className="flex -space-x-2">
                    {experiment.teamMembers.slice(0, 3).map((member, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-background">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name || 'Team member'} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {member.name ? member.name.split(' ').map(n => n[0]).join('') : 'TM'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    ))}
                    {experiment.teamMembers.length > 3 && (
                      <Avatar className="h-6 w-6 border-2 border-background bg-muted">
                        <AvatarFallback className="text-xs font-medium">
                          +{experiment.teamMembers.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              )}

              {experiment.updatedAt && typeof experiment.updatedAt === 'string' && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2.5 text-primary/70" />
                  <span>Updated {format(parseISO(experiment.updatedAt), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 px-6 py-3 border-t border-border/30">
            <Button
              variant="default"
              className="w-full group-hover:bg-primary/90 transition-colors"
              onClick={() => onView(experiment)}
            >
              <span>View Details</span>
              <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}