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

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search cages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <div className="p-2 space-y-3">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={filters.type}
                                        onValueChange={(value) => setFilters({ ...filters, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    <Label>Status</Label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    className="w-full"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Button onClick={handleAddCage} className="flex items-center gap-2 whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    Add Cage
                </Button>
            </div>

            {/* Active Filters Bar */}
            {(searchTerm || (filters.type && filters.type !== '__all__') || (filters.status && filters.status !== '__all__')) && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Active filters:</span>
                    {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Search: "{searchTerm}"
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {filters.type && filters.type !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Type: {getTypeLabel(filters.type)}
                            <button
                                onClick={() => setFilters({ ...filters, type: '__all__' })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {filters.status && filters.status !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Status: {CAGE_STATUS.find(s => s.value === filters.status)?.label}
                            <button
                                onClick={() => setFilters({ ...filters, status: '__all__' })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700 h-6 px-2 text-xs"
                    >
                        Clear All
                    </Button>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cages</p>
                                <p className="text-2xl font-bold">{cages.length}</p>
                            </div>
                            <div className="text-2xl">🏠</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {cages.filter(c => c.status === 'available').length}
                                </p>
                            </div>
                            <div className="text-2xl">✅</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupied</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {cages.filter(c => c.status === 'occupied').length}
                                </p>
                            </div>
                            <div className="text-2xl">👥</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization</p>
                                <p className="text-2xl font-bold">
                                    {cages.length > 0
                                        ? Math.round((cages.filter(c => c.status === 'occupied').length / cages.length) * 100)
                                        : 0}%
                                </p>
                            </div>
                            <div className="text-2xl">📊</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCages.map((cage) => (
                    <Card key={cage._id} className="hover:shadow-lg transition-shadow"> {/* Use _id for MongoDB */}
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Home className="h-5 w-5 text-gray-500" />
                                    <span className="truncate">{cage.name}</span>
                                </CardTitle>
                                <Badge className={getStatusColor(cage.status)}>
                                    {cage.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="truncate">{cage.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span>{cage.currentOccupancy}/{cage.capacity} animals</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-gray-500" />
                                    <span className="capitalize">{getTypeLabel(cage.type)}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(cage.currentOccupancy / cage.capacity) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Occupancy</span>
                                    <span>{Math.round((cage.currentOccupancy / cage.capacity) * 100)}%</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditCage(cage)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteCage(cage._id)} // Use _id for MongoDB
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCages.length === 0 && !loading && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-lg font-medium mb-2">No cages found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {searchTerm || filters.type || filters.status
                                ? 'Try adjusting your search or filters'
                                : 'Get started by adding your first cage'}
                        </p>
                        {!searchTerm && !filters.type && !filters.status && (
                            <Button onClick={handleAddCage}>
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