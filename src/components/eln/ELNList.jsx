'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Tag,
    ChevronRight,
    Filter,
    ArrowUpRight,
    Beaker,
    CheckCircle2,
    AlertCircle,
    Archive
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [filterStatus, setFilterStatus] = useState('all');

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

    const stats = useMemo(() => {
        return {
            total: elnEntries.length,
            draft: elnEntries.filter(e => e.status === 'draft').length,
            approved: elnEntries.filter(e => e.status === 'approved').length,
            inReview: elnEntries.filter(e => e.status === 'in-review').length,
        };
    }, [elnEntries]);

    const filteredEntries = useMemo(() => {
        return elnEntries.filter(e => {
            const matchesSearch = e.title.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
                e.author?.name?.toLowerCase().includes(localSearchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [elnEntries, localSearchTerm, filterStatus]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'draft':
                return {
                    variant: 'secondary',
                    icon: <AlertCircle className="h-3 w-3 mr-1" />,
                    bg: 'bg-amber-50 text-amber-700 border-amber-200',
                    dot: 'bg-amber-500'
                };
            case 'in-review':
                return {
                    variant: 'default',
                    icon: <Clock className="h-3 w-3 mr-1" />,
                    bg: 'bg-blue-50 text-blue-700 border-blue-200',
                    dot: 'bg-blue-500'
                };
            case 'approved':
                return {
                    variant: 'success',
                    icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    dot: 'bg-emerald-500'
                };
            case 'published':
                return {
                    variant: 'outline',
                    icon: <Archive className="h-3 w-3 mr-1" />,
                    bg: 'bg-purple-50 text-purple-700 border-purple-200',
                    dot: 'bg-purple-500'
                };
            default:
                return {
                    variant: 'outline',
                    icon: null,
                    bg: 'bg-gray-50 text-gray-700 border-gray-200',
                    dot: 'bg-gray-500'
                };
        }
    };

    const formatDate = (dateString) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="overflow-hidden border-slate-200 animate-pulse">
                        <div className="h-48 bg-slate-100 mb-4" />
                        <CardHeader className="pt-0">
                            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Logs', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Drafts', value: stats.draft, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Under Review', value: stats.inReview, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find experiment metadata..."
                            value={localSearchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 h-10 border-slate-200 bg-slate-50/50 focus:bg-white transition-all rounded-xl"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
                        {['all', 'draft', 'approved'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                                    filterStatus === s
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <Button
                    onClick={onCreateNew}
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 h-10 px-6 rounded-xl w-full lg:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Record
                </Button>
            </div>

            {/* Entries Grid */}
            <AnimatePresence mode="popLayout">
                {filteredEntries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200"
                    >
                        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
                            <Beaker className="h-12 w-12 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Electronic Records Empty</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8">
                            {localSearchTerm || filterStatus !== 'all'
                                ? "We couldn't find any lab notes matching your current filters."
                                : "Start building your digital lab history today by creating your first entry."}
                        </p>
                        <Button onClick={onCreateNew} variant="outline" className="rounded-xl border-slate-200 px-8">
                            Initialize First Record
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredEntries.map((entry, idx) => {
                            const styles = getStatusStyles(entry.status);
                            return (
                                <motion.div
                                    key={entry._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="group h-full flex flex-col hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge className={cn("px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border", styles.bg)}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", styles.dot)} />
                                                    {entry.status}
                                                </Badge>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => onDelete(entry)} className="h-8 w-8 text-slate-400 hover:text-red-500">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardTitle
                                                className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 min-h-[3.5rem]"
                                                onClick={() => onEdit(entry)}
                                            >
                                                {entry.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex-1 pb-4">
                                            <div
                                                className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed h-[4.5rem]"
                                                dangerouslySetInnerHTML={{
                                                    __html: (entry.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
                                                }}
                                            />

                                            <div className="flex flex-wrap gap-1.5">
                                                {entry.tags?.slice(0, 3).map((tag, i) => (
                                                    <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-100 px-2">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                                {entry.tags?.length > 3 && (
                                                    <span className="text-[10px] text-slate-400 flex items-center">
                                                        +{entry.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-4 border-t border-slate-50 bg-slate-50/50 px-6 py-4 mt-auto">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-100 shadow-sm uppercase overflow-hidden">
                                                        {entry.author?.avatar ? (
                                                            <img src={entry.author.avatar} alt={entry.author.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            entry.author?.name?.charAt(0) || <User className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{entry.author?.name}</span>
                                                        <span className="text-[10px] text-slate-400">{formatDate(entry.createdAt)}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 group/btn"
                                                    onClick={() => onEdit(entry)}
                                                >
                                                    <span className="text-xs font-semibold mr-1">Open</span>
                                                    <ArrowUpRight className="h-3 w-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ELNList;
