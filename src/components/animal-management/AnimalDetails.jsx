'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    MapPin,
    Scale,
    Clock,
    FileText,
    FlaskConical,
    Heart,
    Activity,
    User,
    CalendarClock,
    Stethoscope,
    Dna,
    Baby,
    Hash,
    Tag,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HEALTH_STATUS_OPTIONS = [
    { value: 'excellent', label: 'Excellent', color: 'bg-green-500' },
    { value: 'good', label: 'Good', color: 'bg-blue-500' },
    { value: 'fair', label: 'Fair', color: 'bg-yellow-500' },
    { value: 'poor', label: 'Poor', color: 'bg-red-500' }
];

export function AnimalDetails({ isOpen, onClose, animal, speciesOptions }) {
    if (!animal) return null;

    const getSpeciesIcon = (species) => {
        const speciesOption = speciesOptions.find(option => option.value === species);
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

    const getHealthStatusColor = (healthStatus) => {
        switch (healthStatus) {
            case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getHealthStatusEmoji = (healthStatus) => {
        switch (healthStatus) {
            case 'excellent': return '💚';
            case 'good': return '💙';
            case 'fair': return '💛';
            case 'poor': return '❤️';
            default: return '🤍';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateAge = (dateOfBirth) => {
        const birth = new Date(dateOfBirth);
        const now = new Date();
        const diffTime = Math.abs(now - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;

        if (weeks === 0) {
            return `${days} day${days !== 1 ? 's' : ''}`;
        }
        return `${weeks} week${weeks !== 1 ? 's' : ''} ${days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : ''}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-5xl rounded-xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-4 text-2xl">
                        <span className="text-4xl">{getSpeciesIcon(animal.species)}</span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="truncate font-bold text-gray-900 dark:text-white">{animal.name}</span>
                            <div className="flex flex-wrap gap-2">
                                <Badge className={`${getStatusColor(animal.status)} px-3 py-1.5 text-sm font-medium rounded-full`}>
                                    {animal.status}
                                </Badge>
                                <Badge className={`${getHealthStatusColor(animal.healthStatus)} px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1`}>
                                    <span>{getHealthStatusEmoji(animal.healthStatus)}</span>
                                    <span className="capitalize">{animal.healthStatus}</span>
                                </Badge>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="health" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg">
                            Health
                        </TabsTrigger>
                        <TabsTrigger value="experiments" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg">
                            Experiments
                        </TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg">
                            History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-t-xl">
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <FileText className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <Tag className="h-4 w-4" />
                                                ID
                                            </p>
                                            <p className="text-lg font-mono font-semibold truncate text-gray-900 dark:text-white">{animal.name}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <Dna className="h-4 w-4" />
                                                Species
                                            </p>
                                            <p className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                                <span className="text-2xl">{getSpeciesIcon(animal.species)}</span>
                                                <span className="capitalize">{animal.species}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Gender
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {animal.gender} {animal.gender === 'male' ? '♂' : '♀'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <Dna className="h-4 w-4" />
                                                Strain
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{animal.strain}</p>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Date of Birth
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(animal.dateOfBirth)}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            ({calculateAge(animal.dateOfBirth)} old)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Physical Characteristics */}
                            <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-t-xl">
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Scale className="h-5 w-5" />
                                        Physical Characteristics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="text-center p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <Scale className="h-8 w-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{animal.weight}g</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                                        </div>
                                        <div className="text-center p-5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <Clock className="h-8 w-8 mx-auto mb-3 text-green-600 dark:text-green-400" />
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{animal.age}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Weeks Old</p>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <CalendarClock className="h-4 w-4" />
                                                Created
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDateTime(animal.createdAt)}</p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <CalendarClock className="h-4 w-4" />
                                                Last Updated
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDateTime(animal.updatedAt)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location & Housing */}
                            <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-t-xl">
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <MapPin className="h-5 w-5" />
                                        Location & Housing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <MapPin className="h-12 w-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{animal.location}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Current Location</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Breeding Information */}
                            <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/30 rounded-t-xl">
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Baby className="h-5 w-5" />
                                        Breeding Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5">
                                    {animal.breedingPair ? (
                                        <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                            <Baby className="h-12 w-12 mx-auto mb-4 text-pink-600 dark:text-pink-400" />
                                            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">BP-{animal.breedingPair}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Breeding Pair ID</p>
                                            <Button variant="outline" size="sm" className="mt-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                View Pair Details
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Baby className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">Not in breeding program</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This animal is not currently part of any breeding pairs</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="health" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Health Information */}
                            <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 rounded-t-xl">
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Heart className="h-5 w-5" />
                                        Health Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="text-center p-5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <Heart className="h-8 w-8 mx-auto mb-3 text-red-600 dark:text-red-400" />
                                            <p className="text-2xl font-bold text-red-600 dark:text-red-400 capitalize">{animal.healthStatus}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
                                        </div>
                                        <div className="text-center p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <Activity className="h-8 w-8 mx-auto mb-3 text-orange-600 dark:text-orange-400" />
                                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {animal.lastHealthCheck ? formatDate(animal.lastHealthCheck) : 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Last Check</p>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            <Activity className="h-4 w-4" />
                                            Next Health Check
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {animal.nextHealthCheck ? formatDate(animal.nextHealthCheck) : 'Not scheduled'}
                                        </p>
                                        {animal.nextHealthCheck && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {new Date(animal.nextHealthCheck) > new Date()
                                                    ? `${Math.ceil((new Date(animal.nextHealthCheck) - new Date()) / (1000 * 60 * 60 * 24))} days remaining`
                                                    : 'Overdue'}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Health History */}
                            <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-t-xl">
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Stethoscope className="h-5 w-5" />
                                        Health History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-3 rounded-full">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">Routine Health Check</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">June 15, 2024</p>
                                                <p className="text-sm mt-1">Animal in excellent condition, all vitals normal</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-3 rounded-full">
                                                <Stethoscope className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">Vaccination</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">May 20, 2024</p>
                                                <p className="text-sm mt-1">Administered standard laboratory animal vaccines</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="experiments" className="space-y-6 mt-6">
                        <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FlaskConical className="h-5 w-5" />
                                    Associated Experiments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                {animal.experiments && animal.experiments.length > 0 ? (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            This animal is currently involved in {animal.experiments.length} experiment{animal.experiments.length !== 1 ? 's' : ''}:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {animal.experiments.map((experiment, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <FlaskConical className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{experiment}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Experiment</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FlaskConical className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">No experiments assigned</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This animal is not currently part of any experiments</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6 mt-6">
                        <Card className="border border-gray-200 dark:border-gray-700 rounded-xl">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Hash className="h-5 w-5" />
                                    Activity History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-3 rounded-full">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Animal Registered</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">January 15, 2024 at 10:30 AM</p>
                                            <p className="text-sm mt-1">Added to the system with initial health assessment</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-3 rounded-full">
                                            <FlaskConical className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Assigned to Experiment</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">February 5, 2024 at 2:15 PM</p>
                                            <p className="text-sm mt-1">Added to cardiovascular study (EXP-001)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="mt-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 p-3 rounded-full">
                                            <Heart className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Health Check Completed</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">June 15, 2024 at 2:20 PM</p>
                                            <p className="text-sm mt-1">Routine health assessment, animal in excellent condition</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Notes Section */}
                {animal.notes && (
                    <Card className="mt-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30 rounded-t-xl">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <FileText className="h-5 w-5" />
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{animal.notes}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
}