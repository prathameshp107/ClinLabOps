'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    Search,
    FileText,
    Clock,
    User,
    Eye,
    Edit,
    Trash2,
    Plus,
    Calendar,
    Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ELNList = ({
    elnEntries = [],
    onEdit,
    onDelete,
    onCreateNew,
    loading = false,
    onSearch,
    searchTerm = ''
}) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setLocalSearchTerm(term);
        if (onSearch) {
            onSearch(term);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'draft':
                return 'secondary';
            case 'in-review':
                return 'default';
            case 'approved':
                return 'success';
            case 'published':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const formatDate = (dateString) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };

    return (
        <div className="space-y-6">
            {/* Search and Create Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search ELN entries..."
                        value={localSearchTerm}
                        onChange={handleSearchChange}
                        className="pl-8 w-full sm:w-80"
                    />
                </div>
                <Button
                    onClick={onCreateNew}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New ELN Entry
                </Button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </CardContent>
                            <CardFooter className="justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* ELN Entries List */}
            {!loading && (
                <div className="space-y-4">
                    {elnEntries.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No ELN entries found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm
                                        ? 'No entries match your search criteria.'
                                        : 'Get started by creating your first ELN entry.'}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={onCreateNew}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Entry
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        elnEntries.map((entry) => (
                            <Card key={entry._id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto text-lg font-bold"
                                                onClick={() => onEdit(entry)}
                                            >
                                                {entry.title}
                                            </Button>
                                        </CardTitle>
                                        <Badge variant={getStatusVariant(entry.status)}>
                                            {entry.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-2">
                                    <div
                                        className="text-muted-foreground line-clamp-2 max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: entry.content?.substring(0, 200) + (entry.content?.length > 200 ? '...' : '')
                                        }}
                                    />

                                    {/* Tags */}
                                    {entry.tags && entry.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {entry.tags.slice(0, 3).map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {entry.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{entry.tags.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2">
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2 sm:mb-0">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-1" />
                                            <span>{entry.author?.name || 'Unknown'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{formatDate(entry.createdAt)}</span>
                                        </div>

                                        {entry.updatedAt !== entry.createdAt && (
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>Updated {formatDate(entry.updatedAt)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(entry)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(entry)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ELNList;