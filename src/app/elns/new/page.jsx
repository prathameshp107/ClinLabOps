'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ELNEditor from '@/components/eln/ELNEditor';
import { createELNEntry } from '@/services/elnService';
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

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
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50/30 pb-20">
                <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-in fade-in duration-700">
                    <ELNEditor
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isLoading={loading}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NewELNPage;