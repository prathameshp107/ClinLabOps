'use client';

import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload, UserPlus, Calendar, Settings } from "lucide-react";

const quickActions = [
  { id: 1, label: 'New Task', icon: <Plus size={20} />, variant: 'outline' },
  { id: 2, label: 'New Project', icon: <FileText size={20} />, variant: 'outline' },
  { id: 3, label: 'Upload Files', icon: <Upload size={20} />, variant: 'outline' },
  { id: 4, label: 'Add User', icon: <UserPlus size={20} />, variant: 'outline' },
  { id: 5, label: 'Calendar', icon: <Calendar size={20} />, variant: 'outline' },
  { id: 6, label: 'Settings', icon: <Settings size={20} />, variant: 'outline' },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {quickActions.map((action) => (
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
