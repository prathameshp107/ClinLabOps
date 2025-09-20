'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Download,
    Upload,
    Baby,
    Calendar,
    Activity,
    Grid,
    List,
    SlidersHorizontal,
    MoreHorizontal,
    Check,
    X,
    BarChart3,
    Clock,
    Heart,
    MapPin,
    Scale,
    FlaskConical,
    Users,
    FileText,
    AlertCircle,
    TrendingUp,
    Zap,
    FilterX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimalForm } from './AnimalForm';
import { AnimalDetails } from './AnimalDetails';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { AnimalFilters } from './AnimalFilters';
import { BreedingPairForm } from './BreedingPairForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CageManagement } from './CageManagement';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Progress
} from "@/components/ui/progress";
import { animalService } from '@/services/animalService';
import { breedingService } from '@/services/breedingService';

const SPECIES_OPTIONS = [
    { value: 'rat', label: 'Rat', icon: '🐀' },
    { value: 'mice', label: 'Mice', icon: '🐭' },
    { value: 'rabbit', label: 'Rabbit', icon: '🐰' },
    { value: 'guinea-pig', label: 'Guinea Pig', icon: '🐹' },
    { value: 'hamster', label: 'Hamster', icon: '🐹' },
    { value: 'custom', label: 'Custom', icon: '🔧' }
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'quarantine', label: 'Quarantine' },
    { value: 'deceased', label: 'Deceased' }
];

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
];

export function AnimalManagement() {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [animalToDelete, setAnimalToDelete] = useState(null);
    const [filters, setFilters] = useState({
        species: '__all__',
        status: '__all__',
        ageRange: '__all__',
        gender: '__all__',
        hasExperiments: false
    });
    const [breedingPairs, setBreedingPairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBreedingFormOpen, setIsBreedingFormOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showOnlyActive, setShowOnlyActive] = useState(false);
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
    const [bulkAction, setBulkAction] = useState('');
    const [error, setError] = useState(null);

    // Load animals and breeding pairs
    useEffect(() => {
        loadAnimals();
        loadBreedingPairs();
    }, []);

    const loadAnimals = async () => {
        try {
            setLoading(true);
            setError(null);
            const animalsData = await animalService.getAllAnimals();
            setAnimals(animalsData);
            setFilteredAnimals(animalsData);
        } catch (error) {
            console.error('Error loading animals:', error);
            setError('Failed to load animals. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const loadBreedingPairs = async () => {
        try {
            const breedingPairsData = await breedingService.getAllBreedingPairs();
            setBreedingPairs(breedingPairsData);
        } catch (error) {
            console.error('Error loading breeding pairs:', error);
            // Fallback to mock data if API fails
            setBreedingPairs([
                {
                    _id: '60f7b2d1e3c8a40015d2f1a1',
                    maleId: '60f7b2d1e3c8a40015d2f1b1',
                    femaleId: '60f7b2d1e3c8a40015d2f1b2',
                    maleName: 'Specimen-004',
                    femaleName: 'Specimen-002',
                    startDate: '2024-05-15T00:00:00.000Z',
                    expectedDelivery: '2024-07-20T00:00:00.000Z',
                    status: 'active',
                    offspringCount: 8,
                    notes: 'First litter expected'
                },
                {
                    _id: '60f7b2d1e3c8a40015d2f1a2',
                    maleId: '60f7b2d1e3c8a40015d2f1b3',
                    femaleId: '60f7b2d1e3c8a40015d2f1b4',
                    maleName: 'Specimen-006',
                    femaleName: 'Specimen-007',
                    startDate: '2024-06-01T00:00:00.000Z',
                    expectedDelivery: '2024-08-05T00:00:00.000Z',
                    status: 'active',
                    offspringCount: 0,
                    notes: 'Monitoring closely'
                }
            ]);
        }
    };

    // Filter and search logic
    useEffect(() => {
        let filtered = [...animals];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(animal =>
                animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                animal.strain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                animal.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply species filter
        if (filters.species && filters.species !== '__all__') {
            filtered = filtered.filter(animal => animal.species === filters.species);
        }

        // Apply status filter
        if (filters.status && filters.status !== '__all__') {
            filtered = filtered.filter(animal => animal.status === filters.status);
        }

        // Apply gender filter
        if (filters.gender && filters.gender !== '__all__') {
            filtered = filtered.filter(animal => animal.gender === filters.gender);
        }

        // Apply active only filter
        if (showOnlyActive) {
            filtered = filtered.filter(animal => animal.status === 'active');
        }

        // Apply has experiments filter
        if (filters.hasExperiments) {
            filtered = filtered.filter(animal => animal.experiments && animal.experiments.length > 0);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'species':
                    aValue = a.species;
                    bValue = b.species;
                    break;
                case 'age':
                    aValue = a.age;
                    bValue = b.age;
                    break;
                case 'weight':
                    aValue = a.weight;
                    bValue = b.weight;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'location':
                    aValue = a.location;
                    bValue = b.location;
                    break;
                case 'created':
                    aValue = new Date(a.createdAt || a.dateOfBirth);
                    bValue = new Date(b.createdAt || b.dateOfBirth);
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredAnimals(filtered);
    }, [animals, searchTerm, filters, showOnlyActive, sortBy, sortOrder]);

    const handleAddAnimal = () => {
        setSelectedAnimal(null);
        setIsFormOpen(true);
    };

    const handleEditAnimal = (animal) => {
        setSelectedAnimal(animal);
        setIsFormOpen(true);
    };

    const handleViewAnimal = (animal) => {
        setSelectedAnimal(animal);
        setIsDetailsOpen(true);
    };

    const handleDeleteAnimal = (animal) => {
        setAnimalToDelete(animal);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await animalService.deleteAnimal(animalToDelete._id);
            setAnimals(animals.filter(animal => animal._id !== animalToDelete._id));
            setIsDeleteDialogOpen(false);
            setAnimalToDelete(null);
            // Clear selection if the deleted animal was selected
            setSelectedAnimals(selectedAnimals.filter(id => id !== animalToDelete._id));
        } catch (error) {
            console.error('Error deleting animal:', error);
            setError('Failed to delete animal. Please try again.');
        }
    };

    const handleSaveAnimal = async (animalData) => {
        try {
            console.log('Sending animal data to backend:', animalData);

            if (selectedAnimal) {
                // Update existing animal
                const updatedAnimal = await animalService.updateAnimal(selectedAnimal._id, animalData);
                setAnimals(animals.map(animal =>
                    animal._id === selectedAnimal._id ? updatedAnimal : animal
                ));
            } else {
                // Add new animal
                const newAnimal = await animalService.createAnimal(animalData);
                setAnimals([...animals, newAnimal]);
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error saving animal:', error);
            setError('Failed to save animal. Please try again.');
        }
    };

    const handleCreateBreedingPair = () => {
        setIsBreedingFormOpen(true);
    };

    const handleSaveBreedingPair = async (breedingPairData) => {
        try {
            console.log('handleSaveBreedingPair called with data:', breedingPairData);
            // Extract only the required fields for the backend
            const { maleId, femaleId, startDate, expectedDelivery, notes } = breedingPairData;
            const breedingPairPayload = {
                maleId,
                femaleId,
                startDate,
                expectedDelivery,
                ...(notes && { notes }) // Only include notes if it exists and is not empty
            };
            console.log('Sending payload to breeding service:', breedingPairPayload);

            const savedBreedingPair = await breedingService.createBreedingPair(breedingPairPayload);
            console.log('Received response from breeding service:', savedBreedingPair);
            setBreedingPairs([...breedingPairs, savedBreedingPair]);
            setIsBreedingFormOpen(false);
        } catch (error) {
            console.error('Error saving breeding pair:', error);
            setError('Failed to save breeding pair. Please try again.');
            // Still close the form even if there's an error to provide feedback
            setIsBreedingFormOpen(false);
        }
    };

    const getSpeciesIcon = (species) => {
        const speciesOption = SPECIES_OPTIONS.find(option => option.value === species);
        return speciesOption ? speciesOption.icon : '🔧';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'quarantine': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'deceased': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilters({
            species: '__all__',
            status: '__all__',
            ageRange: '__all__',
            gender: '__all__',
            hasExperiments: false
        });
        setShowOnlyActive(false);
    };

    // Bulk selection handlers
    const toggleSelectAll = () => {
        if (selectedAnimals.length === filteredAnimals.length) {
            setSelectedAnimals([]);
        } else {
            setSelectedAnimals(filteredAnimals.map(animal => animal._id));
        }
    };

    const toggleSelectAnimal = (id) => {
        if (selectedAnimals.includes(id)) {
            setSelectedAnimals(selectedAnimals.filter(animalId => animalId !== id));
        } else {
            setSelectedAnimals([...selectedAnimals, id]);
        }
    };

    // Bulk actions
    const handleBulkAction = (action) => {
        setBulkAction(action);
        setIsBulkActionDialogOpen(true);
    };

    const confirmBulkAction = async () => {
        try {
            switch (bulkAction) {
                case 'delete':
                    // Delete selected animals
                    await Promise.all(selectedAnimals.map(id => animalService.deleteAnimal(id)));
                    setAnimals(animals.filter(animal => !selectedAnimals.includes(animal._id)));
                    break;
                case 'export':
                    handleExport();
                    break;
                case 'set-quarantine':
                    // Update status to quarantine
                    const quarantineUpdates = await Promise.all(selectedAnimals.map(id =>
                        animalService.updateAnimal(id, { status: 'quarantine' })
                    ));
                    setAnimals(animals.map(animal =>
                        selectedAnimals.includes(animal._id)
                            ? { ...animal, status: 'quarantine' }
                            : animal
                    ));
                    break;
                case 'set-active':
                    // Update status to active
                    const activeUpdates = await Promise.all(selectedAnimals.map(id =>
                        animalService.updateAnimal(id, { status: 'active' })
                    ));
                    setAnimals(animals.map(animal =>
                        selectedAnimals.includes(animal._id)
                            ? { ...animal, status: 'active' }
                            : animal
                    ));
                    break;
            }
            setSelectedAnimals([]);
            setIsBulkActionDialogOpen(false);
        } catch (error) {
            console.error('Error performing bulk action:', error);
            setError('Failed to perform bulk action. Please try again.');
        }
    };

    // Export functionality
    const handleExport = () => {
        setIsExportDialogOpen(true);
    };

    const confirmExport = () => {
        // In a real implementation, this would generate and download a file
        alert(`Exporting ${selectedAnimals.length || filteredAnimals.length} animals as ${exportFormat.toUpperCase()}`);
        setIsExportDialogOpen(false);
    };

    // Calculate statistics
    const getAnimalStats = () => {
        const total = animals.length;
        const active = animals.filter(a => a.status === 'active').length;
        const quarantine = animals.filter(a => a.status === 'quarantine').length;
        const speciesCount = new Set(animals.map(a => a.species)).size;
        const experimentsCount = animals.reduce((sum, a) => sum + (a.experiments?.length || 0), 0);

        return { total, active, quarantine, speciesCount, experimentsCount };
    };

    const stats = getAnimalStats();

    // Add search enhancement
    const handleAdvancedSearch = (searchTerm) => {
        // Split search term into multiple keywords
        const keywords = searchTerm.toLowerCase().split(' ').filter(Boolean);

        // Filter animals based on multiple criteria
        return animals.filter(animal => {
            const searchableText = [
                animal.name,
                animal.species,
                animal.strain,
                animal.location,
                animal.notes,
                ...(animal.experiments || [])
            ].join(' ').toLowerCase();

            // Check if all keywords are present in the searchable text
            return keywords.every(keyword =>
                searchableText.includes(keyword)
            );
        });
    };

    // Add timeline/history tracking
    const getAnimalTimeline = (animalId) => {
        // Mock timeline data
        return [
            {
                id: 1,
                date: '2024-06-15T14:30:00Z',
                action: 'Experiment Assigned',
                description: 'Added to cardiovascular study (EXP-001)',
                user: 'Dr. Johnson'
            },
            {
                id: 2,
                date: '2024-05-20T11:00:00Z',
                action: 'Animal Registered',
                description: 'New animal added to the system',
                user: 'Lab Technician'
            }
        ];
    };

    // Add animal grouping (remove health grouping)
    const getAnimalGroups = () => {
        const groups = {
            bySpecies: {},
            byStatus: {},
            byLocation: {}
        };

        animals.forEach(animal => {
            // Group by species
            if (!groups.bySpecies[animal.species]) {
                groups.bySpecies[animal.species] = [];
            }
            groups.bySpecies[animal.species].push(animal);

            // Group by status
            if (!groups.byStatus[animal.status]) {
                groups.byStatus[animal.status] = [];
            }
            groups.byStatus[animal.status].push(animal);

            // Group by location (first part before space)
            const locationGroup = animal.location.split(' ')[0];
            if (!groups.byLocation[locationGroup]) {
                groups.byLocation[locationGroup] = [];
            }
            groups.byLocation[locationGroup].push(animal);
        });

        return groups;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700">{error}</p>
                <Button
                    onClick={loadAnimals}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search animals by name, species, strain, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-5 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="active-toggle" className="text-sm text-gray-600 dark:text-gray-400">
                            Active only
                        </Label>
                        <Switch
                            id="active-toggle"
                            checked={showOnlyActive}
                            onCheckedChange={setShowOnlyActive}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="hidden sm:inline">View Options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setViewMode('grid')} className="flex items-center gap-2 cursor-pointer">
                                <Grid className="h-4 w-4" />
                                Grid View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('list')} className="flex items-center gap-2 cursor-pointer">
                                <List className="h-4 w-4" />
                                List View
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AnimalFilters filters={filters} onFiltersChange={setFilters} />

                    <Button onClick={handleAddAnimal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Animal</span>
                    </Button>
                </div>
            </div>

            {/* Active Filters Bar */}
            {(searchTerm || filters.species !== '__all__' || filters.status !== '__all__' || showOnlyActive || filters.gender !== '__all__' || filters.hasExperiments) && (
                <div className="flex flex-wrap items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        Active filters:
                    </span>
                    {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            Search: "{searchTerm}"
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {filters.species && filters.species !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            Species: {SPECIES_OPTIONS.find(s => s.value === filters.species)?.label}
                            <button
                                onClick={() => setFilters({ ...filters, species: '__all__' })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {filters.status && filters.status !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            Status: {filters.status}
                            <button
                                onClick={() => setFilters({ ...filters, status: '__all__' })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {filters.gender && filters.gender !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            Gender: {GENDER_OPTIONS.find(g => g.value === filters.gender)?.label}
                            <button
                                onClick={() => setFilters({ ...filters, gender: '__all__' })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {filters.hasExperiments && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            Has Experiments
                            <button
                                onClick={() => setFilters({ ...filters, hasExperiments: false })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {showOnlyActive && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            Active Only
                            <button
                                onClick={() => setShowOnlyActive(false)}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-6 px-2 text-xs flex items-center gap-1"
                    >
                        <FilterX className="h-3 w-3" />
                        Clear All
                    </Button>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Animals</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <span className="text-2xl">🐾</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {stats.active}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quarantine</p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {stats.quarantine}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Species</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.speciesCount}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <span className="text-2xl">🧬</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Experiments</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.experimentsCount}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <span className="text-2xl">🔬</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Needs Health Check</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {stats.needsHealthCheck}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                                <span className="text-2xl">🩺</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg">
                        <FileText className="h-4 w-4" />
                        <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="breeding" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg">
                        <Baby className="h-4 w-4" />
                        <span>Breeding</span>
                    </TabsTrigger>
                    <TabsTrigger value="cages" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg">
                        <MapPin className="h-4 w-4" />
                        <span>Cages</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Bulk Actions Bar */}
                    {selectedAnimals.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {selectedAnimals.length} animal{selectedAnimals.length !== 1 ? 's' : ''} selected
                            </span>
                            <Separator orientation="vertical" className="h-5 bg-gray-300 dark:bg-gray-600" />
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('export')}
                                    className="flex items-center gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('set-active')}
                                    className="flex items-center gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <Check className="h-4 w-4" />
                                    Set Active
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('set-quarantine')}
                                    className="flex items-center gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    Quarantine
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('delete')}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Animals Grid/List View */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredAnimals.map((animal) => (
                                <Card key={animal._id} className="hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                    <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedAnimals.includes(animal._id)}
                                                    onCheckedChange={() => toggleSelectAnimal(animal._id)}
                                                    className="rounded-full"
                                                />
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <span className="text-2xl">{getSpeciesIcon(animal.species)}</span>
                                                    <span className="truncate max-w-[120px] font-semibold">{animal.name}</span>
                                                </CardTitle>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Badge className={`${getStatusColor(animal.status)} px-2 py-1 text-xs font-medium rounded-full`} variant="secondary">
                                                    {animal.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-4">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                                <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Species</span>
                                                <p className="capitalize truncate font-medium">{animal.species}</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                                <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Strain</span>
                                                <p className="truncate font-medium">{animal.strain}</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                                <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Age</span>
                                                <p className="font-medium">{animal.age} weeks</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                                <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Weight</span>
                                                <p className="font-medium">{animal.weight}g</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                            <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Location</span>
                                            <p className="text-sm truncate font-medium">{animal.location}</p>
                                        </div>

                                        {animal.experiments && animal.experiments.length > 0 && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400 text-xs">Experiments:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {animal.experiments.slice(0, 3).map((exp, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                                            {exp}
                                                        </Badge>
                                                    ))}
                                                    {animal.experiments.length > 3 && (
                                                        <Badge variant="outline" className="text-xs bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                                            +{animal.experiments.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2 pt-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewAnimal(animal)}
                                                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View Details</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditAnimal(animal)}
                                                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Edit Animal</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteAnimal(animal)}
                                                            className="border-red-200 dark:border-red-800 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Delete Animal</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        // List View
                        <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedAnimals.length === filteredAnimals.length && filteredAnimals.length > 0}
                                                    onCheckedChange={toggleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg">
                                                Animal {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Species {sortBy === 'species' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Strain</TableHead>
                                            <TableHead className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Age {sortBy === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Weight {sortBy === 'weight' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Location {sortBy === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300 rounded-r-lg">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAnimals.map((animal) => (
                                            <TableRow key={animal._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedAnimals.includes(animal._id)}
                                                        onCheckedChange={() => toggleSelectAnimal(animal._id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{getSpeciesIcon(animal.species)}</span>
                                                        <span className="font-medium">{animal.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="capitalize font-medium">{animal.species}</TableCell>
                                                <TableCell className="font-medium">{animal.strain}</TableCell>
                                                <TableCell className="font-medium">{animal.age}w</TableCell>
                                                <TableCell className="font-medium">{animal.weight}g</TableCell>
                                                <TableCell>
                                                    <Badge className={`${getStatusColor(animal.status)} px-2 py-1 text-xs font-medium rounded-full`} variant="secondary">
                                                        {animal.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{animal.location}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-1">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleViewAnimal(animal)}
                                                                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>View Details</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEditAnimal(animal)}
                                                                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Edit Animal</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteAnimal(animal)}
                                                                        className="border-red-200 dark:border-red-800 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Delete Animal</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {filteredAnimals.length === 0 && (
                        <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                            <CardContent className="p-12 text-center">
                                <div className="text-6xl mb-4 text-gray-300 dark:text-gray-600">🐾</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No animals found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    {searchTerm || filters.species || filters.status || showOnlyActive || filters.gender || filters.hasExperiments
                                        ? 'Try adjusting your search or filters to find what you\'re looking for'
                                        : 'Get started by adding your first animal to the system'}
                                </p>
                                {!searchTerm && !filters.species && !filters.status && !showOnlyActive && !filters.gender && !filters.hasExperiments && (
                                    <Button onClick={handleAddAnimal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                                        <Plus className="h-5 w-5" />
                                        Add First Animal
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="breeding" className="space-y-6 mt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Breeding Management</h2>
                        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto" onClick={handleCreateBreedingPair}>
                            <Baby className="h-4 w-4" />
                            Create Breeding Pair
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border border-gray-200 dark:border-gray-700 rounded-xl">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Baby className="h-5 w-5" />
                                    Active Breeding Pairs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {breedingPairs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {breedingPairs.map(pair => (
                                            <Card key={pair._id} className="border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md transition-shadow">
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Pair {pair._id.substring(0, 8)}</h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <span className="font-medium">{pair.maleName}</span> + <span className="font-medium">{pair.femaleName}</span>
                                                            </p>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Active</Badge>
                                                    </div>
                                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                            <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Start Date</span>
                                                            <p className="font-medium">{new Date(pair.startDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                            <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Expected Delivery</span>
                                                            <p className="font-medium">{new Date(pair.expectedDelivery).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                            <span className="font-medium text-gray-600 dark:text-gray-400 block text-xs">Offspring</span>
                                                            <p className="font-medium">{pair.offspringCount || 0}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">View Details</Button>
                                                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">Manage</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-5xl mb-4 text-gray-300 dark:text-gray-600">🍼</div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Breeding Pairs</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                            You haven't created any breeding pairs yet. Get started by creating your first breeding pair.
                                        </p>
                                        <Button onClick={handleCreateBreedingPair} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                                            <Baby className="h-5 w-5" />
                                            Create Breeding Pair
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <TrendingUp className="h-5 w-5" />
                                    Breeding Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-5">
                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{breedingPairs.length}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Pairs</p>
                                    </div>

                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {breedingPairs.reduce((sum, pair) => sum + (pair.offspringCount || 0), 0)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Offspring</p>
                                    </div>

                                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                            {breedingPairs.filter(p => new Date(p.expectedDelivery) > new Date()).length}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Deliveries</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="cages" className="space-y-6 mt-6">
                    <CageManagement />
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <AnimalForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveAnimal}
                animal={selectedAnimal}
                speciesOptions={SPECIES_OPTIONS}
            />

            <AnimalDetails
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                animal={selectedAnimal}
                speciesOptions={SPECIES_OPTIONS}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                animalName={animalToDelete?.name}
            />

            <BreedingPairForm
                isOpen={isBreedingFormOpen}
                onClose={() => setIsBreedingFormOpen(false)}
                onSave={handleSaveBreedingPair}
                animals={animals}
            />

            {/* Export Dialog */}
            <AlertDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <AlertDialogContent className="rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold">Export Animals</AlertDialogTitle>
                        <AlertDialogDescription>
                            Choose the format for exporting {selectedAnimals.length || filteredAnimals.length} animals
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Label htmlFor="export-format" className="mb-2 block font-medium">Export Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                            <SelectTrigger id="export-format" className="border-gray-300 dark:border-gray-600">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmExport} className="bg-blue-600 hover:bg-blue-700">
                            Export
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Action Confirmation Dialog */}
            <AlertDialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
                <AlertDialogContent className="rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold">Confirm Bulk Action</AlertDialogTitle>
                        <AlertDialogDescription>
                            {bulkAction === 'delete' ? (
                                `Are you sure you want to delete ${selectedAnimals.length} animal(s)? This action cannot be undone.`
                            ) : bulkAction === 'export' ? (
                                `Export ${selectedAnimals.length} selected animals?`
                            ) : bulkAction === 'set-quarantine' ? (
                                `Move ${selectedAnimals.length} animal(s) to quarantine?`
                            ) : bulkAction === 'set-active' ? (
                                `Set ${selectedAnimals.length} animal(s) as active?`
                            ) : (
                                `Perform this action on ${selectedAnimals.length} animal(s)?`
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkAction}
                            className={bulkAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                        >
                            {bulkAction === 'delete' ? 'Delete' : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}