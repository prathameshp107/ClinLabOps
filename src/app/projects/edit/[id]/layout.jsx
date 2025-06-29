import { mockProjects } from "@/data/projects-data";

export async function generateStaticParams() {
  // Get project IDs from centralized data
  const projectIds = mockProjects.map(project => project.id);
  return projectIds.map(id => ({ id }));
}

export default function ProjectEditLayout({ children }) {
  return children;
}
