"use client"

import { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Beaker,
  Calendar,
  Clock,
  Download,
  Edit,
  FileText,
  GitBranch,
  History,
  MessageSquare,
  Trash2,
  Users
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { ExperimentForm } from "./experiment-form"
import { ExperimentChart } from "./experiment-chart"

export function ExperimentDetails({ experiment, onUpdate, onDelete, onClose }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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

  const handleUpdate = (updatedData) => {
    onUpdate({
      ...experiment,
      ...updatedData,
    })
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col h-full max-h-[85vh] overflow-hidden bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm">
      {isEditing ? (
        <div className="p-6 overflow-y-auto h-full">
          <ExperimentForm
            experiment={experiment}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center p-5 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border", getStatusStyles(experiment.status))}>
                  {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                </Badge>
                <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border", getPriorityStyles(experiment.priority))}>
                  {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground border-l border-border/40 pl-3 ml-1">
                <GitBranch className="h-3.5 w-3.5 mr-1.5" />
                <span>Version {experiment.version}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="hover:bg-primary/5 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5 transition-colors">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border border-border/50 shadow-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the experiment "{experiment.title}" and all associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border border-border/50">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(experiment.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-5 pt-4">
              <TabsList className="grid grid-cols-4 w-full bg-muted/50 p-1 rounded-lg">
                <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="results" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Results</TabsTrigger>
                <TabsTrigger value="history" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">History</TabsTrigger>
                <TabsTrigger value="discussion" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Discussion</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-5 py-4 overflow-y-auto" type="always" scrollHideDelay={0}>
              <div className="pb-6"> {/* Added padding at the bottom for better visibility */}
                <TabsContent value="overview" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{experiment.title}</h2>
                      <div className="flex items-center text-sm text-muted-foreground mt-1.5">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                        {experiment.createdAt && typeof experiment.createdAt === 'string' && (
                          <span>Created {format(parseISO(experiment.createdAt), "MMMM d, yyyy")}</span>
                        )}
                        {experiment.createdAt && experiment.updatedAt && typeof experiment.createdAt === 'string' && typeof experiment.updatedAt === 'string' && (
                          <span className="mx-2">•</span>
                        )}
                        {experiment.updatedAt && typeof experiment.updatedAt === 'string' && (
                          <span>Updated {format(parseISO(experiment.updatedAt), "MMMM d, yyyy")}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-lg font-semibold mb-2.5 flex items-center">
                            <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                              <FileText className="h-4 w-4 text-primary" />
                            </span>
                            Description
                          </h3>
                          <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                            <p className="text-muted-foreground whitespace-pre-line">
                              {experiment.description || "No description provided."}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2.5 flex items-center">
                            <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                              <Beaker className="h-4 w-4 text-primary" />
                            </span>
                            Protocol
                          </h3>
                          <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                            <p className="text-sm whitespace-pre-line">
                              {experiment.protocol || "No protocol defined."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2.5 flex items-center">
                          <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                            <Calendar className="h-4 w-4 text-primary" />
                          </span>
                          Timeline
                        </h3>
                        <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                          <div className="flex items-center mb-3">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span className="font-medium">Duration</span>
                          </div>
                          {experiment.startDate && typeof experiment.startDate === 'string' ? (
                            <div className="text-sm space-y-2">
                              <div className="flex items-center">
                                <span className="text-muted-foreground w-16">Start:</span>
                                <span className="font-medium">{format(parseISO(experiment.startDate), "MMMM d, yyyy")}</span>
                              </div>
                              {experiment.endDate && typeof experiment.endDate === 'string' && (
                                <div className="flex items-center">
                                  <span className="text-muted-foreground w-16">End:</span>
                                  <span className="font-medium">{format(parseISO(experiment.endDate), "MMMM d, yyyy")}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No dates specified</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2.5 flex items-center">
                          <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                            <Users className="h-4 w-4 text-primary" />
                          </span>
                          Team Members
                        </h3>
                        <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                          <div className="flex items-center mb-3">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span className="font-medium">Assigned Personnel</span>
                          </div>
                          {experiment.teamMembers && experiment.teamMembers.length > 0 ? (
                            <ul className="space-y-2.5 mt-3">
                              {experiment.teamMembers.map((member, index) => (
                                <li key={index} className="flex items-center bg-background/50 p-2 rounded-md">
                                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium mr-3 border border-primary/20">
                                    {member && typeof member === 'string' ? member.split(' ').map(n => n[0]).join('') : 'TM'}
                                  </div>
                                  <span className="text-sm">{member}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-sm text-muted-foreground">No team members assigned</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2.5 flex items-center">
                          <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </span>
                          Documents
                        </h3>
                        <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                          <div className="flex items-center mb-3">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span className="font-medium">Related Files</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">No documents attached</div>
                          <Button variant="outline" size="sm" className="w-full bg-background/50 hover:bg-primary/5 transition-colors">
                            <Download className="h-3.5 w-3.5 mr-2" />
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                </TabsContent>

                <TabsContent value="results" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center">
                        <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                          <Beaker className="h-4 w-4 text-primary" />
                        </span>
                        Experiment Results
                      </h2>

                      {experiment.status === "completed" ? (
                        <div className="space-y-6">
                          <div className="bg-muted/30 p-5 rounded-lg border border-border/30">
                            <h3 className="text-lg font-semibold mb-3">Summary</h3>
                            <p className="text-muted-foreground">
                              This experiment was completed successfully with the following key findings...
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Data Visualization</h3>
                            <div className="h-[300px] bg-card/50 rounded-lg border border-border/30 p-5 shadow-sm">
                              <ExperimentChart />
                            </div>
                          </div>

                          <div className="bg-muted/30 p-5 rounded-lg border border-border/30">
                            <h3 className="text-lg font-semibold mb-3">Conclusions</h3>
                            <p className="text-muted-foreground">
                              Based on the results, we can conclude that...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/20 rounded-lg border border-border/30">
                          <div className="rounded-full bg-primary/10 p-4 mb-5">
                            <Beaker className="h-7 w-7 text-primary/80" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No results available</h3>
                          <p className="text-muted-foreground max-w-md mb-5">
                            This experiment is still in {experiment.status} status. Results will be available once the experiment is completed.
                          </p>
                          <Button variant="outline" className="bg-background hover:bg-primary/5 transition-colors">
                            Add Preliminary Results
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                        <History className="h-4 w-4 text-primary" />
                      </span>
                      Version History
                    </h2>

                    <div className="space-y-4">
                      {experiment.versionHistory && experiment.versionHistory.length > 0 ? (
                        experiment.versionHistory.map((version, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex border rounded-lg p-4 transition-colors",
                              version.version === experiment.version
                                ? "border-primary/50 bg-primary/5 shadow-sm"
                                : "border-border/30 bg-muted/20 hover:border-primary/30 hover:bg-primary/5"
                            )}
                          >
                            <div className="mr-4 flex flex-col items-center">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-medium border border-primary/20">
                                v{version.version}
                              </div>
                              {index < experiment.versionHistory.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-medium">
                                  {version.version === experiment.version ? "Current Version" : `Version ${version.version}`}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {version.updatedAt && typeof version.updatedAt === 'string'
                                    ? format(parseISO(version.updatedAt), "MMMM d, yyyy")
                                    : 'Date not available'
                                  }
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                Updated by {version.updatedBy}
                              </div>
                              <div className="text-sm bg-background/50 p-2 rounded-md border border-border/20">
                                {version.changes}
                              </div>
                              {version.version !== experiment.version && (
                                <Button variant="ghost" size="sm" className="mt-3 hover:bg-primary/5">
                                  <History className="h-3.5 w-3.5 mr-2" />
                                  Restore this version
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/20 rounded-lg border border-border/30">
                          <div className="rounded-full bg-primary/10 p-4 mb-5">
                            <History className="h-7 w-7 text-primary/80" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No version history</h3>
                          <p className="text-muted-foreground max-w-md">
                            This experiment doesn't have any recorded version history yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="discussion" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </span>
                      Discussion
                    </h2>

                    <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/20 rounded-lg border border-border/30">
                      <div className="rounded-full bg-primary/10 p-4 mb-5">
                        <MessageSquare className="h-7 w-7 text-primary/80" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                      <p className="text-muted-foreground max-w-md mb-5">
                        Start a discussion about this experiment with your team members.
                      </p>
                      <Button className="bg-primary hover:bg-primary/90 transition-colors">
                        Start Discussion
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </>
      )}
    </div>
  )
}