'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Home, MapPin, Users, Activity, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cageService } from '@/services/cageService';
import { getStorageLocations } from '@/services/inventoryService'; // Import inventory service

const CAGE_TYPES = [
    { value: 'standard', label: 'Standard Cage' },
    { value: 'breeding', label: 'Breeding Cage' },
    { value: 'quarantine', label: 'Quarantine Cage' },
    { value: 'isolation', label: 'Isolation Cage' },
    { value: 'custom', label: 'Custom Cage' }
];

const CAGE_STATUS = [
    { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
    { value: 'occupied', label: 'Occupied', color: 'bg-blue-100 text-blue-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'quarantine', label: 'Quarantine', color: 'bg-red-100 text-red-800' }
];

export function CageManagement() {
    const [cages, setCages] = useState([]);
    const [filteredCages, setFilteredCages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: '__all__',
        status: '__all__',
        capacity: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCage, setEditingCage] = useState(null);
    const [cageForm, setCageForm] = useState({
        name: '',
        type: 'standard',
        location: '',
        capacity: 1,
        currentOccupancy: 0,
        status: 'available',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [storageLocations, setStorageLocations] = useState([]); // State for storage locations

    // Load cages from API
    useEffect(() => {
        loadCages();
        loadStorageLocations(); // Load storage locations
    }, []);

    const loadCages = async () => {
        try {
            setLoading(true);
            setError(null);
            const cagesData = await cageService.getAllCages();
            setCages(cagesData);
            setFilteredCages(cagesData);
        } catch (error) {
            console.error('Error loading cages:', error);
            setError('Failed to load cages. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Load storage locations from inventory
    const loadStorageLocations = async () => {
        try {
            const locations = await getStorageLocations();
            setStorageLocations(locations);
        } catch (error) {
            console.error('Error loading storage locations:', error);
            // Set default locations if API fails
            setStorageLocations([
                "Main Laboratory",
                "Storage Room A",
                "Storage Room B",
                "Cold Storage",
                "Hazardous Materials Cabinet",
                "Equipment Room",
                "Clean Room",
                "Warehouse"
            ]);
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = cages;

        if (searchTerm) {
            filtered = filtered.filter(cage =>
                cage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cage.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.type && filters.type !== '__all__') {
            filtered = filtered.filter(cage => cage.type === filters.type);
        }

        if (filters.status && filters.status !== '__all__') {
            filtered = filtered.filter(cage => cage.status === filters.status);
        }

        setFilteredCages(filtered);
    }, [cages, searchTerm, filters]);

    const handleAddCage = () => {
        setEditingCage(null);
        setCageForm({
            name: '',
            type: 'standard',
            location: '',
            capacity: 1,
            currentOccupancy: 0,
            status: 'available',
            notes: ''
        });
        setIsDialogOpen(true);
    };

    const handleEditCage = (cage) => {
        setEditingCage(cage);
        setCageForm({
            name: cage.name,
            type: cage.type,
            location: cage.location,
            capacity: cage.capacity,
            currentOccupancy: cage.currentOccupancy,
            status: cage.status,
            notes: cage.notes || ''
        });
        setIsDialogOpen(true);
    };

    const handleDeleteCage = async (cageId) => {
        try {
            await cageService.deleteCage(cageId);
            setCages(cages.filter(cage => cage._id !== cageId)); // Use _id for MongoDB
        } catch (error) {
            console.error('Error deleting cage:', error);
            setError('Failed to delete cage. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCage) {
                // Update existing cage
                const updatedCage = await cageService.updateCage(editingCage._id, cageForm); // Use _id for MongoDB
                setCages(cages.map(cage =>
                    cage._id === editingCage._id ? updatedCage : cage
                ));
            } else {
                // Add new cage
                const newCage = await cageService.createCage(cageForm);
                setCages([...cages, newCage]);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving cage:', error);
            setError('Failed to save cage. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        const statusOption = CAGE_STATUS.find(s => s.value === status);
        return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
    };

    const getTypeLabel = (type) => {
        const typeOption = CAGE_TYPES.find(t => t.value === type);
        return typeOption ? typeOption.label : type;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            type: '__all__',
            status: '__all__',
            capacity: ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-700">{error}</p>
                    <Button
                        onClick={loadCages}
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Loading indicator */}
            {loading && (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Header Actions - Enhanced Design */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Search cages by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-5 rounded-2xl border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 focus:border-purple-500 dark:focus:border-purple-500 shadow-sm transition-all duration-300"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Filters</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
                            <div className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type</Label>
                                    <Select
                                        value={filters.type}
                                        onValueChange={(value) => setFilters({ ...filters, type: value })}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="__all__">All types</SelectItem>
                                            {CAGE_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</Label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="__all__">All statuses</SelectItem>
                                            {CAGE_STATUS.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Button onClick={handleAddCage} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">Add Cage</span>
                </Button>
            </div>

            {/* Active Filters Bar - Enhanced Design */}
            {(searchTerm || (filters.type && filters.type !== '__all__') || (filters.status && filters.status !== '__all__')) && (
                <div className="flex flex-wrap items-center gap-3 p-5 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Active filters:
                    </span>
                    {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Search:</span>
                            <span className="text-xs">"{searchTerm}"</span>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <span className="text-sm">×</span>
                            </button>
                        </Badge>
                    )}
                    {filters.type && filters.type !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Type:</span>
                            <span className="text-xs">{getTypeLabel(filters.type)}</span>
                            <button
                                onClick={() => setFilters({ ...filters, type: '__all__' })}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <span className="text-sm">×</span>
                            </button>
                        </Badge>
                    )}
                    {filters.status && filters.status !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Status:</span>
                            <span className="text-xs">{CAGE_STATUS.find(s => s.value === filters.status)?.label}</span>
                            <button
                                onClick={() => setFilters({ ...filters, status: '__all__' })}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <span className="text-sm">×</span>
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 px-3 text-xs rounded-full transition-all duration-300"
                    >
                        Clear All
                    </Button>
                </div>
            )}

            {/* Statistics Cards - Enhanced Design */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50/80 to-blue-100/40 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Total Cages</p>
                                <p className="text-3xl font-black text-blue-900 dark:text-blue-100">{cages.length}</p>
                                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Home className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/30 dark:border-emerald-800/30 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Available</p>
                                <p className="text-3xl font-black text-emerald-900 dark:text-emerald-100">
                                    {cages.filter(c => c.status === 'available').length}
                                </p>
                                <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/30 dark:border-amber-800/30 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Occupied</p>
                                <p className="text-3xl font-black text-amber-900 dark:text-amber-100">
                                    {cages.filter(c => c.status === 'occupied').length}
                                </p>
                                <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50/80 to-purple-100/40 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/30 dark:border-purple-800/30 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Utilization</p>
                                <p className="text-3xl font-black text-purple-900 dark:text-purple-100">
                                    {cages.length > 0
                                        ? Math.round((cages.filter(c => c.status === 'occupied').length / cages.length) * 100)
                                        : 0}%
                                </p>
                                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Activity className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div> */}

            {/* Cages Grid - Enhanced Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCages.map((cage) => (
                    <Card key={cage._id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"> {/* Use _id for MongoDB */}
                        <CardHeader className="pb-4 bg-gradient-to-r from-gray-50/80 to-gray-100/40 dark:from-gray-800/60 dark:to-gray-700/40 border-b border-gray-200/30 dark:border-gray-600/30">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-3 font-bold text-gray-900 dark:text-gray-100">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                        <Home className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="truncate text-sm">{cage.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">ID: {cage._id.slice(-6)}</span>
                                    </div>
                                </CardTitle>
                                <Badge className={`${getStatusColor(cage.status)} px-3 py-1.5 text-xs font-bold rounded-full border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${cage.status === 'available' ? 'bg-green-500' : cage.status === 'occupied' ? 'bg-blue-500' : cage.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'} shadow-sm`}></div>
                                        {cage.status}
                                    </div>
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/80 to-blue-100/40 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Location</span>
                                        <span className="truncate font-semibold text-blue-900 dark:text-blue-100">{cage.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50/80 to-emerald-100/40 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200/30 dark:border-emerald-800/30">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Capacity</span>
                                        <span className="font-semibold text-emerald-900 dark:text-emerald-100">{cage.currentOccupancy}/{cage.capacity} animals</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/80 to-purple-100/40 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <Activity className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Type</span>
                                        <span className="capitalize font-semibold text-purple-900 dark:text-purple-100">{getTypeLabel(cage.type)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Occupancy Rate</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{Math.round((cage.currentOccupancy / cage.capacity) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-3 shadow-inner">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full shadow-sm transition-all duration-500 ease-out"
                                        style={{ width: `${(cage.currentOccupancy / cage.capacity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-600/30">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditCage(cage)}
                                    className="border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl h-9 w-9 p-0 transition-all duration-300 hover:shadow-md hover:scale-105"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteCage(cage._id)} // Use _id for MongoDB
                                    className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl h-9 w-9 p-0 transition-all duration-300 hover:shadow-md hover:scale-105"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCages.length === 0 && !loading && (
                <Card className="bg-gradient-to-br from-gray-50/80 to-gray-100/40 dark:from-gray-800/60 dark:to-gray-900/40 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg">
                    <CardContent className="p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Home className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No cages found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
                            {searchTerm || filters.type || filters.status
                                ? 'Try adjusting your search criteria or filters to find the cages you\'re looking for'
                                : 'Get started by adding your first cage to begin managing your laboratory space'}
                        </p>
                        {!searchTerm && !filters.type && !filters.status && (
                            <Button onClick={handleAddCage} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Cage
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Cage Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCage ? 'Edit Cage' : 'Add New Cage'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Cage Name *</Label>
                            <Input
                                id="name"
                                value={cageForm.name}
                                onChange={(e) => setCageForm({ ...cageForm, name: e.target.value })}
                                placeholder="e.g., Cage A-101"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Cage Type *</Label>
                            <Select
                                value={cageForm.type}
                                onValueChange={(value) => setCageForm({ ...cageForm, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cage type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAGE_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Select
                                value={cageForm.location}
                                onValueChange={(value) => {
                                    if (value === 'custom') {
                                        setCageForm({ ...cageForm, location: '' });
                                    } else {
                                        setCageForm({ ...cageForm, location: value });
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {storageLocations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                            {location}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="custom">Custom Location</SelectItem>
                                </SelectContent>
                            </Select>
                            {cageForm.location === '' && (
                                <Input
                                    placeholder="Enter custom location"
                                    value={cageForm.customLocation || ''}
                                    onChange={(e) => setCageForm({
                                        ...cageForm,
                                        location: e.target.value,
                                        customLocation: e.target.value
                                    })}
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity *</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min="1"
                                    value={cageForm.capacity}
                                    onChange={(e) => setCageForm({ ...cageForm, capacity: parseInt(e.target.value) || 1 })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentOccupancy">Current Occupancy</Label>
                                <Input
                                    id="currentOccupancy"
                                    type="number"
                                    min="0"
                                    max={cageForm.capacity}
                                    value={cageForm.currentOccupancy}
                                    onChange={(e) => setCageForm({ ...cageForm, currentOccupancy: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                value={cageForm.status}
                                onValueChange={(value) => setCageForm({ ...cageForm, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAGE_STATUS.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={cageForm.notes}
                                onChange={(e) => setCageForm({ ...cageForm, notes: e.target.value })}
                                placeholder="Additional information"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingCage ? 'Update Cage' : 'Add Cage'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}