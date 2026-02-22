'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ELNEditor from '@/components/eln/ELNEditor';
import { createELNEntry } from '@/services/elnService';

const NewELNPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSave = async (id, elnData) => {
        try {
            setLoading(true);
            const response = await createELNEntry(elnData);

            if (response.success) {
                router.push(`/elns/${response.data._id}`);
                router.refresh();
            } else {
                alert(response.message || 'Failed to create ELN entry');
            }
        } catch (error) {
            console.error('Error creating ELN entry:', error);
            alert('An error occurred while creating the ELN entry');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Create New ELN Entry</h1>
                <p className="text-muted-foreground mt-2">
                    Create a new electronic lab notebook entry
                </p>
            </div>

            <ELNEditor
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={loading}
            />
        </div>
    );
};

export default NewELNPage;