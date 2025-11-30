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
  Microscope,
  MoreVertical
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function ExperimentGrid({ experiments, onView }) {
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
        return <Beaker className="h-6 w-6 text-blue-500" />
      case "biological":
        return <FlaskConical className="h-6 w-6 text-green-500" />
      case "analytical":
        return <Microscope className="h-6 w-6 text-purple-500" />
      default:
        return <Beaker className="h-6 w-6 text-blue-500" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiments.map((experiment, index) => (
        <motion.div
          key={experiment.id || experiment._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card
            className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 group bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex flex-col"
          >
            <CardHeader className="pb-3 pt-6 relative">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-primary/5 p-3 rounded-xl ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all">
                  {getExperimentIcon(experiment.type || "chemical")}
                </div>
                <div className="flex gap-2">
                  <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold border shadow-sm", getPriorityStyles(experiment.priority))}>
                    {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <CardTitle className="line-clamp-1 text-lg font-bold group-hover:text-primary transition-colors">
                  {experiment.title}
                </CardTitle>
                <CardDescription className="flex items-center text-xs font-medium">
                  <GitBranch className="h-3 w-3 mr-1" />
                  Version {experiment.version}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pb-6 flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
                {experiment.description}
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border", getStatusStyles(experiment.status))}>
                    {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                  </Badge>

                  {experiment.updatedAt && (
                    <div className="flex items-center text-xs text-muted-foreground" title="Last updated">
                      <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      <span>{format(new Date(experiment.updatedAt), "MMM d")}</span>
                    </div>
                  )}
                </div>

                {experiment.startDate && (
                  <div className="flex items-center text-xs text-muted-foreground bg-muted/30 p-2 rounded-md border border-border/50">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-primary/70" />
                    <span>
                      {format(new Date(experiment.startDate), "MMM d, yyyy")}
                      {experiment.endDate && ` - ${format(new Date(experiment.endDate), "MMM d, yyyy")}`}
                    </span>
                  </div>
                )}

                {experiment.teamMembers && experiment.teamMembers.length > 0 && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {experiment.teamMembers.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="h-7 w-7 border-2 border-background ring-1 ring-border/20">
                          {member.avatar ? (
                            <AvatarImage src={member.avatar} alt={member.name || 'Team member'} />
                          ) : (
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                              {member.name ? member.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'TM'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      ))}
                      {experiment.teamMembers.length > 3 && (
                        <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium ring-1 ring-border/20">
                          +{experiment.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {experiment.teamMembers.length} Member{experiment.teamMembers.length !== 1 && 's'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 px-5 py-3 border-t border-border/40 group-hover:bg-primary/5 transition-colors">
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-transparent hover:text-primary p-0 h-auto font-medium"
                onClick={() => onView(experiment)}
              >
                <span>View Details</span>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}