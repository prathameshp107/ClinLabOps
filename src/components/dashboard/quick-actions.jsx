"use client";

import { motion } from "framer-motion";
import {
    PlusCircle,
    ClipboardList,
    FlaskConical,
    FileText,
    Users,
    ShoppingCart,
    Calendar,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function QuickActions() {
    const actions = [
        { icon: PlusCircle, label: "New Task", color: "bg-blue-500/10 text-blue-500" },
        { icon: FlaskConical, label: "New Experiment", color: "bg-purple-500/10 text-purple-500" },
        { icon: FileText, label: "New Report", color: "bg-green-500/10 text-green-500" },
        { icon: ClipboardList, label: "View Tasks", color: "bg-orange-500/10 text-orange-500" },
        { icon: Users, label: "Team", color: "bg-pink-500/10 text-pink-500" },
        { icon: ShoppingCart, label: "Inventory", color: "bg-cyan-500/10 text-cyan-500" },
        { icon: Calendar, label: "Calendar", color: "bg-amber-500/10 text-amber-500" },
        { icon: Settings, label: "Settings", color: "bg-slate-500/10 text-slate-500" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl p-4"
        >
            <h2 className="text-sm font-medium mb-3 px-1">Quick Actions</h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2">
                <TooltipProvider>
                    {actions.map((action, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-12 w-12 rounded-xl ${action.color}`}
                                    >
                                        <action.icon className="h-5 w-5" />
                                    </Button>
                                    <span className="text-xs mt-1">{action.label}</span>
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{action.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </motion.div>
    );
}