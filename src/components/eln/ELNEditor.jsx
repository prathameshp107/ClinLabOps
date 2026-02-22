'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Code,
    Image,
    Save,
    Users,
    History
} from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';

const ELNEditor = ({
    elnEntry = null,
    onSave,
    onCancel,
    projectId = null,
    experimentId = null,
    collaborators = []
}) => {
    const [title, setTitle] = useState(elnEntry?.title || '');
    const [content, setContent] = useState(elnEntry?.content || '');
    const [status, setStatus] = useState(elnEntry?.status || 'draft');
    const [tags, setTags] = useState(elnEntry?.tags?.join(', ') || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [isCollaborating, setIsCollaborating] = useState(false);

    const docRef = useRef(null);
    const awarenessRef = useRef(null);
    const socketRef = useRef(null);
    const providerRef = useRef(null);

    // Handle connection to awareness
    const handleConnect = useCallback((awareness) => {
        if (awareness) {
            awarenessRef.current = awareness;

            // Listen for awareness changes
            awareness.on('change', () => {
                const states = Array.from(awareness.getStates().values())
                    .map(state => state.user)
                    .filter(Boolean);
                setConnectedUsers(states);
            });

            setIsCollaborating(true);
        }
    }, []);

    // Handle disconnection
    const handleDisconnect = useCallback(() => {
        setIsCollaborating(false);
        setConnectedUsers([]);
    }, []);

    // Initialize collaboration when entry is ready
    useEffect(() => {
        // Nothing to do here anymore - CollaborativeEditor handles its own initialization
    }, [elnEntry?._id]);

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const elnData = {
                title: title.trim(),
                content: content,
                projectId: projectId || elnEntry?.projectId,
                experimentId: experimentId || elnEntry?.experimentId,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                status,
            };

            if (elnEntry?._id) {
                // Update existing entry
                await onSave(elnEntry._id, elnData);
            } else {
                // Create new entry
                await onSave(null, elnData);
            }

            setSuccess(elnEntry?._id ? 'ELN entry updated successfully!' : 'ELN entry created successfully!');
        } catch (err) {
            setError(err.message || 'An error occurred while saving');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const addTag = () => {
        const newTag = prompt('Enter a new tag:');
        if (newTag && !tags.includes(newTag)) {
            setTags(prev => prev ? `${prev}, ${newTag}` : newTag);
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Bar */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Badge variant={status === 'draft' ? 'secondary' :
                        status === 'in-review' ? 'default' :
                            status === 'approved' ? 'success' : 'outline'}>
                        {status.replace('-', ' ')}
                    </Badge>

                    {isCollaborating && (
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">
                                {connectedUsers.length} user{connectedUsers.length !== 1 ? 's' : ''} online
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : (elnEntry?._id ? 'Update' : 'Create')}
                    </Button>
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Title Input */}
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter ELN entry title"
                    disabled={isLoading}
                />
            </div>

            {/* Status Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        disabled={isLoading}
                    >
                        <option value="draft">Draft</option>
                        <option value="in-review">In Review</option>
                        <option value="approved">Approved</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex space-x-2">
                        <Input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Enter tags separated by commas"
                            disabled={isLoading}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={addTag}>
                            +
                        </Button>
                    </div>
                </div>
            </div>

            {/* Rich Text Editor */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                        <span>Lab Notes</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CollaborativeEditor
                        content={content}
                        onUpdate={setContent}
                        elnId={elnEntry?._id}
                        onConnect={handleConnect}
                        onDisconnect={handleDisconnect}
                        userName={localStorage.getItem('userName') || 'Anonymous'}
                    />
                </CardContent>
            </Card>

            {/* Collaborators Section */}
            {elnEntry?._id && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            Collaborators
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {collaborators?.map((collaborator) => (
                                <Badge key={collaborator._id} variant="outline">
                                    {collaborator.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ELNEditor;