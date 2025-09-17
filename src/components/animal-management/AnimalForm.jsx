'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Calendar, Heart, Info, User, Dna, MapPin, Scale, Clock, FlaskConical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const animalSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    species: z.string().min(1, 'Species is required'),
    customSpecies: z.string().optional(),
    strain: z.string().min(1, 'Strain is required'),
    age: z.number().min(0, 'Age must be positive'),
    weight: z.number().min(0, 'Weight must be positive'),
    gender: z.enum(['male', 'female'], {
        required_error: 'Gender is required',
    }),
    status: z.enum(['active', 'inactive', 'quarantine', 'deceased'], {
        required_error: 'Status is required',
    }),
    healthStatus: z.enum(['excellent', 'good', 'fair', 'poor'], {
        required_error: 'Health status is required',
    }),
    location: z.string().min(1, 'Location is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    lastHealthCheck: z.string().optional(),
    nextHealthCheck: z.string().optional(),
    notes: z.string().optional(),
});

const HEALTH_STATUS_OPTIONS = [
    { value: 'excellent', label: 'Excellent', color: 'bg-green-500' },
    { value: 'good', label: 'Good', color: 'bg-blue-500' },
    { value: 'fair', label: 'Fair', color: 'bg-yellow-500' },
    { value: 'poor', label: 'Poor', color: 'bg-red-500' }
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', description: 'Animal is healthy and available for experiments' },
    { value: 'inactive', label: 'Inactive', description: 'Animal is not currently in use' },
    { value: 'quarantine', label: 'Quarantine', description: 'Animal is under observation or treatment' },
    { value: 'deceased', label: 'Deceased', description: 'Animal has passed away' }
];

export function AnimalForm({ isOpen, onClose, onSave, animal, speciesOptions }) {
    const [experiments, setExperiments] = useState([]);
    const [newExperiment, setNewExperiment] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(animalSchema),
        defaultValues: {
            name: '',
            species: '',
            customSpecies: '',
            strain: '',
            age: 0,
            weight: 0,
            gender: 'male',
            status: 'active',
            healthStatus: 'good',
            location: '',
            dateOfBirth: '',
            lastHealthCheck: '',
            nextHealthCheck: '',
            notes: '',
        },
    });

    const selectedSpecies = watch('species');
    const selectedStatus = watch('status');

    useEffect(() => {
        if (animal) {
            reset({
                name: animal.name || '',
                species: animal.species || '',
                customSpecies: animal.customSpecies || '',
                strain: animal.strain || '',
                age: animal.age || 0,
                weight: animal.weight || 0,
                gender: animal.gender || 'male',
                status: animal.status || 'active',
                healthStatus: animal.healthStatus || 'good',
                location: animal.location || '',
                dateOfBirth: animal.dateOfBirth || '',
                lastHealthCheck: animal.lastHealthCheck || '',
                nextHealthCheck: animal.nextHealthCheck || '',
                notes: animal.notes || '',
            });
            setExperiments(animal.experiments || []);
        } else {
            reset({
                name: '',
                species: '',
                customSpecies: '',
                strain: '',
                age: 0,
                weight: 0,
                gender: 'male',
                status: 'active',
                healthStatus: 'good',
                location: '',
                dateOfBirth: '',
                lastHealthCheck: '',
                nextHealthCheck: '',
                notes: '',
            });
            setExperiments([]);
        }
    }, [animal, reset]);

    const onSubmit = (data) => {
        const animalData = {
            ...data,
            experiments,
            species: data.species === 'custom' ? data.customSpecies : data.species,
        };
        onSave(animalData);
        handleClose();
    };

    const handleClose = () => {
        reset();
        setExperiments([]);
        setNewExperiment('');
        onClose();
    };

    const addExperiment = () => {
        if (newExperiment.trim() && !experiments.includes(newExperiment.trim())) {
            setExperiments([...experiments, newExperiment.trim()]);
            setNewExperiment('');
        }
    };

    const removeExperiment = (experiment) => {
        setExperiments(experiments.filter(exp => exp !== experiment));
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:max-w-4xl rounded-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                        {animal ? 'Edit Animal' : 'Add New Animal'}
                        <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {animal ? 'Update existing record' : 'Create new record'}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Accordion type="multiple" className="w-full" defaultValue={['basic', 'physical', 'status']}>
                        {/* Basic Information */}
                        <AccordionItem value="basic">
                            <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Basic Information
                                </h3>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="name" className="font-medium">Animal Name/ID *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Unique identifier for the animal</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="name"
                                                {...register('name')}
                                                placeholder="e.g., Specimen-001"
                                                className="pl-10 py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="species" className="font-medium">Species *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Select the animal species or add a custom one</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={selectedSpecies}
                                            onValueChange={(value) => setValue('species', value)}
                                        >
                                            <SelectTrigger className="py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Select species" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {speciesOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{option.icon}</span>
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.species && (
                                            <p className="text-sm text-red-600">{errors.species.message}</p>
                                        )}
                                    </div>

                                    {/* Custom Species Input */}
                                    {selectedSpecies === 'custom' && (
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="customSpecies" className="font-medium">Custom Species Name *</Label>
                                            <div className="relative">
                                                <Dna className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="customSpecies"
                                                    {...register('customSpecies')}
                                                    placeholder="Enter custom species name"
                                                    className="pl-10 py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {errors.customSpecies && (
                                                <p className="text-sm text-red-600">{errors.customSpecies.message}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="strain" className="font-medium">Strain *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Genetic strain of the animal</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <Dna className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="strain"
                                                {...register('strain')}
                                                placeholder="e.g., Wistar, C57BL/6"
                                                className="pl-10 py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {errors.strain && (
                                            <p className="text-sm text-red-600">{errors.strain.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="location" className="font-medium">Location *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Current housing location of the animal</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="location"
                                                {...register('location')}
                                                placeholder="e.g., Cage A-101"
                                                className="pl-10 py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {errors.location && (
                                            <p className="text-sm text-red-600">{errors.location.message}</p>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Physical Characteristics */}
                        <AccordionItem value="physical">
                            <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Scale className="h-5 w-5" />
                                    Physical Characteristics
                                </h3>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="age" className="font-medium">Age (weeks) *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Age in weeks from date of birth</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="age"
                                                type="number"
                                                {...register('age', { valueAsNumber: true })}
                                                min="0"
                                                className="pl-10 py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {errors.age && (
                                            <p className="text-sm text-red-600">{errors.age.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="weight" className="font-medium">Weight (grams) *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Current weight in grams</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="weight"
                                                type="number"
                                                {...register('weight', { valueAsNumber: true })}
                                                min="0"
                                                className="pl-10 py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        {errors.weight && (
                                            <p className="text-sm text-red-600">{errors.weight.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="font-medium">Gender *</Label>
                                        <RadioGroup
                                            defaultValue="male"
                                            onValueChange={(value) => setValue('gender', value)}
                                            className="flex flex-wrap gap-6 pt-2"
                                        >
                                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <RadioGroupItem value="male" id="male" />
                                                <Label htmlFor="male" className="flex items-center gap-2">
                                                    <span className="text-xl">♂</span>
                                                    Male
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <RadioGroupItem value="female" id="female" />
                                                <Label htmlFor="female" className="flex items-center gap-2">
                                                    <span className="text-xl">♀</span>
                                                    Female
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                        {errors.gender && (
                                            <p className="text-sm text-red-600">{errors.gender.message}</p>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Status and Health */}
                        <AccordionItem value="status">
                            <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    Status & Health
                                </h3>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="status" className="font-medium">Status *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Current operational status of the animal</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={selectedStatus}
                                            onValueChange={(value) => setValue('status', value)}
                                        >
                                            <SelectTrigger className="py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex flex-col">
                                                            <span>{option.label}</span>
                                                            <span className="text-xs text-gray-500">{option.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600">{errors.status.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="healthStatus" className="font-medium">Health Status *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Overall health condition of the animal</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            onValueChange={(value) => setValue('healthStatus', value)}
                                            defaultValue="good"
                                        >
                                            <SelectTrigger className="py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Select health status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {HEALTH_STATUS_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 ${option.color} rounded-full`}></div>
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.healthStatus && (
                                            <p className="text-sm text-red-600">{errors.healthStatus.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="dateOfBirth" className="font-medium">Date of Birth *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Animal's date of birth</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                {...register('dateOfBirth')}
                                                className="py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                        {errors.dateOfBirth && (
                                            <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:col-span-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="lastHealthCheck" className="font-medium">Last Health Check</Label>
                                            <div className="relative">
                                                <Input
                                                    id="lastHealthCheck"
                                                    type="date"
                                                    {...register('lastHealthCheck')}
                                                    className="py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <Heart className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nextHealthCheck" className="font-medium">Next Health Check</Label>
                                            <div className="relative">
                                                <Input
                                                    id="nextHealthCheck"
                                                    type="date"
                                                    {...register('nextHealthCheck')}
                                                    className="py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <Heart className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Experiments */}
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FlaskConical className="h-5 w-5" />
                            Associated Experiments
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-2 flex-col sm:flex-row">
                                <Input
                                    value={newExperiment}
                                    onChange={(e) => setNewExperiment(e.target.value)}
                                    placeholder="Add experiment ID (e.g., EXP-001)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addExperiment();
                                        }
                                    }}
                                    className="flex-1 py-5 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <Button type="button" onClick={addExperiment} variant="outline" className="w-full sm:w-auto border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-5">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </div>
                            {experiments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {experiments.map((exp, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm">
                                            {exp}
                                            <button
                                                type="button"
                                                onClick={() => removeExperiment(exp)}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="font-medium">Notes</Label>
                        <Textarea
                            id="notes"
                            {...register('notes')}
                            placeholder="Additional information about the animal (e.g., special care requirements, behavioral observations)"
                            rows={4}
                            className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-5">
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-5">
                            {animal ? 'Update Animal' : 'Add Animal'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}