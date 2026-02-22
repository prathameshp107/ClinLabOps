'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { History, Clock, User, FileText, RotateCcw } from 'lucide-react';

const ELNVersionHistory = ({
    versions = [],
    currentVersion,
    onRevertToVersion,
    loading = false
}) => {
    const [expandedVersion, setExpandedVersion] = useState(null);

    const formatDate = (dateString) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };

    const getVersionType = (changes) => {
        if (changes.toLowerCase().includes('initial')) return 'created';
        if (changes.toLowerCase().includes('content')) return 'updated';
        if (changes.toLowerCase().includes('field')) return 'modified';
        return 'updated';
    };

    const getVersionIcon = (type) => {
        switch (type) {
            case 'created':
                return <FileText className="h-4 w-4" />;
            case 'updated':
                return <Clock className="h-4 w-4" />;
            case 'modified':
                return <RotateCcw className="h-4 w-4" />;
            default:
                return <History className="h-4 w-4" />;
        }
    };

    const getVersionColor = (type, versionNumber) => {
        if (versionNumber === currentVersion) return 'bg-blue-100 text-blue-800';
        switch (type) {
            case 'created':
                return 'bg-green-100 text-green-800';
            case 'updated':
                return 'bg-yellow-100 text-yellow-800';
            case 'modified':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Version History
                    {versions.length > 0 && (
                        <Badge variant="outline" className="ml-2">
                            {versions.length} versions
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 animate-pulse">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : versions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No version history available</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {versions.map((version) => {
                            const type = getVersionType(version.changes);
                            const isCurrent = version.versionNumber === currentVersion;

                            return (
                                <div
                                    key={version._id}
                                    className={`border rounded-lg p-4 ${isCurrent ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <Badge
                                                variant="secondary"
                                                className={`${getVersionColor(type, version.versionNumber)} px-2 py-1`}
                                            >
                                                {getVersionIcon(type)}
                                                <span className="ml-1">v{version.versionNumber}</span>
                                            </Badge>

                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={version.author?.avatar} alt={version.author?.name} />
                                                        <AvatarFallback>
                                                            {version.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-sm">
                                                        {version.author?.name || 'Unknown'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {formatDate(version.timestamp || version.createdAt)} • {version.changes}
                                                </div>
                                            </div>
                                        </div>

                                        {isCurrent ? (
                                            <Badge variant="default">Current</Badge>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onRevertToVersion && onRevertToVersion(version)}
                                                disabled={!onRevertToVersion}
                                            >
                                                <RotateCcw className="h-3 w-3 mr-1" />
                                                Revert
                                            </Button>
                                        )}
                                    </div>

                                    {/* Expandable content preview */}
                                    <div className="mt-3">
                                        <button
                                            onClick={() => setExpandedVersion(
                                                expandedVersion === version._id ? null : version._id
                                            )}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            {expandedVersion === version._id ? 'Show Less' : 'Show Content Preview'}
                                        </button>

                                        {expandedVersion === version._id && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded border">
                                                <div
                                                    className="text-sm max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: version.content.substring(0, 300) + '...' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ELNVersionHistory;