'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { History, Clock, User, FileText, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
        const c = (changes || '').toLowerCase();
        if (c.includes('initial')) return 'creation';
        if (c.includes('publish') || c.includes('approve')) return 'milestone';
        return 'revision';
    };

    const getVersionTheme = (type, isCurrent) => {
        if (isCurrent) return {
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            dot: 'bg-emerald-500'
        };

        switch (type) {
            case 'creation':
                return {
                    icon: <FlaskConical className="h-4 w-4" />,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-100',
                    dot: 'bg-blue-500'
                };
            case 'milestone':
                return {
                    icon: <History className="h-4 w-4" />,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                    border: 'border-purple-100',
                    dot: 'bg-purple-500'
                };
            default:
                return {
                    icon: <Clock className="h-4 w-4" />,
                    color: 'text-slate-600',
                    bg: 'bg-slate-50',
                    border: 'border-slate-100',
                    dot: 'bg-slate-400'
                };
        }
    };

    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 px-8 py-6">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl">
                            <History className="h-5 w-5 text-slate-600" />
                        </div>
                        <span className="text-lg font-extrabold text-slate-900 tracking-tight">Version Audit Trail</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-8">
                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-8 h-8 bg-slate-100 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                                    <div className="h-10 bg-slate-50 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : versions.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm font-bold">No Records Found</p>
                    </div>
                ) : (
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-100 before:to-transparent">
                        {versions.map((version, idx) => {
                            const isCurrent = version.versionNumber === currentVersion;
                            const type = getVersionType(version.changes);
                            const theme = getVersionTheme(type, isCurrent);

                            return (
                                <div key={version._id} className="relative flex items-start gap-6 group">
                                    {/* Timeline Marker */}
                                    <div className={cn(
                                        "absolute left-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                                        theme.bg,
                                        theme.color
                                    )}>
                                        {theme.icon}
                                    </div>

                                    <div className="flex-1 ml-4">
                                        <div className={cn(
                                            "flex flex-col bg-white p-5 rounded-2xl border transition-all duration-300",
                                            isCurrent ? "border-emerald-200 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-50" : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                                        )}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-black text-slate-900">v{version.versionNumber}.0</span>
                                                        {isCurrent && (
                                                            <Badge className="bg-emerald-500 text-[10px] font-bold h-5 px-2">ACTIVE</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-medium">{formatDate(version.timestamp || version.createdAt)}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {!isCurrent && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onRevertToVersion && onRevertToVersion(version)}
                                                            className="h-8 px-3 rounded-xl text-[10px] font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all"
                                                        >
                                                            <RotateCcw className="h-3 w-3 mr-1.5" />
                                                            Rollback
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-4">
                                                <Avatar className="h-6 w-6 border border-white shadow-sm">
                                                    <AvatarImage src={version.author?.avatar} />
                                                    <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-600">
                                                        {version.author?.name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-[11px] font-bold text-slate-600">{version.author?.name}</span>
                                                <span className="text-slate-200 h-3 w-[1px] bg-slate-200" />
                                                <span className="text-[10px] font-medium text-slate-400 italic">"{version.changes || 'Document updated'}"</span>
                                            </div>

                                            <button
                                                onClick={() => setExpandedVersion(expandedVersion === version._id ? null : version._id)}
                                                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors group/toggle"
                                            >
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Snippet Preview</span>
                                                {expandedVersion === version._id ? <ChevronUp className="h-3 w-3 text-slate-400" /> : <ChevronDown className="h-3 w-3 text-slate-400 group-hover/toggle:translate-y-0.5 transition-transform" />}
                                            </button>

                                            <AnimatePresence>
                                                {expandedVersion === version._id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-400 font-mono text-[11px] leading-relaxed border-l-4 border-blue-500">
                                                            <div
                                                                dangerouslySetInnerHTML={{ __html: (version.content || '').substring(0, 400).replace(/<[^>]*>?/gm, ' ') + '...' }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Immunized Audit Stream Active</span>
            </div>
        </Card>
    );
};

export default ELNVersionHistory;
