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
    FilterX,
    Hash,
    Rat
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
import { cageService } from '@/services/cageService'; // Import cage service
import { BreedingPairDetails } from './BreedingPairDetails';

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
    const [selectedBreedingPair, setSelectedBreedingPair] = useState(null);
    const [isBreedingDetailsOpen, setIsBreedingDetailsOpen] = useState(false);
    const [availableCages, setAvailableCages] = useState([]); // State for available cages

    // Load animals and breeding pairs
    useEffect(() => {
        loadAnimals();
        loadBreedingPairs();
        loadAvailableCages(); // Load available cages
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
            // Set empty array instead of mock data
            setBreedingPairs([]);
        }
    };

    // Load available cages
    const loadAvailableCages = async () => {
        try {
            const cages = await cageService.getAvailableCages();
            setAvailableCages(cages);
        } catch (error) {
            console.error('Error loading available cages:', error);
            setAvailableCages([]);
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

    const handleViewBreedingPair = (breedingPair) => {
        setSelectedBreedingPair(breedingPair);
        setIsBreedingDetailsOpen(true);
    };

    const handleEditBreedingPair = (updatedBreedingPair) => {
        setBreedingPairs(breedingPairs.map(pair =>
            pair._id === updatedBreedingPair._id ? updatedBreedingPair : pair
        ));
        setSelectedBreedingPair(updatedBreedingPair);
    };

    const handleDeleteBreedingPair = (breedingPairId) => {
        setBreedingPairs(breedingPairs.filter(pair => pair._id !== breedingPairId));
        // Also refresh the breeding pairs to ensure consistency
        loadBreedingPairs();
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
        // Return empty array instead of mock data
        return [];
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-500 mb-2">
                    <AlertCircle className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-red-700 font-medium">{error}</p>
                <Button
                    onClick={loadAnimals}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {/* Header Actions - Modernized Design */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Search animals by name, species, strain, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-5 rounded-2xl border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 dark:focus:border-blue-500 shadow-sm transition-all duration-300"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <Label htmlFor="active-toggle" className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            Active only
                        </Label>
                        <Switch
                            id="active-toggle"
                            checked={showOnlyActive}
                            onCheckedChange={setShowOnlyActive}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="hidden sm:inline">View Options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
                            <DropdownMenuItem onClick={() => setViewMode('grid')} className="flex items-center gap-2 cursor-pointer rounded-xl py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Grid className="h-4 w-4" />
                                Grid View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('list')} className="flex items-center gap-2 cursor-pointer rounded-xl py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <List className="h-4 w-4" />
                                List View
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AnimalFilters filters={filters} onFiltersChange={setFilters} />

                    <Button onClick={handleAddAnimal} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Add Animal</span>
                    </Button>
                </div>
            </div>

            {/* Active Filters Bar - Modernized Design */}
            {(searchTerm || filters.species !== '__all__' || filters.status !== '__all__' || showOnlyActive || filters.gender !== '__all__' || filters.hasExperiments) && (
                <div className="flex flex-wrap items-center gap-3 p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
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
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {filters.species && filters.species !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Species:</span>
                            <span className="text-xs">{SPECIES_OPTIONS.find(s => s.value === filters.species)?.label}</span>
                            <button
                                onClick={() => setFilters({ ...filters, species: '__all__' })}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {filters.status && filters.status !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Status:</span>
                            <span className="text-xs">{filters.status}</span>
                            <button
                                onClick={() => setFilters({ ...filters, status: '__all__' })}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {filters.gender && filters.gender !== '__all__' && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Gender:</span>
                            <span className="text-xs">{GENDER_OPTIONS.find(g => g.value === filters.gender)?.label}</span>
                            <button
                                onClick={() => setFilters({ ...filters, gender: '__all__' })}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {filters.hasExperiments && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Has Experiments</span>
                            <button
                                onClick={() => setFilters({ ...filters, hasExperiments: false })}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    {showOnlyActive && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md">
                            <span className="text-xs font-medium">Active Only</span>
                            <button
                                onClick={() => setShowOnlyActive(false)}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-7 px-3 text-xs flex items-center gap-1.5 rounded-full font-medium transition-colors"
                    >
                        <FilterX className="h-3.5 w-3.5" />
                        Clear All
                    </Button>
                </div>
            )}

            {/* Enhanced Statistics Cards with Better Visual Hierarchy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Animals Card */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/5"></div>
                    <CardContent className="relative p-7">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Total Animals</p>
                                <p className="text-4xl font-black text-blue-900 dark:text-blue-100 tracking-tight">{stats.total}</p>
                                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>All registered</span>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                <div className="relative p-4 rounded-2xl bg-white/80 dark:bg-blue-900/40 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 group-hover:bg-white dark:group-hover:bg-blue-800/60 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                                    <Rat className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Animals Card */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-200/30 dark:from-emerald-950/40 dark:via-emerald-900/30 dark:to-emerald-800/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 dark:from-emerald-400/10 dark:to-emerald-500/5"></div>
                    <CardContent className="relative p-7">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Active</p>
                                <p className="text-4xl font-black text-emerald-900 dark:text-emerald-100 tracking-tight">{stats.active}</p>
                                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                    <Activity className="h-3 w-3" />
                                    <span>Healthy & active</span>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                <div className="relative p-4 rounded-2xl bg-white/80 dark:bg-emerald-900/40 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50 group-hover:bg-white dark:group-hover:bg-emerald-800/60 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                                    <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quarantine Card */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-200/30 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-800/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 dark:from-amber-400/10 dark:to-amber-500/5"></div>
                    <CardContent className="relative p-7">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Quarantine</p>
                                <p className="text-4xl font-black text-amber-900 dark:text-amber-100 tracking-tight">{stats.quarantine}</p>
                                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                    <Clock className="h-3 w-3" />
                                    <span>Under observation</span>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-500/20 dark:bg-amber-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                <div className="relative p-4 rounded-2xl bg-white/80 dark:bg-amber-900/40 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50 group-hover:bg-white dark:group-hover:bg-amber-800/60 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                                    <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Species Diversity Card */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-violet-50 via-violet-100/50 to-violet-200/30 dark:from-violet-950/40 dark:via-violet-900/30 dark:to-violet-800/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-violet-600/10 dark:from-violet-400/10 dark:to-violet-500/5"></div>
                    <CardContent className="relative p-7">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">Species</p>
                                <p className="text-4xl font-black text-violet-900 dark:text-violet-100 tracking-tight">{stats.speciesCount}</p>
                                <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                                    <Zap className="h-3 w-3" />
                                    <span>Different types</span>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-violet-500/20 dark:bg-violet-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                <div className="relative p-4 rounded-2xl bg-white/80 dark:bg-violet-900/40 backdrop-blur-sm border border-violet-200/50 dark:border-violet-700/50 group-hover:bg-white dark:group-hover:bg-violet-800/60 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                                    <FlaskConical className="h-8 w-8 text-violet-600 dark:text-violet-300" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Tabs with Better Visual Design */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-gradient-to-r from-gray-100/80 via-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:via-gray-700/50 dark:to-gray-800/50 p-2 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <TabsTrigger value="overview" className="flex items-center gap-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/10 dark:data-[state=active]:shadow-blue-400/20 rounded-xl transition-all duration-300 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <FileText className="h-4 w-4" />
                        <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="breeding" className="flex items-center gap-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/10 dark:data-[state=active]:shadow-pink-400/20 rounded-xl transition-all duration-300 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-300 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <Baby className="h-4 w-4" />
                        <span>Breeding</span>
                    </TabsTrigger>
                    <TabsTrigger value="cages" className="flex items-center gap-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/10 dark:data-[state=active]:shadow-purple-400/20 rounded-xl transition-all duration-300 font-semibold text-gray-700 dark:text-gray-300 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <MapPin className="h-4 w-4" />
                        <span>Cages</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Bulk Actions Bar */}
                    {selectedAnimals.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4 p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                {selectedAnimals.length} animal{selectedAnimals.length !== 1 ? 's' : ''} selected
                            </span>
                            <Separator orientation="vertical" className="h-6 bg-blue-300 dark:bg-blue-700" />
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('export')}
                                    className="flex items-center gap-1.5 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('set-active')}
                                    className="flex items-center gap-1.5 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <Check className="h-4 w-4" />
                                    Set Active
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('set-quarantine')}
                                    className="flex items-center gap-1.5 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    Quarantine
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('delete')}
                                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Animals Grid/List View */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredAnimals.map((animal) => (
                                <Card key={animal._id} className="group relative overflow-hidden border-0 bg-white dark:bg-gray-900/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] rounded-3xl backdrop-blur-sm">
                                    {/* Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-gray-100/30 dark:from-gray-900/80 dark:via-gray-800/50 dark:to-gray-700/30"></div>

                                    {/* Status Color Accent */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${animal.status === 'active' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                        animal.status === 'quarantine' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                                            animal.status === 'inactive' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                                'bg-gradient-to-r from-red-400 to-red-600'
                                        }`}></div>

                                    <CardHeader className="relative pb-4 bg-gradient-to-r from-gray-50/90 via-white/80 to-gray-50/90 dark:from-gray-800/60 dark:via-gray-700/40 dark:to-gray-800/60 border-b border-gray-200/50 dark:border-gray-600/30">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedAnimals.includes(animal._id)}
                                                    onCheckedChange={() => toggleSelectAnimal(animal._id)}
                                                    className="rounded-lg data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-2 border-gray-300 dark:border-gray-600 h-5 w-5 transition-all duration-300 hover:border-blue-400"
                                                />
                                                <CardTitle className="text-lg flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                                                        <span className="text-2xl">{getSpeciesIcon(animal.species)}</span>
                                                    </div>
                                                    <span className="truncate max-w-[120px] font-bold text-gray-900 dark:text-gray-100">{animal.name}</span>
                                                </CardTitle>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Badge className={`${getStatusColor(animal.status)} px-3 py-1.5 text-xs font-bold rounded-full border-0 shadow-md uppercase tracking-wider`} variant="secondary">
                                                    {animal.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative space-y-5 p-6">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="relative bg-gradient-to-br from-blue-50/80 to-blue-100/40 dark:from-blue-950/30 dark:to-blue-900/20 p-4 rounded-2xl transition-all duration-300 group-hover:from-blue-100/90 group-hover:to-blue-200/50 dark:group-hover:from-blue-900/40 dark:group-hover:to-blue-800/30 border border-blue-200/30 dark:border-blue-800/30 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FlaskConical className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                    <span className="font-bold text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wider">Species</span>
                                                </div>
                                                <p className="capitalize truncate font-bold text-blue-900 dark:text-blue-100">{animal.species}</p>
                                            </div>
                                            <div className="relative bg-gradient-to-br from-purple-50/80 to-purple-100/40 dark:from-purple-950/30 dark:to-purple-900/20 p-4 rounded-2xl transition-all duration-300 group-hover:from-purple-100/90 group-hover:to-purple-200/50 dark:group-hover:from-purple-900/40 dark:group-hover:to-purple-800/30 border border-purple-200/30 dark:border-purple-800/30 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Hash className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                                    <span className="font-bold text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wider">Strain</span>
                                                </div>
                                                <p className="truncate font-bold text-purple-900 dark:text-purple-100">{animal.strain}</p>
                                            </div>
                                            <div className="relative bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 dark:from-emerald-950/30 dark:to-emerald-900/20 p-4 rounded-2xl transition-all duration-300 group-hover:from-emerald-100/90 group-hover:to-emerald-200/50 dark:group-hover:from-emerald-900/40 dark:group-hover:to-emerald-800/30 border border-emerald-200/30 dark:border-emerald-800/30 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wider">Age</span>
                                                </div>
                                                <p className="font-bold text-emerald-900 dark:text-emerald-100">{animal.age} weeks</p>
                                            </div>
                                            <div className="relative bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/20 p-4 rounded-2xl transition-all duration-300 group-hover:from-amber-100/90 group-hover:to-amber-200/50 dark:group-hover:from-amber-900/40 dark:group-hover:to-amber-800/30 border border-amber-200/30 dark:border-amber-800/30 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Scale className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                                    <span className="font-bold text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wider">Weight</span>
                                                </div>
                                                <p className="font-bold text-amber-900 dark:text-amber-100">{animal.weight}g</p>
                                            </div>
                                        </div>

                                        <div className="relative bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 dark:from-indigo-950/30 dark:to-indigo-900/20 p-4 rounded-2xl transition-all duration-300 group-hover:from-indigo-100/90 group-hover:to-indigo-200/50 dark:group-hover:from-indigo-900/40 dark:group-hover:to-indigo-800/30 border border-indigo-200/30 dark:border-indigo-800/30 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                                <span className="font-bold text-indigo-700 dark:text-indigo-300 text-xs uppercase tracking-wider">Location</span>
                                            </div>
                                            <p className="text-sm truncate font-bold text-indigo-900 dark:text-indigo-100">{animal.location}</p>
                                        </div>

                                        {animal.experiments && animal.experiments.length > 0 && (
                                            <div className="relative bg-gradient-to-br from-rose-50/80 to-rose-100/40 dark:from-rose-950/30 dark:to-rose-900/20 p-4 rounded-2xl border border-rose-200/30 dark:border-rose-800/30 shadow-sm">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <FlaskConical className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                                                    <span className="font-bold text-rose-700 dark:text-rose-300 text-xs uppercase tracking-wider">Experiments</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {animal.experiments.slice(0, 3).map((exp, index) => (
                                                        <Badge key={index} className="text-xs bg-white/80 dark:bg-rose-900/30 border border-rose-300/50 dark:border-rose-700/50 text-rose-700 dark:text-rose-300 rounded-full px-3 py-1.5 font-semibold shadow-sm">
                                                            {exp}
                                                        </Badge>
                                                    ))}
                                                    {animal.experiments.length > 3 && (
                                                        <Badge className="text-xs bg-rose-100/80 dark:bg-rose-800/30 border border-rose-300/50 dark:border-rose-600/50 text-rose-800 dark:text-rose-200 rounded-full px-3 py-1.5 font-bold shadow-sm">
                                                            +{animal.experiments.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Enhanced Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewAnimal(animal)}
                                                            className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-300/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/70 dark:hover:to-blue-800/50 text-blue-700 dark:text-blue-300 rounded-xl h-10 w-10 p-0 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-110"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-blue-900 text-blue-100 border-blue-700">
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
                                                            className="relative bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-300/50 dark:border-emerald-700/50 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-900/70 dark:hover:to-emerald-800/50 text-emerald-700 dark:text-emerald-300 rounded-xl h-10 w-10 p-0 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 transform hover:scale-110"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-emerald-900 text-emerald-100 border-emerald-700">
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
                                                            className="relative bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-red-300/50 dark:border-red-700/50 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/70 dark:hover:to-red-800/50 text-red-700 dark:text-red-300 rounded-xl h-10 w-10 p-0 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 transform hover:scale-110"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-red-900 text-red-100 border-red-700">
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
                        // Enhanced List View with Better Visual Hierarchy
                        <Card className="border-0 bg-gradient-to-br from-white via-gray-50/50 to-gray-100/30 dark:from-gray-900/80 dark:via-gray-800/50 dark:to-gray-700/30 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-gray-100/80 via-gray-50/80 to-gray-100/80 dark:from-gray-800/60 dark:via-gray-700/40 dark:to-gray-800/60 hover:from-gray-200/80 hover:to-gray-200/80 dark:hover:from-gray-700/70 dark:hover:to-gray-700/70 border-b-2 border-gray-200/50 dark:border-gray-600/30">
                                            <TableHead className="w-12 pl-6">
                                                <Checkbox
                                                    checked={selectedAnimals.length === filteredAnimals.length && filteredAnimals.length > 0}
                                                    onCheckedChange={toggleSelectAll}
                                                    className="rounded-lg data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-2 border-gray-300 dark:border-gray-600 h-5 w-5 transition-all duration-300"
                                                />
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-black text-gray-900 dark:text-gray-100 hover:text-blue-700 dark:hover:text-blue-300 text-sm uppercase tracking-wider py-4 transition-all duration-300">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Animal {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-black text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-300 text-sm uppercase tracking-wider py-4 transition-all duration-300">
                                                <div className="flex items-center gap-2">
                                                    <FlaskConical className="h-4 w-4" />
                                                    Species {sortBy === 'species' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider py-4">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4" />
                                                    Strain
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-black text-gray-900 dark:text-gray-100 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm uppercase tracking-wider py-4 transition-all duration-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Age {sortBy === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-black text-gray-900 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-300 text-sm uppercase tracking-wider py-4 transition-all duration-300">
                                                <div className="flex items-center gap-2">
                                                    <Scale className="h-4 w-4" />
                                                    Weight {sortBy === 'weight' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-black text-gray-900 dark:text-gray-100 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm uppercase tracking-wider py-4 transition-all duration-300">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4" />
                                                    Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer font-black text-gray-900 dark:text-gray-100 hover:text-violet-700 dark:hover:text-violet-300 text-sm uppercase tracking-wider py-4 transition-all duration-300">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Location {sortBy === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider py-4 pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    Actions
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAnimals.map((animal) => (
                                            <TableRow key={animal._id} className="hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-100/50 dark:hover:from-gray-800/60 dark:hover:to-gray-700/40 transition-all duration-300 border-b border-gray-100 dark:border-gray-800">
                                                <TableCell className="pl-6">
                                                    <Checkbox
                                                        checked={selectedAnimals.includes(animal._id)}
                                                        onCheckedChange={() => toggleSelectAnimal(animal._id)}
                                                        className="rounded-lg data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-2 border-gray-300 dark:border-gray-600 h-5 w-5 transition-all duration-300 hover:border-blue-400"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-sm">
                                                            <span className="text-xl">{getSpeciesIcon(animal.species)}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{animal.name}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">ID: {animal._id.slice(-6)}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-sm"></div>
                                                        <span className="capitalize font-semibold text-gray-900 dark:text-gray-100 text-sm">{animal.species}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{animal.strain}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm"></div>
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{animal.age}w</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-sm"></div>
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{animal.weight}g</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge className={`${getStatusColor(animal.status)} px-3 py-1.5 text-xs font-bold rounded-full border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`} variant="secondary">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-2 h-2 rounded-full ${animal.status === 'active' ? 'bg-green-500' : animal.status === 'quarantine' ? 'bg-yellow-500' : animal.status === 'deceased' ? 'bg-red-500' : 'bg-gray-500'} shadow-sm`}></div>
                                                            {animal.status}
                                                        </div>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 shadow-sm"></div>
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{animal.location}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 pr-6">
                                                    <div className="flex justify-end gap-1.5">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleViewAnimal(animal)}
                                                                        className="border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-xl h-8 w-8 p-0 transition-all duration-300 hover:shadow-md hover:scale-105"
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
                                                                        className="border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl h-8 w-8 p-0 transition-all duration-300 hover:shadow-md hover:scale-105"
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
                                                                        className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl h-8 w-8 p-0 transition-all duration-300 hover:shadow-md hover:scale-105"
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
                        <Card className="border border-gray-200 dark:border-gray-700 rounded-3xl bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm">
                            <CardContent className="p-14 text-center">
                                <div className="text-7xl mb-5 text-gray-300 dark:text-gray-600 opacity-80">🐾</div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">No animals found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-base">
                                    {searchTerm || filters.species || filters.status || showOnlyActive || filters.gender || filters.hasExperiments
                                        ? 'Try adjusting your search or filters to find what you\'re looking for'
                                        : 'Get started by adding your first animal to the system'}
                                </p>
                                {!searchTerm && !filters.species && !filters.status && !showOnlyActive && !filters.gender && !filters.hasExperiments && (
                                    <Button onClick={handleAddAnimal} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-base">
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
                        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto" onClick={handleCreateBreedingPair}>
                            <Baby className="h-4 w-4" />
                            Create Breeding Pair
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border border-gray-200 dark:border-gray-700 rounded-2xl">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-t-2xl">
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Baby className="h-5 w-5" />
                                    Active Breeding Pairs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {breedingPairs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {breedingPairs.map(pair => (
                                            <Card key={pair._id} className="border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Pair {pair._id.substring(0, 8)}</h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <span className="font-medium">{pair.maleName}</span> + <span className="font-medium">{pair.femaleName}</span>
                                                            </p>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-0">Active</Badge>
                                                    </div>
                                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                                            <span className="font-medium text-gray-500 dark:text-gray-400 block text-xs mb-1">Start Date</span>
                                                            <p className="font-medium text-gray-900 dark:text-white">{new Date(pair.startDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                                            <span className="font-medium text-gray-500 dark:text-gray-400 block text-xs mb-1">Expected Delivery</span>
                                                            <p className="font-medium text-gray-900 dark:text-white">{new Date(pair.expectedDelivery).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                                            <span className="font-medium text-gray-500 dark:text-gray-400 block text-xs mb-1">Offspring</span>
                                                            <p className="font-medium text-gray-900 dark:text-white">{pair.offspringCount || 0}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                            onClick={() => handleViewBreedingPair(pair)}
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                            onClick={() => handleViewBreedingPair(pair)}
                                                        >
                                                            Manage
                                                        </Button>
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
                                        <Button onClick={handleCreateBreedingPair} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl">
                                            <Baby className="h-5 w-5" />
                                            Create Breeding Pair
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 dark:border-gray-700 rounded-2xl">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-t-2xl">
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <TrendingUp className="h-5 w-5" />
                                    Breeding Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-5">
                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{breedingPairs.length}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Pairs</p>
                                    </div>

                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {breedingPairs.reduce((sum, pair) => sum + (pair.offspringCount || 0), 0)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Offspring</p>
                                    </div>

                                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
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
                availableCages={availableCages} // Pass available cages to the form
            />

            <AnimalDetails
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                animal={selectedAnimal}
                onEdit={handleEditAnimal}
                onDelete={handleDeleteAnimal}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                animalName={animalToDelete?.name}
            />

            {/* Breeding Pair Form Modal */}
            <BreedingPairForm
                isOpen={isBreedingFormOpen}
                onClose={() => setIsBreedingFormOpen(false)}
                onSave={handleSaveBreedingPair}
                animals={animals}
            />

            {/* Breeding Pair Details Modal */}
            <BreedingPairDetails
                isOpen={isBreedingDetailsOpen}
                onClose={() => setIsBreedingDetailsOpen(false)}
                breedingPair={selectedBreedingPair}
                onEdit={handleEditBreedingPair}
                onDelete={handleDeleteBreedingPair}
                animals={animals}
            />

            {/* Export Dialog */}
            <AlertDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold">Export Animals</AlertDialogTitle>
                        <AlertDialogDescription>
                            Choose the format for exporting {selectedAnimals.length || filteredAnimals.length} animals
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Label htmlFor="export-format" className="mb-2 block font-medium">Export Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                            <SelectTrigger id="export-format" className="border-gray-300 dark:border-gray-600 rounded-xl">
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
                        <AlertDialogCancel className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmExport} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl">
                            Export
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Action Confirmation Dialog */}
            <AlertDialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
                <AlertDialogContent className="rounded-2xl">
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
                        <AlertDialogCancel className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkAction}
                            className={bulkAction === 'delete' ? 'bg-red-600 hover:bg-red-700 rounded-xl' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl'}
                        >
                            {bulkAction === 'delete' ? 'Delete' : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}