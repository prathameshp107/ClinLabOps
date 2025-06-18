import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";
import Dashboard from "@/app/dashboard/page";
import UserManagement from "@/app/user-management/page";
import Experiments from "@/app/experiments/page";
import Analytics from "@/app/analytics/page";
import Tasks from "@/app/tasks/page";
import Projects from "@/app/projects/page";
import Inventory from "@/app/inventory/page";
import Settings from "@/app/settings/page";

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "experiments",
        element: <Experiments />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;