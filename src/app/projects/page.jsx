"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectManagement } from "@/components/dashboard/project-management"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project card click
  const handleProjectClick = (projectId) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
        <BackgroundBeams className="opacity-10" />
        
        <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Projects</h1>
              <p className="text-muted-foreground">Manage your research projects and experiments</p>
            </div>
            
            <ProjectManagement 
              projects={projects} 
              loading={loading} 
              onProjectClick={handleProjectClick} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
