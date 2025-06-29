'use client';

import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload, UserPlus, Calendar, Settings } from "lucide-react";
import { quickActions } from "@/data/dashboard-data";

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
