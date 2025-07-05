'use client';

import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload, UserPlus, Calendar, Settings } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { id: 1, label: 'New Task', icon: <Plus className="h-4 w-4" />, variant: 'default' },
    { id: 2, label: 'New Project', icon: <FileText className="h-4 w-4" />, variant: 'outline' },
    { id: 3, label: 'Upload Files', icon: <Upload className="h-4 w-4" />, variant: 'outline' },
    { id: 4, label: 'Add Team Member', icon: <UserPlus className="h-4 w-4" />, variant: 'outline' },
    { id: 5, label: 'Schedule', icon: <Calendar className="h-4 w-4" />, variant: 'outline' },
    { id: 6, label: 'Settings', icon: <Settings className="h-4 w-4" />, variant: 'outline' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant}
          className="h-auto py-2 flex-col items-center justify-center gap-2 text-xs whitespace-normal text-center"
        >
          {action.icon}
          <span>{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
