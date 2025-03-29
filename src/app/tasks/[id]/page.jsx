"use client"

// The existing code looks good, but we need to ensure dates are properly formatted for the TaskDetails component

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TaskDetails } from "@/components/dashboard/task-management/task-details"
import { useRouter } from "next/navigation"

// Mock data for development
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", avatarUrl: "" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatarUrl: "" },
  { id: "3", name: "Robert Johnson", email: "robert@example.com", avatarUrl: "" },
];

const mockExperiments = [
  { id: "exp1", name: "Compound A Toxicity Study" },
  { id: "exp2", name: "Compound B Efficacy Test" },
  { id: "exp3", name: "Compound C Cellular Study" },
];

// Mock tasks for development
const generateMockTasks = () => [
  {
    id: "task-1",
    title: "Document experiment results",
    description: "Complete documentation for recent experiment findings",
    status: "completed",
    priority: "low",
    assigneeId: "2",
    experimentId: "exp1",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask1", description: "Organize data files", completed: true },
      { id: "subtask2", description: "Draft initial findings", completed: true },
      { id: "subtask3", description: "Submit to team lead for review", completed: true },
    ],
  },
  {
    id: "t1",
    title: "Analyze blood samples for Project XYZ",
    description: "Run analysis on collected blood samples and record results",
    status: "pending",
    priority: "high",
    assigneeId: "3",
    experimentId: "exp1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask10", description: "Prepare testing equipment", completed: false },
      { id: "subtask11", description: "Process samples according to protocol", completed: false },
      { id: "subtask12", description: "Document findings in lab system", completed: false },
    ],
  },
  {
    id: "task-2",
    title: "Prepare cell cultures for experiment",
    description: "Set up cell cultures for next week's scheduled experiment",
    status: "in-progress",
    priority: "medium",
    assigneeId: "1",
    experimentId: "exp2",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask4", description: "Prepare growth media", completed: true },
      { id: "subtask5", description: "Sterilize equipment", completed: true },
      { id: "subtask6", description: "Set up incubator conditions", completed: false },
    ],
  },
  {
    id: "t2",
    title: "Prepare cell cultures for experiment",
    description: "Set up cell cultures for next week's scheduled experiment",
    status: "in-progress",
    priority: "medium",
    assigneeId: "1",
    experimentId: "exp2",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask4", description: "Prepare growth media", completed: true },
      { id: "subtask5", description: "Sterilize equipment", completed: true },
      { id: "subtask6", description: "Set up incubator conditions", completed: false },
    ],
  },
  {
    id: "task-3",
    title: "Set up equipment for microscopy",
    description: "Configure and calibrate microscope for scheduled imaging session",
    status: "in-progress",
    priority: "high",
    assigneeId: "3",
    experimentId: "exp3",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask7", description: "Clean optical components", completed: true },
      { id: "subtask8", description: "Run calibration protocol", completed: false },
      { id: "subtask9", description: "Test with standard samples", completed: false },
    ],
  },
  {
    id: "t3",
    title: "Document experiment results",
    description: "Complete documentation for recent experiment findings",
    status: "completed",
    priority: "low",
    assigneeId: "2",
    experimentId: "exp1",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask1", description: "Organize data files", completed: true },
      { id: "subtask2", description: "Draft initial findings", completed: true },
      { id: "subtask3", description: "Submit to team lead for review", completed: true },
    ],
  },
  {
    id: "task-4",
    title: "Analyze blood samples for Project XYZ",
    description: "Run analysis on collected blood samples and record results",
    status: "pending",
    priority: "high",
    assigneeId: "3",
    experimentId: "exp1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask10", description: "Prepare testing equipment", completed: false },
      { id: "subtask11", description: "Process samples according to protocol", completed: false },
      { id: "subtask12", description: "Document findings in lab system", completed: false },
    ],
  },
  {
    id: "t4",
    title: "Set up equipment for microscopy",
    description: "Configure and calibrate microscope for scheduled imaging session",
    status: "in-progress",
    priority: "high",
    assigneeId: "3",
    experimentId: "exp3",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask7", description: "Clean optical components", completed: true },
      { id: "subtask8", description: "Run calibration protocol", completed: false },
      { id: "subtask9", description: "Test with standard samples", completed: false },
    ],
  },
  {
    id: "task-5",
    title: "Analyze data from previous experiment",
    description: "Statistical analysis of results from last month's experiments",
    status: "pending",
    priority: "medium",
    assigneeId: "3",
    experimentId: "exp2",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask13", description: "Import data into analysis software", completed: false },
      { id: "subtask14", description: "Run statistical tests", completed: false },
      { id: "subtask15", description: "Generate visualizations", completed: false },
      { id: "subtask16", description: "Document methodology", completed: false },
    ],
  },
  {
    id: "t5",
    title: "Analyze data from previous experiment",
    description: "Statistical analysis of results from last month's experiments",
    status: "pending",
    priority: "medium",
    assigneeId: "3",
    experimentId: "exp2",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: "subtask13", description: "Import data into analysis software", completed: false },
      { id: "subtask14", description: "Run statistical tests", completed: false },
      { id: "subtask15", description: "Generate visualizations", completed: false },
      { id: "subtask16", description: "Document methodology", completed: false },
    ],
  },
];

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch the task data from an API
    const mockTaskData = generateMockTasks();
    
    // Convert date objects to ISO strings for proper handling in components
    const formattedTasks = mockTaskData.map(task => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate.toISOString()
    }));
    
    setAllTasks(formattedTasks);

    const taskId = params.id;
    // Find the task with matching ID
    const foundTask = formattedTasks.find(t => String(t.id) === String(taskId));

    if (foundTask) {
      setTask(foundTask);
    }
  }, [params.id]);

  // Handle task updates
  const handleTaskUpdate = (updatedTask) => {
    setTask(updatedTask);

    // Update the task in the all tasks array
    const updatedTasks = allTasks.map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setAllTasks(updatedTasks);

    // In a real app, you would save the changes to your backend
  };

  // Handle task deletion
  const handleTaskDelete = (taskId) => {
    // In a real app, you would make an API call to delete the task
    const updatedTasks = allTasks.filter(t => t.id !== taskId);
    setAllTasks(updatedTasks);

    // Navigate back to the tasks list
    router.push("/tasks");
  };

  return (
    <DashboardLayout>
      {task ? (
        <TaskDetails
          taskId={task.id}
          task={task}
          onBack={() => router.push("/tasks")}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          relatedTasks={allTasks}
          experiments={mockExperiments}
        />
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Task not found</h3>
            <p className="text-gray-500">The task you're looking for doesn't exist or has been deleted.</p>
            <button
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              onClick={() => router.push("/tasks")}
            >
              Back to Task List
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
