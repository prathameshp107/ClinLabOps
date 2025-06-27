import React from "react";

// Import all necessary UI components and icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import UserAvatar from "./user-avatar";
import { Check, ChevronDown, X, Calendar as CalendarIcon } from "lucide-react";
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
    return (
        <div className="w-full bg-muted/40 rounded-lg p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-0 gap-x-8">
                {/* Description - full width */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-4 pb-2 border-b border-muted-foreground/10 mb-2">
                    <div className="flex items-center justify-between mb-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 cursor-help">Description</h3>
                            </TooltipTrigger>
                            <TooltipContent>Add a detailed description of the task</TooltipContent>
                        </Tooltip>
                        {!isEditingDescription && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-muted-foreground hover:bg-accent/30 focus:ring-2 focus:ring-primary/30"
                                onClick={() => setIsEditingDescription(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                    {isEditingDescription ? (
                        <div className="space-y-2">
                            <Textarea
                                ref={descriptionInputRef}
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="min-h-[120px]"
                                placeholder="Add a detailed description..."
                                autoFocus
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
                            className="prose prose-sm dark:prose-invert max-w-none p-3 rounded-md border bg-muted/20 min-h-[120px] cursor-text"
                            onClick={() => setIsEditingDescription(true)}
                        >
                            {editedDescription ? (
                                <div className="whitespace-pre-wrap">{editedDescription}</div>
                            ) : (
                                <p className="text-muted-foreground italic">Add a description...</p>
                            )}
                        </div>
                    )}
                </div>
                {/* Status */}
                <div className="flex flex-col gap-2 p-2 border-b md:border-b-0 md:border-r border-muted-foreground/10">
                    <div className="flex items-center gap-2 mb-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 cursor-help">Status</h3>
                            </TooltipTrigger>
                            <TooltipContent>Current progress state of the task</TooltipContent>
                        </Tooltip>
                        {/* Quick status change button */}
                        <Button
                            variant="outline"
                            size="xs"
                            className="ml-2 px-2 py-0.5 text-xs h-6 border-primary/40 hover:bg-primary/10"
                            onClick={() => {
                                // Cycle through common statuses: Backlog -> In Progress -> Completed
                                const order = ["backlog", "in_progress", "completed"];
                                const idx = order.indexOf(selectedStatus);
                                const next = order[(idx + 1) % order.length];
                                setSelectedStatus(next);
                                handleSaveChanges();
                            }}
                        >
                            Quick Next
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            currentStatus.bgColor,
                            currentStatus.textColor,
                            currentStatus.borderColor
                        )}>
                            <currentStatus.icon className="h-5 w-5" />
                            {currentStatus.label}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-56 min-w-[16rem] h-10 flex-nowrap flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-base font-medium min-w-0 shadow-sm hover:border-primary focus:ring-2 focus:ring-primary/30">
                                    <currentStatus.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className="flex-1 truncate whitespace-nowrap min-w-0 max-w-[12rem]">{currentStatus.label}</span>
                                    <ChevronDown className="h-5 w-5 ml-2 flex-shrink-0" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 min-w-[16rem] p-1 rounded-lg shadow-xl bg-background border">
                                {statusOptions.map((status) => (
                                    <DropdownMenuItem
                                        key={status.value}
                                        onSelect={() => {
                                            setSelectedStatus(status.value);
                                            handleSaveChanges();
                                        }}
                                        className="flex-nowrap flex items-center min-w-0 gap-2 px-4 py-2 rounded-lg hover:bg-accent/60 cursor-pointer text-base font-medium"
                                    >
                                        <status.icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="flex-1 truncate whitespace-nowrap min-w-0 max-w-[12rem]">{status.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* Priority */}
                <div className="flex flex-col gap-2 p-2 border-b md:border-b-0 md:border-r border-muted-foreground/10">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 cursor-help">Priority</h3>
                        </TooltipTrigger>
                        <TooltipContent>How urgent or important this task is</TooltipContent>
                    </Tooltip>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            currentPriority.bgColor,
                            currentPriority.textColor,
                            currentPriority.borderColor
                        )}>
                            <currentPriority.icon className="h-5 w-5" />
                            {currentPriority.label}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-56 min-w-[16rem] h-10 flex-nowrap flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-base font-medium min-w-0 shadow-sm hover:border-primary focus:ring-2 focus:ring-primary/30">
                                    <currentPriority.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className="flex-1 truncate whitespace-nowrap min-w-0 max-w-[12rem]">{currentPriority.label}</span>
                                    <ChevronDown className="h-5 w-5 ml-2 flex-shrink-0" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 min-w-[16rem] p-1 rounded-lg shadow-xl bg-background border">
                                {priorityOptions.map((priority) => (
                                    <DropdownMenuItem
                                        key={priority.value}
                                        onSelect={() => {
                                            setSelectedPriority(priority.value);
                                            handleSaveChanges();
                                        }}
                                        className="flex-nowrap flex items-center min-w-0 gap-2 px-4 py-2 rounded-lg hover:bg-accent/60 cursor-pointer text-base font-medium"
                                    >
                                        <priority.icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="flex-1 truncate whitespace-nowrap min-w-0 max-w-[12rem]">{priority.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* Assigned To */}
                <div className="flex flex-col gap-2 p-2 border-b md:border-b-0 border-muted-foreground/10">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 cursor-help">Assigned To</h3>
                        </TooltipTrigger>
                        <TooltipContent>Who is responsible for this task</TooltipContent>
                    </Tooltip>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-56 min-w-[16rem] h-10 flex-nowrap flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-base font-medium min-w-0 shadow-sm hover:border-primary focus:ring-2 focus:ring-primary/30">
                                {selectedAssignees[0] ? (
                                    <>
                                        <UserAvatar
                                            user={selectedAssignees[0]}
                                            variant="minimal"
                                            size="sm"
                                        />
                                        <span className="flex-1 truncate whitespace-nowrap min-w-0 max-w-[12rem]">{selectedAssignees[0].name}</span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">Unassigned</span>
                                )}
                                <ChevronDown className="h-5 w-5 ml-2 flex-shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 min-w-[16rem] p-1 rounded-lg shadow-xl bg-background border max-h-60 overflow-y-auto">
                            {users.map((user) => (
                                <DropdownMenuItem
                                    key={user.id}
                                    onSelect={() => {
                                        const newAssignees = selectedAssignees.some(u => u.id === user.id) ? selectedAssignees.filter(u => u.id !== user.id) : [...selectedAssignees, user];
                                        setSelectedAssignees(newAssignees);
                                        handleSaveChanges();
                                    }}
                                    className="flex-nowrap flex items-center min-w-0 gap-2 px-4 py-2 rounded-lg hover:bg-accent/60 cursor-pointer text-base font-medium"
                                >
                                    <UserAvatar
                                        user={user}
                                        variant="minimal"
                                        size="sm"
                                    />
                                    <span className="flex-1 truncate whitespace-nowrap min-w-0 max-w-[12rem]">{user.name}</span>
                                    {selectedAssignees.some(u => u.id === user.id) && (
                                        <Check className="ml-auto h-5 w-5 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {/* Tags */}
                <div className="flex flex-col gap-2 p-2 border-b md:border-b-0 border-muted-foreground/10">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 cursor-help">Tags</h3>
                        </TooltipTrigger>
                        <TooltipContent>Labels to categorize and filter tasks</TooltipContent>
                    </Tooltip>
                    {/* Tag badges always visible */}
                    <div className="flex flex-wrap gap-2">
                        {tags.length > 0 ? (
                            tags.map((tag, idx) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground border border-muted-foreground/20">
                                    {tag}
                                    <button
                                        type="button"
                                        className="ml-1 text-muted-foreground hover:text-destructive focus:outline-none"
                                        aria-label={`Remove tag ${tag}`}
                                        onClick={() => {
                                            const newTags = [...tags];
                                            newTags.splice(idx, 1);
                                            setTags(newTags);
                                            handleSaveChanges();
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground italic">No tags added</span>
                        )}
                    </div>
                    {/* Add tag popover with suggestions */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-56 min-w-[16rem] flex-nowrap flex justify-between items-center px-4 text-base font-medium min-w-0 rounded-lg shadow-sm"
                            >
                                <span>Add tag...</span>
                                <ChevronDown className="h-5 w-5 ml-2 flex-shrink-0" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2 rounded-lg shadow-xl bg-background border">
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    placeholder="Add a tag..."
                                    className="w-full h-8 text-base"
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
                                    className="px-3"
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
                            {/* Tag suggestions */}
                            {newTag.trim() && (
                                <div className="mb-2">
                                    <div className="text-xs text-muted-foreground mb-1">Suggestions</div>
                                    <div className="flex flex-wrap gap-2">
                                        {commonTags.filter(tag => tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)).slice(0, 5).map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className="px-2 py-1 rounded-full bg-accent text-xs hover:bg-primary/10 border border-muted-foreground/10"
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
                                            <span className="text-muted-foreground text-xs italic">No suggestions</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                </div>
                {/* Due Date */}
                <div className="flex flex-col gap-2 p-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 cursor-help">Due Date</h3>
                        </TooltipTrigger>
                        <TooltipContent>When this task should be completed</TooltipContent>
                    </Tooltip>
                    <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-56 min-w-[16rem] h-10 flex items-center gap-2 px-4 text-base font-medium rounded-lg border bg-background shadow-sm ${!date ? 'text-muted-foreground' : ''} ${date && isPast(new Date(date)) && !isToday(new Date(date)) ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : ''}`}
                            >
                                <CalendarIcon className="mr-2 h-5 w-5" />
                                {date ? (
                                    <span>{format(date, 'PPP')}</span>
                                ) : (
                                    <span>Pick a due date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                    setDate(selectedDate || null);
                                    setOpenDatePicker(false);
                                    handleSaveChanges();
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {/* Due date quick set buttons */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            size="xs"
                            variant="outline"
                            className="px-2 py-0.5 text-xs h-6 border-primary/40 hover:bg-primary/10"
                            onClick={() => {
                                setDate(new Date());
                                handleSaveChanges();
                            }}
                        >
                            Today
                        </Button>
                        <Button
                            size="xs"
                            variant="outline"
                            className="px-2 py-0.5 text-xs h-6 border-primary/40 hover:bg-primary/10"
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
                            size="xs"
                            variant="outline"
                            className="px-2 py-0.5 text-xs h-6 border-primary/40 hover:bg-primary/10"
                            onClick={() => {
                                const nextWeek = new Date();
                                nextWeek.setDate(nextWeek.getDate() + 7);
                                setDate(nextWeek);
                                handleSaveChanges();
                            }}
                        >
                            Next Week
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 