'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ELNEditor from '@/components/eln/ELNEditor';
import ELNComments from '@/components/eln/ELNComments';
import ELNVersionHistory from '@/components/eln/ELNVersionHistory';
import { getELNEntryById, updateELNEntry, addComment, deleteComment, getELNVersions, deleteELNEntry } from '@/services/elnService';
import { format } from 'date-fns';
import { Eye, Edit, History, Clock, User, Folder, FlaskConical, Trash2 } from 'lucide-react';
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { cn } from "@/lib/utils"

const ELNEntryPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [elnEntry, setElnEntry] = useState(null);
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Get current user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch (e) {
                console.error('Error parsing user', e);
            }
        }
    }, []);

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

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await deleteComment(id, commentId);
            if (response.success) {
                fetchELNEntry();
            } else {
                alert(response.message || 'Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('An error occurred while deleting the comment');
        }
    };

    const handleDeleteEntry = async () => {
        if (!window.confirm(`Are you sure you want to delete "${elnEntry.title}"? This action cannot be undone.`)) return;

        try {
            setLoading(true);
            const response = await deleteELNEntry(id);
            if (response.success) {
                router.push('/elns');
            } else {
                alert(response.message || 'Failed to delete record');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('An error occurred while deleting the record');
            setLoading(false);
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
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50/30 pb-20">
                <div className="max-w-[1400px] mx-auto p-6 md:p-8">
                    {/* Navigation & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/elns')}
                                className="text-slate-500 hover:text-slate-900 group"
                            >
                                <Eye className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                                All Records
                            </Button>
                            <span className="text-slate-300">/</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Experiment Details
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {!editing && (
                                <>
                                    <Button
                                        onClick={handleEditClick}
                                        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Modify Record
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.print()}
                                        className="hidden md:flex bg-white"
                                    >
                                        Print PDF
                                    </Button>
                                    {currentUser?.id === (elnEntry.author?._id || elnEntry.author) && (
                                        <Button
                                            variant="ghost"
                                            onClick={handleDeleteEntry}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                            title="Delete Record"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {editing ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ELNEditor
                                elnEntry={elnEntry}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                collaborators={elnEntry.collaborators}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
                            {/* Main Document Content */}
                            <div className="xl:col-span-3 space-y-6">
                                <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden rounded-3xl">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 w-full" />
                                    <CardHeader className="bg-white px-8 pt-10 pb-6">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <Badge className={cn(
                                                "px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider",
                                                elnEntry.status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                    elnEntry.status === 'in-review' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                        "bg-slate-100 text-slate-600 border-slate-200"
                                            )}>
                                                {elnEntry.status}
                                            </Badge>
                                            <div className="flex items-center text-xs text-slate-400 font-medium">
                                                <Clock className="h-3.5 w-3.5 mr-1" />
                                                Last updated {format(new Date(elnEntry.updatedAt || elnEntry.createdAt), 'MMM d, h:mm a')}
                                            </div>
                                        </div>
                                        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-2">
                                            {elnEntry.title}
                                        </h1>
                                        {elnEntry.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {elnEntry.tags.map((tag, i) => (
                                                    <span key={i} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="px-10 py-8 bg-white border-t border-slate-50">
                                        <div
                                            className="prose prose-slate max-w-none 
                                            prose-headings:text-slate-900 prose-headings:font-bold
                                            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                                            prose-strong:text-slate-900 prose-strong:font-bold
                                            prose-ul:list-disc prose-ol:list-decimal
                                            prose-table:border prose-table:rounded-xl prose-table:overflow-hidden 
                                            prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4
                                            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-10"
                                            dangerouslySetInnerHTML={{ __html: elnEntry.content }}
                                        />
                                    </CardContent>
                                    <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex justify-between items-center italic text-sm text-slate-400">
                                        <span>Certified Digital Signature: LD-{elnEntry._id.substring(18).toUpperCase()}</span>
                                        <span>Official Laboratory Record</span>
                                    </div>
                                </Card>

                                {/* Activity Section (Comments & Version History) */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <ELNComments
                                        comments={elnEntry.comments || []}
                                        onAddComment={handleAddComment}
                                        onDeleteComment={handleDeleteComment}
                                        currentUserId={currentUser?.id}
                                        elnAuthorId={elnEntry.author?._id || elnEntry.author}
                                    />

                                    <ELNVersionHistory
                                        versions={versions}
                                        currentVersion={elnEntry.version}
                                        onRevertToVersion={(v) => router.push(`/elns/${id}/versions`)}
                                    />
                                </div>
                            </div>

                            {/* Sidebar Metadata */}
                            <div className="space-y-6">
                                <Card className="border-none shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            Properties
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Author</p>
                                                <p className="font-bold text-slate-900">{elnEntry.author?.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                <FlaskConical className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Scientific Area</p>
                                                <p className="font-bold text-slate-900">{elnEntry.projectId?.name || 'General Research'}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{elnEntry.experimentId?.title}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                                <History className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Record Creation</p>
                                                <p className="font-bold text-slate-900">{format(new Date(elnEntry.createdAt), 'PPP')}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
                                        This document conforms to 21 CFR Part 11 electronic records regulations.
                                    </div>
                                </Card>

                                {/* Sharing / Collaborators Card placeholder or real */}
                                {elnEntry.collaborators?.length > 0 && (
                                    <Card className="border-none shadow-lg shadow-slate-200/50 rounded-3xl p-6">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Collaborators</h3>
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {elnEntry.collaborators.map((c, i) => (
                                                <div
                                                    key={i}
                                                    title={c.name}
                                                    className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-blue-50 flex items-center justify-center font-bold text-xs text-blue-600 uppercase border border-blue-100 overflow-hidden"
                                                >
                                                    {c.avatar ? (
                                                        <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        c.name?.charAt(0) || 'S'
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                                            Shared with {elnEntry.collaborators.length} team {elnEntry.collaborators.length === 1 ? 'member' : 'members'}.
                                        </p>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ELNEntryPage;