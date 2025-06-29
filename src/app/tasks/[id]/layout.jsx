import { mockTasks } from "@/data/tasks-data";

export async function generateStaticParams() {
  // Get task IDs from centralized data - replace with your actual data source in production
  const taskIds = mockTasks.map(task => task.id);
  
  return taskIds.map(id => ({
    id: id,
  }));
}

export default function TaskLayout({ children }) {
  return children;
}