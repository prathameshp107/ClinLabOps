"use client";

import { useState } from "react";

import { FileText, Edit2, Save, X, Calendar, User, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TaskOverview({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task?.description || '');

  // Helper function to safely format dates
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDescription(task?.description || '');
    setIsEditing(false);
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          textColor: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950',
          icon: '🔥'
        };
      case 'medium':
        return {
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50 dark:bg-amber-950',
          icon: '⚡'
        };
      case 'low':
        return {
          textColor: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950',
          icon: '📋'
        };
      default:
        return {
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
          icon: '📋'
        };
    }
  };

  const priorityConfig = getPriorityConfig(task?.priority || 'medium');

  return (
    <div className="relative">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="pb-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500 shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Task Overview
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {task?.title || 'Untitled Task'}
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[140px] border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:border-indigo-500 resize-none"
                  placeholder="Enter task description..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {description.length} characters
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="rounded-lg border-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="rounded-lg bg-indigo-500 hover:bg-indigo-600 shadow-md"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Description with better typography */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Tags section */}
              {task?.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Enhanced metadata grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Creator info */}
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <User className="h-3 w-3" />
                    Created by
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-gray-800 shadow-md">
                      <AvatarImage src={task?.createdBy?.avatar} alt={task?.createdBy?.name} />
                      <AvatarFallback className="bg-indigo-500 text-white text-xs">
                        {task?.createdBy?.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {task?.createdBy?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task?.createdBy?.role || 'Unknown Role'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <Flag className="h-3 w-3" />
                    Priority
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${priorityConfig.bgColor}`}>
                    <span className="text-sm">{priorityConfig.icon}</span>
                    <span className={`text-sm font-semibold capitalize ${priorityConfig.textColor}`}>
                      {task?.priority || 'medium'}
                    </span>
                  </div>
                </div>

                {/* Assignee info */}
                {task?.assignee && (
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <User className="h-3 w-3" />
                      Assigned to
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-gray-800 shadow-md">
                        <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                        <AvatarFallback className="bg-green-500 text-white text-xs">
                          {task.assignee?.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {task.assignee?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.assignee?.role || 'Unknown Role'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Due date */}
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-3 w-3" />
                    Due Date
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(task?.dueDate) || 'No due date'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

      </Card>
    </div>
  );
}