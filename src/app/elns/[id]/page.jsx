'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ELNEditor from '@/components/eln/ELNEditor';
import ELNComments from '@/components/eln/ELNComments';
import ELNVersionHistory from '@/components/eln/ELNVersionHistory';
import { getELNEntryById, updateELNEntry, addComment, getELNVersions } from '@/services/elnService';
import { format } from 'date-fns';
import { Eye, Edit, History, Clock, User, Folder, FlaskConical } from 'lucide-react';

const ELNEntryPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [elnEntry, setElnEntry] = useState(null);
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (id) {
            fetchELNEntry();
            fetchVersions();
        }
    }, [id]);

    const fetchELNEntry = async () => {
        try {
            setLoading(true);
            const response = await getELNEntryById(id);
            if (response.success) {
                setElnEntry(response.data);
                // Fetch comments separately if needed
                // For now, we'll assume comments are populated in the backend
            }
        } catch (error) {
            console.error('Error fetching ELN entry:', error);
        } finally {
            setLoading(false);
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
        }
    };

    const handleSave = async (id, elnData) => {
        try {
            setLoading(true);
            const response = await updateELNEntry(id, elnData);

            if (response.success) {
                setElnEntry(response.data);
                setEditing(false);
                // Refresh versions after update
                fetchVersions();
            } else {
                alert(response.message || 'Failed to update ELN entry');
            }
        } catch (error) {
            console.error('Error updating ELN entry:', error);
            alert('An error occurred while updating the ELN entry');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleAddComment = async (content, parentId) => {
        try {
            const response = await addComment(id, content, parentId);
            if (response.success) {
                // Refresh the entry to get updated comments
                fetchELNEntry();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('An error occurred while adding the comment');
        }
    };

    if (loading && !elnEntry) {
        return (
            <div className="container mx-auto py-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!elnEntry) {
        return (
            <div className="container mx-auto py-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">ELN Entry Not Found</h2>
                    <p className="text-muted-foreground mt-2">The requested ELN entry could not be found.</p>
                    <Button
                        onClick={() => router.push('/elns')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                        Back to ELN Entries
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{elnEntry.title}</h1>
                        <div className="flex items-center space-x-4 mt-2">
                            <Badge variant={
                                elnEntry.status === 'draft' ? 'secondary' :
                                    elnEntry.status === 'in-review' ? 'default' :
                                        elnEntry.status === 'approved' ? 'success' : 'outline'
                            }>
                                {elnEntry.status.replace('-', ' ')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                Created {format(new Date(elnEntry.createdAt), 'MMM d, yyyy')} by {elnEntry.author?.name}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {!editing && (
                            <Button onClick={handleEditClick} className="bg-blue-600 hover:bg-blue-700">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => router.push('/elns')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                        </Button>
                    </div>
                </div>
            </div>

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Created</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {format(new Date(elnEntry.createdAt), 'PPP')}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Author</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {elnEntry.author?.name}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Project/Experiment</CardTitle>
                        <FlaskConical className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {elnEntry.projectId?.name || 'None'} / {elnEntry.experimentId?.title || 'None'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tags */}
            {elnEntry.tags && elnEntry.tags.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {elnEntry.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Editor or Viewer */}
            <div className="mb-8">
                {editing ? (
                    <ELNEditor
                        elnEntry={elnEntry}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        collaborators={elnEntry.collaborators}
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Lab Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: elnEntry.content }}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Comments and Version History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ELNComments
                    comments={elnEntry.comments || []}
                    onAddComment={handleAddComment}
                    currentUserId={elnEntry.author?._id}
                    currentUser={elnEntry.author}
                />

                <ELNVersionHistory
                    versions={versions}
                    currentVersion={elnEntry.version}
                />
            </div>
        </div>
    );
};

export default ELNEntryPage;