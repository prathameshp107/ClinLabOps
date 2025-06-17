"use client";

import { format } from "date-fns";
import { Calendar, Users, SquareCheck, Edit, PlusCircle, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function TaskTimeline({ subtasks }) {
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [assigneeFilter, setAssigneeFilter] = useState('all');

    const filteredSubtasks = subtasks.filter(subtask => {
        const matchesStatus = statusFilter === 'all' || subtask.status === statusFilter;
        const matchesAssignee = assigneeFilter === 'all' || subtask.assignee.name === assigneeFilter;
        return matchesStatus && matchesAssignee;
    });

    const uniqueAssignees = [...new Set(subtasks.map(s => s.assignee.name))];

    return (
        <Card className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-md">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Task Timeline</CardTitle>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 shadow-md hover:shadow-lg transition-shadow hidden md:flex">
                        <PlusCircle className="h-4 w-4" />
                        Add Subtask
                    </Button>
                </div>
            </CardHeader>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 border-b border-border/50 bg-muted/20 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="status-filter" className="text-sm font-medium">Status</Label>
                                <select
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-input bg-background py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="not_started">Not Started</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="assignee-filter" className="text-sm font-medium">Assignee</Label>
                                <select
                                    id="assignee-filter"
                                    value={assigneeFilter}
                                    onChange={(e) => setAssigneeFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-input bg-background py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="all">All Assignees</option>
                                    {uniqueAssignees.map(assignee => (
                                        <option key={assignee} value={assignee}>{assignee}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CardContent className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/20" />
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredSubtasks.length > 0 ? (
                                filteredSubtasks.map((subtask, index) => (
                                    <motion.div
                                        key={subtask.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: index * 0.05, duration: 0.2, layout: { duration: 0.2 } }}
                                        className="ml-10 relative group bg-background/30 p-4 rounded-lg border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-200 flex items-start gap-4"
                                    >
                                        <div className={cn(
                                            "absolute -left-10 top-4 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 shadow-md",
                                            subtask.status === 'completed'
                                                ? 'bg-green-500/20 border-green-500 text-green-600'
                                                : subtask.status === 'in_progress'
                                                    ? 'bg-amber-500/20 border-amber-500 text-amber-600'
                                                    : 'bg-gray-500/20 border-gray-500 text-gray-600'
                                        )}>
                                            {subtask.status === 'completed' ? <SquareCheck className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`subtask-${subtask.id}`}
                                                        checked={subtask.status === 'completed'}
                                                        onCheckedChange={(checked) => console.log(`Subtask ${subtask.id} checked: ${checked}`)} // Placeholder for actual update logic
                                                        className="data-[state=checked]:bg-primary"
                                                    />
                                                    <Label htmlFor={`subtask-${subtask.id}`} className={cn("text-base font-semibold text-foreground", subtask.status === 'completed' && "line-through text-muted-foreground")}>
                                                        {subtask.title}
                                                    </Label>
                                                </div>
                                                <Badge variant={
                                                    subtask.status === 'completed' ? 'success' :
                                                        subtask.status === 'in_progress' ? 'warning' : 'outline'
                                                } className="text-xs capitalize flex-shrink-0">
                                                    {subtask.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <div className={cn("flex items-center gap-1", new Date(subtask.endDate) < new Date() && subtask.status !== 'completed' && "text-destructive font-medium")}>
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {format(new Date(subtask.startDate), 'MMM d')} - {format(new Date(subtask.endDate), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{subtask.assignee.name}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Progress value={subtask.progress} className="h-2 w-full sm:w-48" indicatorColor={subtask.status === 'completed' ? "bg-green-500" : "bg-blue-500"} />
                                                <span className="text-sm font-medium">{subtask.progress}%</span>
                                            </div>
                                            {subtask.notes && (
                                                <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-dashed border-border">
                                                    <span className="font-medium text-foreground">Notes:</span> {subtask.notes}
                                                </div>
                                            )}
                                            <Button variant="ghost" size="sm" className="h-7 px-3 group-hover:opacity-100 opacity-0 transition-opacity duration-200 mt-2">
                                                <Edit className="h-4 w-4 mr-1" /> Edit Subtask
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                    <Calendar className="h-12 w-12 mb-4" />
                                    <p className="text-lg font-medium">No timeline activities found</p>
                                    <p className="text-sm">Try adjusting your filters or add new subtasks.</p>
                                    <Button variant="outline" className="mt-4">
                                        <PlusCircle className="h-4 w-4 mr-2" /> Add First Subtask
                                    </Button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 