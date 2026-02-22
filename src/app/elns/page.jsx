'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ELNList from '@/components/eln/ELNList';
import { getELNEntries, searchELNEntries } from '@/services/elnService';

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
                const response = await fetch(`/api/elns/${entry._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();
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
        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Electronic Lab Notebook</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your laboratory notes and experiments in a collaborative environment
                </p>
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
    );
};

export default ELNDashboardPage;