"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FlaskConical,
    FileText,
    Layers,
    FolderPlus,
    FilterIcon,
    PlusCircle,
    ClipboardEdit,
    ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCardView } from "./project-card-view"
import { ProjectTable } from "./project-table"
import { getSettings } from "@/services/settingsService"

// Icon mapping
const ICON_COMPONENTS = {
    FlaskConical,
    FileText,
    Layers,
    FolderPlus,
    ClipboardEdit
}

// Function to determine project category
export const getProjectCategory = (project, categories) => {
    // If project already has a category assigned, use it
    if (project.category) {
        return project.category;
    }

    const projectText = `${project.name} ${project.description} ${project.tags?.join(' ') || ''}`.toLowerCase();

    // Check each category for matching keywords
    for (const category of categories) {
        if (category.keywords.some(keyword => projectText.includes(keyword.toLowerCase()))) {
            return category.id;
        }
    }

    // Default to first category if no match
    return categories[0]?.id || "miscellaneous";
};

// Function to categorize projects
export const categorizeProjects = (projects, categories) => {
    const categorized = {};

    // Initialize with empty arrays
    categories.forEach(category => {
        categorized[category.id] = [];
    });

    projects.forEach(project => {
        const category = getProjectCategory(project, categories);
        if (categorized[category]) {
            categorized[category].push(project);
        }
    });

    return categorized;
};

export function CategorizedProjects({
    projects,
    viewMode,
    handleProjectAction,
    sortConfig,
    requestSort,
    searchQuery,
    onClearFilters,
    projectCategories
}) {
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        // Initialize expanded categories state
        const initialExpanded = {};
        projectCategories.forEach(category => {
            initialExpanded[category.id] = true;
        });
        setExpandedCategories(initialExpanded);
    }, [projectCategories]);

    const categorizedProjects = categorizeProjects(projects, projectCategories);

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Check if all categories are empty
    const allCategoriesEmpty = Object.values(categorizedProjects).every(category => category.length === 0);

    // Show empty state when all categories are empty, regardless of search query
    if (allCategoriesEmpty) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center p-16 border border-dashed border-border/50 rounded-3xl bg-muted/5 backdrop-blur-sm"
            >
                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
                    <FolderPlus className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No projects found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-8 text-lg">
                    {searchQuery
                        ? "No projects match your current filters. Try adjusting your search criteria."
                        : "Get started by creating your first project. Projects help you organize and track your research work."
                    }
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        className="gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                        onClick={() => {
                            // In a real app, this would open the add project dialog
                            document.dispatchEvent(new CustomEvent('openAddProjectDialog'));
                        }}
                    >
                        <PlusCircle className="h-5 w-5" />
                        Create Project
                    </Button>
                    {searchQuery && (
                        <Button
                            variant="outline"
                            className="gap-2 h-11 px-6 rounded-xl border-border/50 hover:bg-muted/50"
                            onClick={onClearFilters}
                        >
                            <FilterIcon className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            {Object.entries(categorizedProjects).map(([categoryKey, categoryProjects]) => {
                if (categoryProjects.length === 0) return null;

                const category = projectCategories.find(cat => cat.id === categoryKey);
                if (!category) return null;

                const IconComponent = ICON_COMPONENTS[category.icon] || FlaskConical;
                const isExpanded = expandedCategories[categoryKey];

                return (
                    <motion.div
                        key={categoryKey}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div
                            className="flex items-center gap-4 cursor-pointer group select-none"
                            onClick={() => toggleCategory(categoryKey)}
                        >
                            <div className={`
                                p-2.5 rounded-xl ${category.bgColor} 
                                group-hover:scale-110 transition-transform duration-300
                                ring-1 ring-inset ring-black/5 dark:ring-white/10
                            `}>
                                <IconComponent className={`h-5 w-5 ${category.color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                        {categoryProjects.length}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mt-0.5">{category.description}</p>
                            </div>
                            <div className={`
                                h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center
                                transform transition-all duration-300 group-hover:bg-muted
                                ${isExpanded ? 'rotate-180' : ''}
                            `}>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-2 pb-4">
                                        {viewMode === "grid" ? (
                                            <ProjectCardView
                                                projects={categoryProjects}
                                                onAction={handleProjectAction}
                                            />
                                        ) : (
                                            <ProjectTable
                                                projects={categoryProjects}
                                                onAction={handleProjectAction}
                                                sortConfig={sortConfig}
                                                requestSort={requestSort}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}