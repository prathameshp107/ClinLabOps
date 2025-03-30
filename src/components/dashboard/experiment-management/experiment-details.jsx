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
  
  const handleUpdate = (updatedData) => {
    onUpdate({
      ...experiment,
      ...updatedData,
    })
    setIsEditing(false)
  }
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {isEditing ? (
        <div className="p-4 overflow-y-auto">
          <ExperimentForm 
            experiment={experiment} 
            onSubmit={handleUpdate} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center space-x-2">
              <Badge className={cn("rounded-md", getStatusStyles(experiment.status))}>
                {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
              </Badge>
              <Badge className={cn("rounded-md", getPriorityStyles(experiment.priority))}>
                {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5 mr-1" />
                <span>Version {experiment.version}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the experiment "{experiment.title}" and all associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1">
              <TabsContent value="overview" className="mt-0 p-1">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{experiment.title}</h2>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Created {format(parseISO(experiment.createdAt), "MMMM d, yyyy")}</span>
                      <span className="mx-2">•</span>
                      <span>Updated {format(parseISO(experiment.updatedAt), "MMMM d, yyyy")}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {experiment.description}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Protocol</h3>
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-sm whitespace-pre-line">
                            {experiment.protocol}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                        <div className="bg-muted p-4 rounded-md">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">Duration</span>
                          </div>
                          {experiment.startDate ? (
                            <div className="text-sm">
                              <div>Start: {format(parseISO(experiment.startDate), "MMMM d, yyyy")}</div>
                              {experiment.endDate && (
                                <div>End: {format(parseISO(experiment.endDate), "MMMM d, yyyy")}</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No dates specified</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                        <div className="bg-muted p-4 rounded-md">
                          <div className="flex items-center mb-2">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">Assigned Personnel</span>
                          </div>
                          {experiment.teamMembers && experiment.teamMembers.length > 0 ? (
                            <ul className="space-y-2">
                              {experiment.teamMembers.map((member, index) => (
                                <li key={index} className="flex items-center">
                                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium mr-2">
                                    {member.split(' ').map(n => n[0]).join('')}
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
                        <h3 className="text-lg font-semibold mb-2">Documents</h3>
                        <div className="bg-muted p-4 rounded-md">
                          <div className="flex items-center mb-2">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">Related Files</span>
                          </div>
                          <div className="text-sm text-muted-foreground">No documents attached</div>
                          <Button variant="outline" size="sm" className="mt-2 w-full">
                            <Download className="h-3.5 w-3.5 mr-2" />
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              
              
              <TabsContent value="results" className="mt-0 p-1">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Experiment Results</h2>
                    
                    {experiment.status === "completed" ? (
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-md">
                          <h3 className="text-lg font-semibold mb-2">Summary</h3>
                          <p className="text-muted-foreground">
                            This experiment was completed successfully with the following key findings...
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Data Visualization</h3>
                          <div className="h-[300px] bg-card rounded-md border p-4">
                            <ExperimentChart />
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-md">
                          <h3 className="text-lg font-semibold mb-2">Conclusions</h3>
                          <p className="text-muted-foreground">
                            Based on the results, we can conclude that...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <Beaker className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">No results available</h3>
                        <p className="text-muted-foreground max-w-md mb-4">
                          This experiment is still in {experiment.status} status. Results will be available once the experiment is completed.
                        </p>
                        <Button variant="outline">
                          Add Preliminary Results
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-0 p-1">
                <div>
                  <h2 className="text-xl font-bold mb-4">Version History</h2>
                  
                  <div className="space-y-4">
                    {experiment.versionHistory && experiment.versionHistory.length > 0 ? (
                      experiment.versionHistory.map((version, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "flex border rounded-md p-4",
                            version.version === experiment.version ? "border-primary bg-primary/5" : ""
                          )}
                        >
                          <div className="mr-4 flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                              v{version.version}
                            </div>
                            {index < experiment.versionHistory.length - 1 && (
                              <div className="w-0.5 h-full bg-muted mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium">
                                {version.version === experiment.version ? "Current Version" : `Version ${version.version}`}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(parseISO(version.updatedAt), "MMMM d, yyyy")}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              Updated by {version.updatedBy}
                            </div>
                            <div className="text-sm">
                              {version.changes}
                            </div>
                            {version.version !== experiment.version && (
                              <Button variant="ghost" size="sm" className="mt-2">
                                <History className="h-3.5 w-3.5 mr-2" />
                                Restore this version
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground">No version history available</div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="discussion" className="mt-0 p-1">
                <div>
                  <h2 className="text-xl font-bold mb-4">Discussion</h2>
                  
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <MessageSquare className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No discussions yet</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      Start a discussion about this experiment with your team members.
                    </p>
                    <Button>
                      Start Discussion
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </>
      )}
    </div>
  )
}