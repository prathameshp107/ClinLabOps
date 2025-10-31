"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    FlaskConical,
    FileText,
    Layers,
    FolderPlus,
    FilterIcon,
    PlusCircle,
    ClipboardEdit
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
    onClearFilters
}) {
    const [expandedCategories, setExpandedCategories] = useState({
        research: true,
        regulatory: true,
        miscellaneous: true
    });

    const [projectCategories, setProjectCategories] = useState([
        {
            id: "research",
            name: "Research",
            description: "Exploratory or proof-of-concept studies to generate new scientific knowledge.",
            icon: "FlaskConical",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            keywords: ["research", "exploratory", "proof-of-concept", "scientific", "study", "experiment", "innovation", "discovery", "laboratory", "genomics", "drug-discovery", "ai", "machine-learning"]
        },
        {
            id: "regulatory",
            name: "Regulatory",
            description: "Guideline-driven studies (ISO, OECD, FDA, etc.) for authority submissions.",
            icon: "FileText",
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
            keywords: ["regulatory", "iso", "oecd", "fda", "guideline", "compliance", "authority", "submission", "validation", "testing", "environmental", "monitoring", "biomedical", "device-testing", "safety"]
        },
        {
            id: "miscellaneous",
            name: "Miscellaneous",
            description: "Pilot, academic, or client-specific studies for non-regulatory purposes.",
            icon: "Layers",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
            keywords: ["pilot", "academic", "client", "miscellaneous", "other", "general", "management", "platform", "system"]
        }
    ]);

    useEffect(() => {
        // Load custom project categories from settings
        const loadProjectSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings.project?.categories && settings.project.categories.length > 0) {
                    setProjectCategories(settings.project.categories);

                    // Initialize expanded categories state
                    const initialExpanded = {};
                    settings.project.categories.forEach(category => {
                        initialExpanded[category.id] = true;
                    });
                    setExpandedCategories(initialExpanded);
                }
            } catch (error) {
                console.error('Error loading project settings:', error);
            }
        };

        loadProjectSettings();
    }, []);

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
            <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border/50 rounded-2xl bg-muted/10">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                    <FolderPlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    {searchQuery
                        ? "No projects match your current filters. Try adjusting your search criteria or create a new project to get started."
                        : "Get started by creating your first project. Projects help you organize and track your research work."
                    }
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        className="gap-2"
                        onClick={() => {
                            // In a real app, this would open the add project dialog
                            document.dispatchEvent(new CustomEvent('openAddProjectDialog'));
                        }}
                    >
                        <PlusCircle className="h-4 w-4" />
                        Create Project
                    </Button>
                    {searchQuery && (
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={onClearFilters}
                        >
                            <FilterIcon className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {Object.entries(categorizedProjects).map(([categoryKey, categoryProjects]) => {
                if (categoryProjects.length === 0) return null;

                const category = projectCategories.find(cat => cat.id === categoryKey);
                if (!category) return null;

                const IconComponent = ICON_COMPONENTS[category.icon] || FlaskConical;
                const isExpanded = expandedCategories[categoryKey];

                return (
                    <div key={categoryKey} className="space-y-4">
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => toggleCategory(categoryKey)}
                        >
                            <div className={`p-2 rounded-lg ${category.bgColor} group-hover:opacity-80 transition-opacity`}>
                                <IconComponent className={`h-5 w-5 ${category.color}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{category.name}</h3>
                                <p className="text-muted-foreground text-sm">{category.description}</p>
                            </div>
                            <div className="ml-auto text-sm text-muted-foreground flex items-center gap-2">
                                <span>{categoryProjects.length} project{categoryProjects.length !== 1 ? 's' : ''}</span>
                                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
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
                            </motion.div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}