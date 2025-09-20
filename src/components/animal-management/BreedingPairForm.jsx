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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';

const breedingPairSchema = z.object({
    maleId: z.string().min(1, 'Male animal is required'),
    femaleId: z.string().min(1, 'Female animal is required'),
    startDate: z.string().min(1, 'Start date is required'),
    expectedDelivery: z.string().min(1, 'Expected delivery date is required'),
    notes: z.string().optional(),
});

export function BreedingPairForm({ isOpen, onClose, onSave, animals }) {
    const [availableMales, setAvailableMales] = useState([]);
    const [availableFemales, setAvailableFemales] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(breedingPairSchema),
        defaultValues: {
            maleId: '',
            femaleId: '',
            startDate: '',
            expectedDelivery: '',
            notes: '',
        },
    });

    useEffect(() => {
        if (animals && animals.length > 0) {
            // Filter out animals without valid _id properties
            const validAnimals = animals.filter(animal => animal._id);
            const males = validAnimals.filter(animal => animal.gender === 'male' && animal.status === 'active');
            const females = validAnimals.filter(animal => animal.gender === 'female' && animal.status === 'active');
            setAvailableMales(males);
            setAvailableFemales(females);
        }
    }, [animals]);

    useEffect(() => {
        if (isOpen) {
            reset({
                maleId: '',
                femaleId: '',
                startDate: '',
                expectedDelivery: '',
                notes: '',
            });
        }
    }, [isOpen, reset]);

    const onSubmit = (data) => {
        // Send only the required data to the backend
        onSave(data);
        handleClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Breeding Pair</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="maleId">Male Animal *</Label>
                        <Select
                            onValueChange={(value) => setValue('maleId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select male animal" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMales
                                    .filter(animal => animal._id) // Filter out animals without valid _id
                                    .map((animal) => (
                                        <SelectItem key={animal._id} value={animal._id}>
                                            {animal.name} ({animal.species})
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {errors.maleId && (
                            <p className="text-sm text-red-600">{errors.maleId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="femaleId">Female Animal *</Label>
                        <Select
                            onValueChange={(value) => setValue('femaleId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select female animal" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableFemales
                                    .filter(animal => animal._id) // Filter out animals without valid _id
                                    .map((animal) => (
                                        <SelectItem key={animal._id} value={animal._id}>
                                            {animal.name} ({animal.species})
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {errors.femaleId && (
                            <p className="text-sm text-red-600">{errors.femaleId.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <div className="relative">
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register('startDate')}
                                />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            {errors.startDate && (
                                <p className="text-sm text-red-600">{errors.startDate.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expectedDelivery">Expected Delivery *</Label>
                            <div className="relative">
                                <Input
                                    id="expectedDelivery"
                                    type="date"
                                    {...register('expectedDelivery')}
                                />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            {errors.expectedDelivery && (
                                <p className="text-sm text-red-600">{errors.expectedDelivery.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            {...register('notes')}
                            placeholder="Additional information"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">
                            Create Breeding Pair
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}