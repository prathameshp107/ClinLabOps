'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, List, Grid2X2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ProjectHealthCard from "./ProjectHealthCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data for projects
const mockProjects = [
    {
        id: 'p1',
        name: 'Website Redesign',
        status: 'on track',
        progress: 0.65,
        startDate: '2025-05-15',
        endDate: '2025-07-20',
        budget: 50000,
        spent: 32000,
        tasks: {
            total: 45,
            completed: 28,
            inProgress: 12,
            overdue: 5
        },
        risks: [
            'Potential delay in content delivery from marketing team',
            'Third-party API integration pending approval'
        ]
    },
    {
        id: 'p2',
        name: 'Mobile App Development',
        status: 'at risk',
        progress: 0.35,
        startDate: '2025-06-01',
        endDate: '2025-08-15',
        budget: 75000,
        spent: 40000,
        tasks: {
            total: 68,
            completed: 22,
            inProgress: 25,
            overdue: 8
        },
        risks: [
            'Backend API performance issues',
            'App store review process may cause delays',
            'User authentication flow needs optimization'
        ]
    },
    {
        id: 'p3',
        name: 'Data Migration',
        status: 'delayed',
        progress: 0.2,
        startDate: '2025-05-01',
        endDate: '2025-06-30',
        budget: 30000,
        spent: 28000,
        tasks: {
            total: 30,
            completed: 6,
            inProgress: 8,
            overdue: 4
        },
        risks: [
            'Data validation taking longer than expected',
            'Legacy system compatibility issues',
            'Need additional resources for testing'
        ]
    },
    {
        id: 'p4',
        name: 'Marketing Campaign',
        status: 'on track',
        progress: 0.8,
        startDate: '2025-06-10',
        endDate: '2025-07-30',
        budget: 45000,
        spent: 35000,
        tasks: {
            total: 38,
            completed: 31,
            inProgress: 5,
            overdue: 2
        },
        risks: [
            'Creative assets approval pending'
        ]
    },
    {
        id: 'p5',
        name: 'Server Upgrade',
        status: 'on hold',
        progress: 0.1,
        startDate: '2025-06-20',
        endDate: '2025-07-10',
        budget: 20000,
        spent: 5000,
        tasks: {
            total: 15,
            completed: 2,
            inProgress: 3,
            overdue: 0
        },
        risks: [
            'Waiting for hardware delivery',
            'Need maintenance window approval'
        ]
    },
    {
        id: 'p6',
        name: 'Customer Portal',
        status: 'completed',
        progress: 1,
        startDate: '2025-04-01',
        endDate: '2025-06-15',
        budget: 60000,
        spent: 58000,
        tasks: {
            total: 72,
            completed: 72,
            inProgress: 0,
            overdue: 0
        },
        risks: []
    }
];

const ProjectHealthGrid = () => {
    const [view, setView] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');

    // Filter and sort projects
    const filteredProjects = mockProjects
        .filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.id.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'dueDate') {
                return new Date(a.endDate) - new Date(b.endDate);
            } else if (sortBy === 'status') {
                return a.status.localeCompare(b.status);
            } else if (sortBy === 'progress') {
                return b.progress - a.progress;
            }
            return 0;
        });

    return (
        <div className="space-y-4">
            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="on track">On Track</SelectItem>
                                <SelectItem value="at risk">At Risk</SelectItem>
                                <SelectItem value="delayed">Delayed</SelectItem>
                                <SelectItem value="on hold">On Hold</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dueDate">Due Date</SelectItem>
                                <SelectItem value="name">Project Name</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="progress">Progress</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Button>
                    <div className="hidden sm:flex border rounded-md p-0.5 bg-muted/50">
                        <Button
                            variant={view === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 w-9 p-0"
                            onClick={() => setView('grid')}
                        >
                            <Grid2X2 className="h-4 w-4" />
                            <span className="sr-only">Grid view</span>
                        </Button>
                        <Button
                            variant={view === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 w-9 p-0"
                            onClick={() => setView('list')}
                        >
                            <List className="h-4 w-4" />
                            <span className="sr-only">List view</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
                <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                    }`}>
                    {filteredProjects.map((project) => (
                        <ProjectHealthCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
                    <div className="text-muted-foreground mb-4">
                        <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-center">No projects found matching your criteria.</p>
                    </div>
                    <Button variant="outline" onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setSortBy('dueDate');
                    }}>
                        Clear filters
                    </Button>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card className="border-green-100 bg-green-50">
                    <CardContent className="p-4">
                        <div className="text-sm text-green-700 mb-1">On Track</div>
                        <div className="text-2xl font-bold text-green-800">
                            {mockProjects.filter(p => p.status === 'on track').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-amber-100 bg-amber-50">
                    <CardContent className="p-4">
                        <div className="text-sm text-amber-700 mb-1">At Risk</div>
                        <div className="text-2xl font-bold text-amber-800">
                            {mockProjects.filter(p => p.status === 'at risk').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-red-100 bg-red-50">
                    <CardContent className="p-4">
                        <div className="text-sm text-red-700 mb-1">Delayed</div>
                        <div className="text-2xl font-bold text-red-800">
                            {mockProjects.filter(p => p.status === 'delayed').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-purple-100 bg-purple-50">
                    <CardContent className="p-4">
                        <div className="text-sm text-purple-700 mb-1">Completed</div>
                        <div className="text-2xl font-bold text-purple-800">
                            {mockProjects.filter(p => p.status === 'completed').length}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectHealthGrid;
