"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import our new components
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectOverview } from "@/components/projects/project-overview"
import { ProjectTasks } from "@/components/projects/project-tasks"
import { ProjectTeam } from "@/components/projects/project-team"
import { ProjectDocuments } from "@/components/projects/project-documents"
import { ProjectTimeline } from "@/components/projects/project-timeline"
import { AddTaskModal } from "@/components/projects/add-task-modal"
import { AddMemberModal } from "@/components/projects/add-member-modal"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"


export default function ProjectPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  
  // Add useEffect to fetch project data
  useEffect(() => {
    // Simulate fetching project data
    const fetchProject = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch(`/api/projects/${id}`);
        // const data = await response.json();
        
        // For now, using enhanced mock data
        const mockProject = {
          id: id,
          name: "Laboratory Management System",
          status: "active",
          createdAt: new Date().toISOString(),
          description: "This project aims to develop a new laboratory management system that streamlines sample tracking, experiment scheduling, and result reporting.",
          progress: 35,
          deadline: "Dec 31, 2023",
          priority: "medium",
          team: [
            { id: 'm1', name: 'Sarah Miller', role: 'Project Lead', department: 'Research', joinedAt: '3 months ago', avatar: '/avatars/sarah.png' },
            { id: 'm2', name: 'John Doe', role: 'Lab Technician', department: 'Laboratory', joinedAt: '2 months ago', avatar: '/avatars/john.png' },
            { id: 'm3', name: 'Emily Chen', role: 'Data Scientist', department: 'Analytics', joinedAt: '1 month ago', avatar: '/avatars/emily.png' },
            { id: 'm4', name: 'Michael Brown', role: 'Research Assistant', department: 'Research', joinedAt: '3 weeks ago', avatar: '/avatars/michael.png' }
          ],
          tasks: [
            { id: 't1', name: 'Sample Collection', status: 'completed', assignee: 'Sarah Miller', assigneeId: 'm1', dueDate: 'Oct 25, 2023', priority: 'high', progress: 100, description: 'Collect all required samples from the laboratory storage.' },
            { id: 't2', name: 'PCR Analysis', status: 'in_progress', assignee: 'John Doe', assigneeId: 'm2', dueDate: 'Nov 5, 2023', priority: 'medium', progress: 65, description: 'Perform PCR analysis on the collected samples.' },
            { id: 't3', name: 'Data Processing', status: 'pending', assignee: 'Emily Chen', assigneeId: 'm3', dueDate: 'Nov 15, 2023', priority: 'medium', progress: 0, description: 'Process the raw data from PCR analysis using statistical methods.' },
            { id: 't4', name: 'Report Generation', status: 'pending', assignee: 'Michael Brown', assigneeId: 'm4', dueDate: 'Nov 30, 2023', priority: 'low', progress: 0, description: 'Generate comprehensive report based on the processed data.' },
            { id: 't5', name: 'Quality Control', status: 'pending', assignee: 'Sarah Miller', assigneeId: 'm1', dueDate: 'Dec 10, 2023', priority: 'high', progress: 0, description: 'Perform quality control checks on all results and reports.' },
            { id: 't6', name: 'Report Review', status: 'pending', assignee: 'Sarah Miller', assigneeId:'m1', dueDate: 'Dec 20, 2023', priority: 'high', progress: 0, description: 'Review the final report and provide feedback to the team.' },
            { id: 't7', name: 'Report Submission', status: 'pending', assignee: 'Sarah Miller', assigneeId:'m1', dueDate: 'Dec 30, 2023', priority: 'high', progress: 0, description: 'Submit the final report to the client.' },
            { id: 't8', name: 'Report Review', status: 'pending', assignee: 'Sarah Miller', assigneeId:'m1', dueDate: 'Dec 30, 2023', priority: 'high', progress: 0, description: 'Review the final report and provide feedback to the team.' },
            { id: 't9', name: 'Report Submission', status: 'pending', assignee: 'Sarah Miller', assigneeId:'m1', dueDate: 'Dec 30, 2023', priority: 'high', progress: 0, description: 'Submit the final report to the client.' },
            { id: 't10', name: 'Report Review', status: 'pending', assignee: 'Sarah Miller', assigneeId:'m1', dueDate: 'Dec 30, 2023', priority: 'high', progress: 0, description: 'Review the final report and provide feedback to the team.' } ,
            { id: 't11', name: 'Report Submission', status: 'pending', assignee: 'Sarah Miller', assigneeId:'m1', dueDate: 'Dec 30, 2023', priority: 'high', progress: 0, description: 'Submit the final report to the client.' }
          ],
          documents: [
            { id: 'd1', name: 'Project Proposal.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'Sarah Miller', uploadedAt: 'Oct 10, 2023', tags: ['proposal', 'planning'] },
            { id: 'd2', name: 'Experiment Protocol.docx', type: 'docx', size: '1.8 MB', uploadedBy: 'John Doe', uploadedAt: 'Oct 15, 2023', tags: ['protocol', 'methods'] },
            { id: 'd3', name: 'Initial Results.xlsx', type: 'xlsx', size: '3.2 MB', uploadedBy: 'Emily Chen', uploadedAt: 'Oct 25, 2023', tags: ['data', 'results'] },
            { id: 'd4', name: 'Literature Review.pdf', type: 'pdf', size: '5.1 MB', uploadedBy: 'Michael Brown', uploadedAt: 'Nov 1, 2023', tags: ['research', 'literature'] },
            { id: 'd5', name: 'Budget Allocation.xlsx', type: 'xlsx', size: '1.5 MB', uploadedBy: 'Sarah Miller', uploadedAt: 'Nov 3, 2023', tags: ['budget', 'planning'] },
            { id: 'd6', name: 'Project Report.pdf', type: 'pdf', size: '7.2 MB', uploadedBy: 'Sarah Miller', uploadedAt: 'Nov 10, 2023', tags: ['report', 'final'] },
            { id: 'd7', name: 'Sample Collection Protocol.pdf', type: 'pdf', size: '1.9 MB', uploadedBy: 'Sarah Miller', uploadedAt: 'Nov 15, 2023', tags: ['protocol', 'collection'] },
            { id: 'd8', name: 'Sample Storage Guidelines.pdf', type: 'pdf', size: '1.2 MB', uploadedBy: 'Sarah Miller', uploadedAt: 'Nov 20, 2023', tags: ['storage', 'guidelines'] },
            { id: 'd9', name: 'Sample Preparation Protocol.pdf', type: 'pdf', size: '2.1 MB', uploadedBy: 'Sarah Miller', uploadedAt: 'Nov 25, 2023', tags: ['protocol', 'preparation'] },
          ],
          activities: [
            { id: 'a1', type: 'task_completed', user: 'Sarah Miller', userId: 'm1', task: 'Sample Collection', taskId: 't1', time: '2 hours ago', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { id: 'a2', type: 'comment_added', user: 'John Doe', userId: 'm2', task: 'PCR Analysis', taskId: 't2', comment: 'Found some interesting patterns in the samples.', time: '5 hours ago', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
            { id: 'a3', type: 'document_uploaded', user: 'Emily Chen', userId: 'm3', document: 'Initial Results.xlsx', documentId: 'd3', time: '1 day ago', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
            { id: 'a4', type: 'member_joined', user: 'Michael Brown', userId: 'm4', time: '3 days ago', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'a5', type: 'task_created', user: 'Sarah Miller', userId: 'm1', task: 'Quality Control', taskId: 't5', time: '4 days ago', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
          ],
          milestones: [
            { id: 'ms1', name: 'Phase 1 Completion', date: 'Nov 15, 2023', status: 'upcoming', description: 'Complete all initial sample collection and analysis.' },
            { id: 'ms2', name: 'Interim Report', date: 'Dec 1, 2023', status: 'upcoming', description: 'Submit interim report with preliminary findings.' },
            { id: 'ms3', name: 'Final Testing', date: 'Dec 20, 2023', status: 'upcoming', description: 'Complete all testing and validation procedures.' },
            { id: 'ms4', name: 'Project Delivery', date: 'Dec 31, 2023', status: 'upcoming', description: 'Deliver final project with complete documentation.' }
          ],
          timeline: [
            { id: 'tl1', date: 'Oct 1, 2023', title: 'Project Started', description: 'Initial kickoff meeting and team formation', completed: true },
            { id: 'tl2', date: 'Oct 15, 2023', title: 'Planning Phase Completed', description: 'Project plan and resource allocation finalized', completed: true },
            { id: 'tl3', date: 'Nov 1, 2023', title: 'Development Started', description: 'Beginning of core development activities', completed: true },
            { id: 'tl4', date: 'Dec 15, 2023', title: 'Testing Phase', description: 'Quality assurance and validation testing', completed: false },
            { id: 'tl5', date: 'Dec 31, 2023', title: 'Project Completion', description: 'Final deliverables and project closure', completed: false }
          ],
          tags: ["Research", "Development", "Laboratory", "Software", "Data Analysis"]
        };
        
        setProject(mockProject);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);

  // Handlers for actions
  const handleAddTask = () => {
    console.log("Adding new task");
    // Implement task addition logic here
  };

  const handleAddMember = () => {
    console.log("Adding new team member");
    // Implement member addition logic here
  };
  
  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 bg-background/60">
        {loading ? (
          <div className="space-y-4 w-full max-w-6xl mx-auto">
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-1/2 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto">
            {/* Project Header */}
            <ProjectHeader
              project={project}
              onAddTask={() => setShowAddTaskModal(true)}
              onAddMember={() => setShowAddMemberModal(true)}
            />

            {/* Project Tabs */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <ProjectOverview project={project} />
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <ProjectTasks
                  tasks={project.tasks}
                  team={project.team}
                  onAddTask={() => setShowAddTaskModal(true)}
                />
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                <ProjectTeam
                  team={project.team}
                  onAddMember={() => setShowAddMemberModal(true)}
                />
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <ProjectDocuments documents={project.documents} />
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <ProjectTimeline timeline={project.timeline} />
              </TabsContent>
            </Tabs>

            {/* Modals */}
            <AddTaskModal
              open={showAddTaskModal}
              onOpenChange={setShowAddTaskModal}
              project={project}
              onAddTask={handleAddTask}
            />

            <AddMemberModal
              open={showAddMemberModal}
              onOpenChange={setShowAddMemberModal}
              onAddMember={handleAddMember}
            />

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
                      <Plus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Quick Actions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
