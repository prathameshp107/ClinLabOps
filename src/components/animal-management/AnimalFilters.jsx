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
        <div className="flex flex-wrap items-center gap-3">
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Filter className="h-4 w-4" />
                        Filters:
                    </span>
                    {normalizedFilters.species && normalizedFilters.species !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Species:</span>
                            <span className="text-xs">{SPECIES_OPTIONS.find(s => s.value === normalizedFilters.species)?.label}</span>
                            <button
                                onClick={() => clearFilter('species')}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.status && normalizedFilters.status !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Status:</span>
                            <span className="text-xs">{STATUS_OPTIONS.find(s => s.value === normalizedFilters.status)?.label}</span>
                            <button
                                onClick={() => clearFilter('status')}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.ageRange && normalizedFilters.ageRange !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Age:</span>
                            <span className="text-xs">{AGE_RANGES.find(a => a.value === normalizedFilters.ageRange)?.label}</span>
                            <button
                                onClick={() => clearFilter('ageRange')}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.gender && normalizedFilters.gender !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Gender:</span>
                            <span className="text-xs">{GENDER_OPTIONS.find(g => g.value === normalizedFilters.gender)?.label}</span>
                            <button
                                onClick={() => clearFilter('gender')}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {normalizedFilters.hasExperiments && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Has Experiments</span>
                            <button
                                onClick={() => updateFilter('hasExperiments', false)}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-7 px-3 text-xs flex items-center gap-1.5 rounded-full font-medium transition-colors"
                    >
                        Clear All
                    </Button>
                </div>
            )}

            {/* Filter Popover */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2.5 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50 whitespace-nowrap rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Advanced Filters</span>
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-1 px-2.5 py-0.5 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-800 dark:text-blue-300 rounded-full font-semibold">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 backdrop-blur-sm" align="end">
                    <div className="space-y-6 py-2">
                        <div className="flex items-center justify-between pb-2">
                            <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100">Filter Animals</h4>
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full font-medium"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>

                        <Separator className="bg-gray-200 dark:bg-gray-700" />

                        {/* Species Filter */}
                        <div className="space-y-2.5">
                            <Label className="font-semibold text-gray-800 dark:text-gray-200">Species</Label>
                            <Select
                                value={normalizedFilters.species}
                                onValueChange={(value) => updateFilter('species', value)}
                            >
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-300">
                                    <SelectValue placeholder="All species" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                    <SelectItem value="__all__" className="rounded-xl py-2">All species</SelectItem>
                                    {SPECIES_OPTIONS.map((species) => (
                                        <SelectItem key={species.value} value={species.value} className="rounded-xl py-2">
                                            <span className="mr-2.5 text-lg">{species.icon}</span>
                                            {species.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2.5">
                            <Label className="font-semibold text-gray-800 dark:text-gray-200">Status</Label>
                            <Select
                                value={normalizedFilters.status}
                                onValueChange={(value) => updateFilter('status', value)}
                            >
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-300">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                    <SelectItem value="__all__" className="rounded-xl py-2">All statuses</SelectItem>
                                    {STATUS_OPTIONS.map((status) => (
                                        <SelectItem key={status.value} value={status.value} className="rounded-xl py-2">
                                            <span className={`inline-block w-3 h-3 rounded-full mr-2.5 ${status.color}`}></span>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Age Range Filter */}
                        <div className="space-y-2.5">
                            <Label className="font-semibold text-gray-800 dark:text-gray-200">Age Range</Label>
                            <Select
                                value={normalizedFilters.ageRange}
                                onValueChange={(value) => updateFilter('ageRange', value)}
                            >
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-300">
                                    <SelectValue placeholder="All ages" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                    <SelectItem value="__all__" className="rounded-xl py-2">All ages</SelectItem>
                                    {AGE_RANGES.map((age) => (
                                        <SelectItem key={age.value} value={age.value} className="rounded-xl py-2">
                                            {age.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Gender Filter */}
                        <div className="space-y-2.5">
                            <Label className="font-semibold text-gray-800 dark:text-gray-200">Gender</Label>
                            <Select
                                value={normalizedFilters.gender}
                                onValueChange={(value) => updateFilter('gender', value)}
                            >
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-300">
                                    <SelectValue placeholder="All genders" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                    <SelectItem value="__all__" className="rounded-xl py-2">All genders</SelectItem>
                                    {GENDER_OPTIONS.map((gender) => (
                                        <SelectItem key={gender.value} value={gender.value} className="rounded-xl py-2">
                                            {gender.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Has Experiments Switch */}
                        <div className="flex items-center justify-between pt-1">
                            <Label className="font-semibold text-gray-800 dark:text-gray-200">Has Experiments</Label>
                            <Switch
                                checked={normalizedFilters.hasExperiments}
                                onCheckedChange={(checked) => updateFilter('hasExperiments', checked)}
                                className="data-[state=checked]:bg-blue-600 h-6 w-11 rounded-full"
                            />
                        </div>

                        <Separator className="bg-gray-200 dark:bg-gray-700" />

                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={() => {
                                    // Close popover by triggering a re-render
                                    document.body.click();
                                }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}