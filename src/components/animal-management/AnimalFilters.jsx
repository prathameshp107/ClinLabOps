'use client';

import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const SPECIES_OPTIONS = [
    { value: 'rat', label: 'Rat', icon: '🐀' },
    { value: 'mice', label: 'Mice', icon: '🐭' },
    { value: 'rabbit', label: 'Rabbit', icon: '🐰' },
    { value: 'guinea-pig', label: 'Guinea Pig', icon: '🐹' },
    { value: 'hamster', label: 'Hamster', icon: '🐹' },
    { value: 'custom', label: 'Custom', icon: '🔧' }
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'bg-green-500' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-500' },
    { value: 'quarantine', label: 'Quarantine', color: 'bg-yellow-500' },
    { value: 'deceased', label: 'Deceased', color: 'bg-red-500' }
];

const AGE_RANGES = [
    { value: '0-4', label: '0-4 weeks' },
    { value: '5-12', label: '5-12 weeks' },
    { value: '13-26', label: '13-26 weeks' },
    { value: '27+', label: '27+ weeks' }
];

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
];

export function AnimalFilters({ filters, onFiltersChange }) {
    const activeFiltersCount = Object.values(filters).filter(value => value && value !== '__all__').length;

    const updateFilter = (key, value) => {
        // Convert "__all__" to "__all__" for consistency within the component
        // The parent component will handle normalization if needed
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            species: '__all__',
            status: '__all__',
            ageRange: '__all__',
            gender: '__all__',
            hasExperiments: false
        });
    };

    const clearFilter = (key) => {
        updateFilter(key, '__all__');
    };

    // Ensure all filter values are properly initialized
    const normalizedFilters = {
        species: filters.species || '__all__',
        status: filters.status || '__all__',
        ageRange: filters.ageRange || '__all__',
        gender: filters.gender || '__all__',
        hasExperiments: filters.hasExperiments || false
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        Filters:
                    </span>
                    {normalizedFilters.species && normalizedFilters.species !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                            Species: {SPECIES_OPTIONS.find(s => s.value === normalizedFilters.species)?.label}
                            <button
                                onClick={() => clearFilter('species')}
                                className="ml-1 hover:text-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.status && normalizedFilters.status !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                            Status: {STATUS_OPTIONS.find(s => s.value === normalizedFilters.status)?.label}
                            <button
                                onClick={() => clearFilter('status')}
                                className="ml-1 hover:text-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.ageRange && normalizedFilters.ageRange !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                            Age: {AGE_RANGES.find(a => a.value === normalizedFilters.ageRange)?.label}
                            <button
                                onClick={() => clearFilter('ageRange')}
                                className="ml-1 hover:text-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.gender && normalizedFilters.gender !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                            Gender: {GENDER_OPTIONS.find(g => g.value === normalizedFilters.gender)?.label}
                            <button
                                onClick={() => clearFilter('gender')}
                                className="ml-1 hover:text-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.hasExperiments && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                            Has Experiments
                            <button
                                onClick={() => updateFilter('hasExperiments', false)}
                                className="ml-1 hover:text-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 px-2 text-xs flex items-center gap-1"
                    >
                        Clear All
                    </Button>
                </div>
            )}

            {/* Filter Popover */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">Advanced Filters</span>
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 rounded-xl" align="end">
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">Filter Animals</h4>
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>

                        <Separator className="bg-gray-200 dark:bg-gray-700" />

                        {/* Species Filter */}
                        <div className="space-y-2">
                            <Label className="font-medium">Species</Label>
                            <Select
                                value={normalizedFilters.species}
                                onValueChange={(value) => updateFilter('species', value)}
                            >
                                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="All species" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all__">All species</SelectItem>
                                    {SPECIES_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <span>{option.icon}</span>
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label className="font-medium">Status</Label>
                            <Select
                                value={normalizedFilters.status}
                                onValueChange={(value) => updateFilter('status', value)}
                            >
                                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all__">All statuses</SelectItem>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 ${option.color} rounded-full`}></div>
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Age Range Filter */}
                        <div className="space-y-2">
                            <Label className="font-medium">Age Range</Label>
                            <Select
                                value={normalizedFilters.ageRange}
                                onValueChange={(value) => updateFilter('ageRange', value)}
                            >
                                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="All ages" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all__">All ages</SelectItem>
                                    {AGE_RANGES.map((range) => (
                                        <SelectItem key={range.value} value={range.value}>
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Gender Filter */}
                        <div className="space-y-2">
                            <Label className="font-medium">Gender</Label>
                            <Select
                                value={normalizedFilters.gender}
                                onValueChange={(value) => updateFilter('gender', value)}
                            >
                                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="All genders" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all__">All genders</SelectItem>
                                    {GENDER_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="bg-gray-200 dark:bg-gray-700" />

                        {/* Boolean Filters */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="has-experiments" className="font-medium">Has Experiments</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <span className="text-gray-500 text-xs">ⓘ</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Show animals assigned to experiments</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <Switch
                                    id="has-experiments"
                                    checked={normalizedFilters.hasExperiments}
                                    onCheckedChange={(checked) => updateFilter('hasExperiments', checked)}
                                />
                            </div>
                        </div>

                        <Separator className="bg-gray-200 dark:bg-gray-700" />

                        <div className="flex justify-between">
                            <Button onClick={clearFilters} variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                Reset Filters
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}