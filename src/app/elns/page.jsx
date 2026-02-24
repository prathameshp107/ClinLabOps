'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ELNList from '@/components/eln/ELNList';
import { getELNEntries, searchELNEntries, deleteELNEntry } from '@/services/elnService';
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

const ELNDashboardPage = () => {
    const router = useRouter();
    const [elnEntries, setElnEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchELNEntries();
    }, []);

    const fetchELNEntries = async () => {
        try {
            setLoading(true);
            const response = await getELNEntries();
            if (response.success) {
                setElnEntries(response.data);
            }
        } catch (error) {
            console.error('Error fetching ELN entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term) => {
        setSearchTerm(term);

        if (term.trim()) {
            try {
                setLoading(true);
                const response = await searchELNEntries(term);
                if (response.success) {
                    setElnEntries(response.data);
                }
            } catch (error) {
                console.error('Error searching ELN entries:', error);
            } finally {
                setLoading(false);
            }
        } else {
            // If search term is cleared, fetch all entries again
            fetchELNEntries();
        }
    };

    const handleCreateNew = () => {
        router.push('/elns/new');
    };

    const handleEdit = (entry) => {
        router.push(`/elns/${entry._id}`);
    };

    const handleDelete = async (entry) => {
        if (window.confirm(`Are you sure you want to delete "${entry.title}"?`)) {
            try {
                const result = await deleteELNEntry(entry._id);

                if (result.success) {
                    setElnEntries(elnEntries.filter(e => e._id !== entry._id));
                } else {
                    alert(result.message || 'Failed to delete ELN entry');
                }
            } catch (error) {
                console.error('Error deleting ELN entry:', error);
                alert('An error occurred while deleting the ELN entry');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50/30">
                <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                                <span className="w-8 h-[2px] bg-blue-600" />
                                Scientific Records
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                Electronic Lab <span className="text-blue-600">Notebook</span>
                            </h1>
                            <p className="text-slate-500 max-w-2xl text-lg font-medium">
                                Professional documentation for laboratory experiments, research findings, and collaborative investigations.
                            </p>
                        </div>
                    </div>

                    <ELNList
                        elnEntries={elnEntries}
                        loading={loading}
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        onCreateNew={handleCreateNew}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ELNDashboardPage;