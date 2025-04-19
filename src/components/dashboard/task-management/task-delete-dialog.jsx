"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

export const TaskDeleteDialog = ({ open, onOpenChange, task, onDelete }) => {
  if (!task) return null;
  
  const handleDelete = () => {
    onDelete(task.id);
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-auto p-6 rounded-xl shadow-2xl bg-background">
        <AlertDialogHeader className="flex flex-col items-center justify-center text-center gap-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </span>
            <AlertDialogTitle className="text-lg font-bold text-destructive">Delete Task</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-muted-foreground mt-2 mb-1">
            Are you sure you want to delete <span className="font-semibold text-destructive">"{task.name}"</span>?
            <br />
            <span className="text-xs text-muted-foreground">This action cannot be undone.</span>
            <br />
            <span className="text-xs text-muted-foreground">This will permanently delete the task and remove it from all related experiments.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 mt-6">
          <AlertDialogCancel className="rounded-md px-6 py-2 bg-muted hover:bg-muted/80 border-none">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="rounded-md px-6 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold shadow-sm"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
