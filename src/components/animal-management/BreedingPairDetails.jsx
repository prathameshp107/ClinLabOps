'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Baby } from 'lucide-react';
import { breedingService } from '@/services/breedingService';

export function BreedingPairDetails({ isOpen, onClose, breedingPair, onEdit, onDelete, animals }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [availableMales, setAvailableMales] = useState([]);
    const [availableFemales, setAvailableFemales] = useState([]);

    useEffect(() => {
        if (breedingPair) {
            setEditedData({
                maleId: breedingPair.maleId,
                femaleId: breedingPair.femaleId,
                startDate: new Date(breedingPair.startDate).toISOString().split('T')[0],
                expectedDelivery: new Date(breedingPair.expectedDelivery).toISOString().split('T')[0],
                notes: breedingPair.notes || ''
            });
        }
    }, [breedingPair]);

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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const updatedPair = await breedingService.updateBreedingPair(breedingPair._id, editedData);
            onEdit(updatedPair);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating breeding pair:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await breedingService.deleteBreedingPair(breedingPair._id);
            onDelete(breedingPair._id);
            onClose();
        } catch (error) {
            console.error('Error deleting breeding pair:', error);
        }
    };

    const handleChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!breedingPair) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Breeding Pair' : 'Breeding Pair Details'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {!isEditing ? (
                        // View mode
                        <>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                        Pair {breedingPair._id.substring(0, 8)}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        <span className="font-medium">{breedingPair.maleName}</span> +{' '}
                                        <span className="font-medium">{breedingPair.femaleName}</span>
                                    </p>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                    {breedingPair.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">Start Date</span>
                                    </div>
                                    <p className="font-medium">
                                        {new Date(breedingPair.startDate).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">Expected Delivery</span>
                                    </div>
                                    <p className="font-medium">
                                        {new Date(breedingPair.expectedDelivery).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Baby className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">Offspring</span>
                                    </div>
                                    <p className="font-medium">{breedingPair.offspringCount || 0}</p>
                                </div>
                            </div>

                            {breedingPair.notes && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <span className="font-medium text-gray-600 dark:text-gray-400 text-sm block mb-2">Notes</span>
                                    <p className="font-medium">{breedingPair.notes}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        // Edit mode
                        <>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Male Animal</label>
                                    <select
                                        value={editedData.maleId}
                                        onChange={(e) => handleChange('maleId', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                                    >
                                        <option value="">Select male animal</option>
                                        {availableMales.map(animal => (
                                            <option key={animal._id} value={animal._id}>
                                                {animal.name} ({animal.species})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Female Animal</label>
                                    <select
                                        value={editedData.femaleId}
                                        onChange={(e) => handleChange('femaleId', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                                    >
                                        <option value="">Select female animal</option>
                                        {availableFemales.map(animal => (
                                            <option key={animal._id} value={animal._id}>
                                                {animal.name} ({animal.species})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                        <input
                                            type="date"
                                            value={editedData.startDate}
                                            onChange={(e) => handleChange('startDate', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery</label>
                                        <input
                                            type="date"
                                            value={editedData.expectedDelivery}
                                            onChange={(e) => handleChange('expectedDelivery', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                                    <textarea
                                        value={editedData.notes || ''}
                                        onChange={(e) => handleChange('notes', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        {!isEditing ? (
                            <>
                                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                                    Close
                                </Button>
                                <Button variant="outline" onClick={handleEdit} className="w-full sm:w-auto flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="w-full sm:w-auto">
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}