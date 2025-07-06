import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Calendar, Users, Search, Plus, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import UserAvatar from "@/components/tasks/user-avatar";
import { getRelatedTasks } from "@/services/taskService";

const statusColor = (status) => {
    switch (status) {
        case "completed":
            return "bg-emerald-500";
        case "in_progress":
            return "bg-amber-500";
        default:
            return "bg-gray-500";
    }
};

const statusOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

export function RelatedTasksCard({ taskId }) {
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        title: "",
        assignee: "",
        dueDate: null,
        status: "not_started",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!taskId) return;
        setLoading(true);
        getRelatedTasks(taskId)
            .then(setTasks)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [taskId]);

    const filteredTasks = useMemo(() => {
        if (!search) return tasks;
        return tasks.filter((task) => {
            const title = task.title?.toLowerCase() || "";
            const assignee = task.assignee?.name?.toLowerCase() || "";
            return title.includes(search.toLowerCase()) || assignee.includes(search.toLowerCase());
        });
    }, [search, tasks]);

    function handleAddTask() {
        if (!form.title) return;
        setTasks([
            ...tasks,
            {
                id: Math.random().toString(36).slice(2, 8),
                title: form.title,
                assignee: form.assignee ? { name: form.assignee } : undefined,
                dueDate: form.dueDate ? form.dueDate.toISOString() : new Date().toISOString(),
                status: form.status,
            },
        ]);
        setForm({ title: "", assignee: "", dueDate: null, status: "not_started" });
        setShowAdd(false);
    }

    return (
        <Card className="relative overflow-hidden border-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:shadow-3xl transition-all duration-500 flex flex-col p-6 rounded-2xl">
            <CardHeader className="pb-4 border-b border-gray-200/20 dark:border-gray-700/20 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-indigo-500/10 to-transparent gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 shadow-md">
                        <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Related Tasks</CardTitle>
                </div>
                <div className="w-full sm:w-auto flex items-center gap-3">
                    <div className="relative flex-1 sm:w-72">
                        <Input
                            type="text"
                            placeholder="Search tasks or assignees..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="h-10 w-full rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                            aria-label="Search related tasks"
                        />
                        <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => setShowAdd(true)}
                    >
                        <Plus className="h-5 w-5 mr-2" /> Add Task
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="h-[360px] custom-scrollbar">
                    <div className="divide-y divide-gray-200/10 dark:divide-gray-700/10">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((relatedTask, i) => (
                                <motion.div
                                    key={relatedTask.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                    className="group flex flex-col sm:flex-row justify-between items-center gap-4 p-4 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/5 rounded-xl transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500/50"
                                    tabIndex={0}
                                >
                                    <div className="flex items-center gap-4 min-w-0 flex-1 w-full">
                                        <UserAvatar user={relatedTask.assignee} size="lg" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`inline-block h-3 w-3 rounded-full ${statusColor(relatedTask.status)}`} aria-label={relatedTask.status} />
                                                <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1 rounded-full">T{relatedTask.id}</Badge>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="text-lg font-semibold truncate max-w-[140px] sm:max-w-[200px] text-gray-900 dark:text-gray-100 cursor-help">{relatedTask.title}</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">{relatedTask.title}</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <Badge
                                                    variant={
                                                        relatedTask.status === 'completed' ? 'success' :
                                                            relatedTask.status === 'in_progress' ? 'warning' : 'outline'
                                                    }
                                                    className="capitalize px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                                                >
                                                    {relatedTask.status.replace('_', ' ')}
                                                </Badge>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {format(new Date(relatedTask.dueDate), 'MMM d, yyyy')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {relatedTask.assignee?.name || 'Unassigned'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-xl shadow-md transition-all duration-300 scale-95 group-hover:scale-100"
                                        tabIndex={-1}
                                    >
                                        View Details
                                    </Button>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-10 text-center text-gray-600 dark:text-gray-400">
                                <img src="/empty-tasks.svg" alt="No related tasks" className="h-24 w-24 mb-6 opacity-90" />
                                <p className="text-xl font-semibold">No Related Tasks</p>
                                <p className="text-sm mt-2 max-w-xs">Add or link tasks to display dependencies and related work here.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogContent className="max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Add Related Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <Input
                            placeholder="Task title"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full h-11 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500/50"
                            autoFocus
                        />
                        <Input
                            placeholder="Assignee name (optional)"
                            value={form.assignee}
                            onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                            className="w-full h-11 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <div className="flex gap-3">
                            <Select
                                value={form.status}
                                onValueChange={val => setForm(f => ({ ...f, status: val }))}
                            >
                                <SelectTrigger className="w-40 h-11 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    {statusOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value} className="text-gray-900 dark:text-gray-100">{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                value={form.dueDate ? form.dueDate.toISOString().slice(0, 10) : ""}
                                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value ? new Date(e.target.value) : null }))}
                                className="w-40 h-11 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowAdd(false)}
                            className="h-10 rounded-xl border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddTask}
                            className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                            type="button"
                            disabled={!form.title}
                        >
                            Add Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}