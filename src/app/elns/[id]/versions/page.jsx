'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ELNVersionHistory from '@/components/eln/ELNVersionHistory';
import { getELNEntryById, getELNVersions } from '@/services/elnService';
import { ArrowLeft, History } from 'lucide-react';

const ELNVersionHistoryPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [elnEntry, setElnEntry] = useState(null);
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchELNEntry();
            fetchVersions();
        }
    }, [id]);

    const fetchELNEntry = async () => {
        try {
            const response = await getELNEntryById(id);
            if (response.success) {
                setElnEntry(response.data);
            }
        } catch (error) {
            console.error('Error fetching ELN entry:', error);
        }
    };

    const fetchVersions = async () => {
        try {
            const response = await getELNVersions(id);
            if (response.success) {
                setVersions(response.data);
            }
        } catch (error) {
            console.error('Error fetching versions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRevertToVersion = async (version) => {
        if (window.confirm(`Are you sure you want to revert to version ${version.versionNumber}?`)) {
            // In a real implementation, this would call an API to revert to the specific version
            alert(`This would revert the ELN entry to version ${version.versionNumber} in a real implementation`);
        }
    };

    if (loading && !elnEntry) {
        return (
            <div className="container mx-auto py-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Version History</h1>
                        <p className="text-muted-foreground mt-1">
                            {elnEntry?.title || 'ELN Entry'} • {versions.length} versions
                        </p>
                    </div>
                </div>
            </div>

            {/* Version History Component */}
            <ELNVersionHistory
                versions={versions}
                currentVersion={elnEntry?.version}
                onRevertToVersion={handleRevertToVersion}
                loading={loading}
            />

            {/* Quick Actions */}
            <div className="mt-6 flex justify-end">
                <Button
                    onClick={() => router.push(`/elns/${id}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <History className="h-4 w-4 mr-2" />
                    Back to Entry
                </Button>
            </div>
        </div>
    );
};

export default ELNVersionHistoryPage;