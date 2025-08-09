import React, { useState } from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Quote, Code, Minus } from 'lucide-react';

// Import all necessary UI components and icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import UserAvatar from "./user-avatar";
import { Check, ChevronDown, X, Calendar as CalendarIcon, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import RichTextEditor from './modern-rich-text-editor';
import { taskOrder } from "@/constants";

const commonTags = [
    "Oncology", "Proteomics", "Clinical", "Microbiology", "Drug Development", "Neuroscience",
    "Data Analysis", "Genetics", "Protocol", "Screening", "Equipment", "Validation",
    "Mass Spec", "Vaccines", "Stability", "mRNA", "Immunology", "Biomarkers"
];

export default function TaskDetailsSection({
    task,
    users,
    statusOptions,
    priorityOptions,
    currentStatus,
    currentPriority,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedAssignees,
    setSelectedAssignees,
    tags,
    setTags,
    newTag,
    setNewTag,
    date,
    setDate,
    openDatePicker,
    setOpenDatePicker,
    handleSaveChanges,
    isPast,
    isToday,
    editedDescription,
    setEditedDescription,
    isEditingDescription,
    setIsEditingDescription,
    descriptionInputRef,
    format,
}) {
    const order = taskOrder;

    return (
        <div className="w-full space-y-6">
            {/* Description Section */}
            <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="text-sm font-semibold text-foreground cursor-help">Description</h3>
                            </TooltipTrigger>
                            <TooltipContent>Add a detailed description of the task</TooltipContent>
                        </Tooltip>
                    </div>
                    {!isEditingDescription && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                            onClick={() => setIsEditingDescription(true)}
                        >
                            Edit
                        </Button>
                    )}
                </div>
                {isEditingDescription ? (
                    <div className="space-y-3">
                        <RichTextEditor
                            value={editedDescription}
                            onChange={setEditedDescription}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setEditedDescription(task.description || '');
                                    setIsEditingDescription(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setIsEditingDescription(false);
                                    handleSaveChanges();
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-lg border border-dashed border-border/50 bg-background/50 min-h-[120px] cursor-text hover:border-primary/50 transition-colors"
                        onClick={() => setIsEditingDescription(true)}
                        dangerouslySetInnerHTML={{ __html: editedDescription || '<p class="text-muted-foreground italic">Click to add a description...</p>' }}
                    />
                )}
            </div>

            {/* Task Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl p-5 border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3 className="text-sm font-semibold text-foreground cursor-help">Status</h3>
                                </TooltipTrigger>
                                <TooltipContent>Current progress state of the task</TooltipContent>
                            </Tooltip>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs border-primary/40 hover:bg-primary/10 hover:border-primary/60 transition-colors"
                            onClick={() => {
                                const idx = order.indexOf(selectedStatus);
                                const next = order[(idx + 1) % order.length];
                                setSelectedStatus(next);
                                handleSaveChanges();
                            }}
                        >
                            Next →
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2",
                            currentStatus.bgColor,
                            currentStatus.textColor,
                            currentStatus.borderColor
                        )}>
                            <currentStatus.icon className="h-4 w-4" />
                            {currentStatus.label}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full h-11 flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-dashed border-border/50 bg-background/50 text-sm font-medium hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/30">
                                    <currentStatus.icon className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-1 text-left">{currentStatus.label}</span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 p-2 rounded-xl shadow-xl bg-background border-2">
                                <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Change Status
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {statusOptions.map((status) => (
                                    <DropdownMenuItem
                                        key={status.value}
                                        onSelect={() => {
                                            setSelectedStatus(status.value);
                                            handleSaveChanges();
                                        }}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 cursor-pointer text-sm font-medium transition-colors"
                                    >
                                        <status.icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="flex-1">{status.label}</span>
                                        {selectedStatus === status.value && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* Priority */}
                <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl p-5 border border-border/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="text-sm font-semibold text-foreground cursor-help">Priority</h3>
                            </TooltipTrigger>
                            <TooltipContent>How urgent or important this task is</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="space-y-3">
                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2",
                            currentPriority.bgColor,
                            currentPriority.textColor,
                            currentPriority.borderColor
                        )}>
                            <currentPriority.icon className="h-4 w-4" />
                            {currentPriority.label}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full h-11 flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-dashed border-border/50 bg-background/50 text-sm font-medium hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/30">
                                    <currentPriority.icon className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-1 text-left">{currentPriority.label}</span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 p-2 rounded-xl shadow-xl bg-background border-2">
                                <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Set Priority
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {priorityOptions.map((priority) => (
                                    <DropdownMenuItem
                                        key={priority.value}
                                        onSelect={() => {
                                            setSelectedPriority(priority.value);
                                            handleSaveChanges();
                                        }}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 cursor-pointer text-sm font-medium transition-colors"
                                    >
                                        <priority.icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="flex-1">{priority.label}</span>
                                        {selectedPriority === priority.value && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* Assigned To */}
                <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl p-5 border border-border/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="text-sm font-semibold text-foreground cursor-help">Assigned To</h3>
                            </TooltipTrigger>
                            <TooltipContent>Who is responsible for this task</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="space-y-3">
                        {selectedAssignees[0] && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-accent/50">
                                <UserAvatar
                                    user={selectedAssignees[0]}
                                    variant="minimal"
                                    size="md"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{selectedAssignees[0].name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedAssignees[0].email}</p>
                                </div>
                            </div>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full h-11 flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-dashed border-border/50 bg-background/50 text-sm font-medium hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/30">
                                    {selectedAssignees[0] ? (
                                        <>
                                            <UserAvatar
                                                user={selectedAssignees[0]}
                                                variant="minimal"
                                                size="sm"
                                            />
                                            <span className="flex-1 text-left">{selectedAssignees[0].name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            <span className="flex-1 text-left text-muted-foreground">Assign to someone</span>
                                        </>
                                    )}
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-72 p-2 rounded-xl shadow-xl bg-background border-2 max-h-60 overflow-y-auto">
                                <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Assign Task
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {users.map((user) => (
                                    <DropdownMenuItem
                                        key={user.id}
                                        onSelect={() => {
                                            const newAssignees = selectedAssignees.some(u => u.id === user.id) ? selectedAssignees.filter(u => u.id !== user.id) : [user];
                                            setSelectedAssignees(newAssignees);
                                            handleSaveChanges();
                                        }}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 cursor-pointer text-sm font-medium transition-colors"
                                    >
                                        <UserAvatar
                                            user={user}
                                            variant="minimal"
                                            size="sm"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        {selectedAssignees.some(u => u.id === user.id) && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* Tags */}
                <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl p-5 border border-border/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="text-sm font-semibold text-foreground cursor-help">Tags</h3>
                            </TooltipTrigger>
                            <TooltipContent>Labels to categorize and filter tasks</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 min-h-[2rem]">
                            {tags.length > 0 ? (
                                tags.map((tag, idx) => (
                                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                                        <Tag className="h-3 w-3" />
                                        {tag}
                                        <button
                                            type="button"
                                            className="ml-1 text-primary/70 hover:text-destructive focus:outline-none transition-colors"
                                            aria-label={`Remove tag ${tag}`}
                                            onClick={() => {
                                                const newTags = [...tags];
                                                newTags.splice(idx, 1);
                                                setTags(newTags);
                                                handleSaveChanges();
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted-foreground italic text-sm">No tags added yet</span>
                            )}
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="w-full h-11 flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-dashed border-border/50 bg-background/50 text-sm font-medium hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/30">
                                    <Tag className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <span className="flex-1 text-left text-muted-foreground">Add tags...</span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 rounded-xl shadow-xl bg-background border-2">
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={e => setNewTag(e.target.value)}
                                            placeholder="Type a tag name..."
                                            className="flex-1 h-9"
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && newTag.trim()) {
                                                    const trimmed = newTag.trim();
                                                    if (trimmed && !tags.includes(trimmed)) {
                                                        setTags([...tags, trimmed]);
                                                        setNewTag('');
                                                        handleSaveChanges();
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            className="px-4"
                                            disabled={!newTag.trim() || tags.includes(newTag.trim())}
                                            onClick={() => {
                                                const trimmed = newTag.trim();
                                                if (trimmed && !tags.includes(trimmed)) {
                                                    setTags([...tags, trimmed]);
                                                    setNewTag('');
                                                    handleSaveChanges();
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    {newTag.trim() && (
                                        <div>
                                            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Suggestions</div>
                                            <div className="flex flex-wrap gap-2">
                                                {commonTags.filter(tag => tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)).slice(0, 6).map(tag => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        className="px-3 py-1.5 rounded-lg bg-accent/50 text-xs font-medium hover:bg-primary/10 hover:text-primary border border-accent/50 hover:border-primary/30 transition-all"
                                                        onClick={() => {
                                                            setTags([...tags, tag]);
                                                            setNewTag('');
                                                            handleSaveChanges();
                                                        }}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                                {commonTags.filter(tag => tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)).length === 0 && (
                                                    <span className="text-muted-foreground text-xs italic">No matching suggestions</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {/* Due Date */}
                <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl p-5 border border-border/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="text-sm font-semibold text-foreground cursor-help">Due Date</h3>
                            </TooltipTrigger>
                            <TooltipContent>When this task should be completed</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="space-y-3">
                        {date && (
                            <div className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2",
                                date && isPast(new Date(date)) && !isToday(new Date(date))
                                    ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
                                    : isToday(new Date(date))
                                        ? "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
                                        : "bg-accent/30 border-accent/50"
                            )}>
                                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{format(date, 'PPP')}</p>
                                    <p className="text-xs opacity-70">
                                        {isPast(new Date(date)) && !isToday(new Date(date))
                                            ? "Overdue"
                                            : isToday(new Date(date))
                                                ? "Due today"
                                                : `Due in ${Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))} days`
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                            <PopoverTrigger asChild>
                                <button className="w-full h-11 flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-dashed border-border/50 bg-background/50 text-sm font-medium hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/30">
                                    <CalendarIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <span className="flex-1 text-left">
                                        {date ? format(date, 'PPP') : 'Set due date'}
                                    </span>
                                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-2" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate || null);
                                        setOpenDatePicker(false);
                                        handleSaveChanges();
                                    }}
                                    initialFocus
                                    className="rounded-xl"
                                />
                            </PopoverContent>
                        </Popover>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs border-primary/40 hover:bg-primary/10 hover:border-primary/60 transition-colors"
                                onClick={() => {
                                    setDate(new Date());
                                    handleSaveChanges();
                                }}
                            >
                                Today
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs border-primary/40 hover:bg-primary/10 hover:border-primary/60 transition-colors"
                                onClick={() => {
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    setDate(tomorrow);
                                    handleSaveChanges();
                                }}
                            >
                                Tomorrow
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs border-primary/40 hover:bg-primary/10 hover:border-primary/60 transition-colors"
                                onClick={() => {
                                    const nextWeek = new Date();
                                    nextWeek.setDate(nextWeek.getDate() + 7);
                                    setDate(nextWeek);
                                    handleSaveChanges();
                                }}
                            >
                                Next Week
                            </Button>
                            {date && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-colors"
                                    onClick={() => {
                                        setDate(null);
                                        handleSaveChanges();
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 