'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Save, Users, History, FileText, CheckCircle, Clock, Tag as TagIcon,
    Beaker, Layout, Trash2, ArrowLeft, Send, Sparkles, Plus
} from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';
import { uploadFile } from '@/services/fileUploadService';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TELMPLATES = {
    'general': {
        name: 'General Lab Note',
        content: `<h1>Experimental Title</h1><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><p><strong>Objective:</strong> </p><p><strong>Procedure:</strong> </p><p><strong>Observations:</strong> </p><p><strong>Conclusion:</strong> </p>`
    },
    'experiment-protocol': {
        name: 'Experiment Protocol',
        content: `<h1>Experiment Protocol</h1><p><strong>Protocol ID:</strong> PRT-202X-</p><h2>Materials & Reagents</h2><table style="width: 100%;"><thead><tr><th>Item</th><th>Catalog #</th><th>Quantity</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr></tbody></table><h2>Methodology</h2><p></p>`
    },
    'qc-report': {
        name: 'Quality Control Report',
        content: `<h1>Quality Control Report</h1><p><strong>Sample ID:</strong> </p><h2>Test Results</h2><table style="width: 100%;"><thead><tr><th>Parameter</th><th>Spec</th><th>Result</th><th>Status</th></tr></thead><tbody><tr><td>Purity</td><td>>98%</td><td></td><td></td></tr></tbody></table>`
    },
    'clinical-trial': {
        name: 'Clinical Trial Entry',
        content: `<h1>Clinical Trial Summary</h1><p><strong>Trial Phase:</strong> </p><p><strong>Patient Group ID:</strong> </p><h2>Dosing Information</h2><p></p><h2>Adverse Events</h2><ul data-type="taskList"><li data-checked="false"><label><input type="checkbox"><span>None observed</span></label></li></ul><h2>Next Patient Follow-up</h2><p></p>`
    },
    'inventory-log': {
        name: 'Inventory/Reagent Log',
        content: `<h1>Inventory Update</h1><table style="width: 100%;"><thead><tr><th>Reagent Name</th><th>Lot #</th><th>Expiry</th><th>Stored At</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td></tr></tbody></table>`
    }
};

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
    const [tags, setTags] = useState(elnEntry?.tags || []);
    const [newTag, setNewTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [isCollaborating, setIsCollaborating] = useState(false);

    const awarenessRef = useRef(null);

    const handleConnect = useCallback((awareness) => {
        if (awareness) {
            awarenessRef.current = awareness;
            awareness.on('change', () => {
                const states = Array.from(awareness.getStates().values())
                    .map(state => state.user)
                    .filter(Boolean);
                setConnectedUsers(states);
            });
            setIsCollaborating(true);
        }
    }, []);

    const handleDisconnect = useCallback(() => {
        setIsCollaborating(false);
        setConnectedUsers([]);
    }, []);

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
                tags: tags,
                status,
            };

            await onSave(elnEntry?._id, elnData);
            setSuccess(elnEntry?._id ? 'ELN entry updated successfully!' : 'ELN entry created successfully!');
        } catch (err) {
            setError(err.message || 'An error occurred while saving');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyTemplate = (templateKey) => {
        const template = TELMPLATES[templateKey];
        if (template && (!content || content === '<p></p>' || window.confirm('This will replace your current content. Continue?'))) {
            setContent(template.content);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            if (!tags.includes(newTag.trim())) {
                setTags([...tags, newTag.trim()]);
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleImageInsertFromUpload = (insertImageFunction) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                setIsLoading(true);
                const response = await uploadFile(file, 'images');
                insertImageFunction(response.url);
            } catch (err) {
                setError('Failed to upload image: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fileInput.click();
    };

    return (
        <div className="flex flex-col space-y-8 max-w-[1400px] mx-auto pb-20 px-4 md:px-0">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-4 z-40">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCancel}
                        className="rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                            <Sparkles className="h-3 w-3" />
                            Session Active
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            {elnEntry?._id ? 'Refine Laboratory Record' : 'Initiate New Investigation'}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {isCollaborating && (
                        <div className="flex -space-x-3 mr-4">
                            {connectedUsers.map((user, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-xs text-white font-black shadow-sm"
                                    title={user.name}
                                    style={{ backgroundColor: user.color }}
                                >
                                    {user.name.charAt(0)}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="hidden sm:flex h-11 rounded-2xl border-slate-200 font-bold px-6 hover:bg-slate-50"
                        >
                            <Clock className="h-4 w-4 mr-2 text-slate-400" />
                            Save Draft
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 h-11 px-8 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Synchronizing...' : (elnEntry?._id ? 'Finalize Changes' : 'Publish Record')}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Writing Interface */}
                <div className="xl:col-span-3 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    {error && (
                        <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-700 rounded-2xl">
                            <AlertDescription className="font-medium">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
                        <Input
                            className="text-4xl md:text-5xl font-black h-auto border-none shadow-none focus-visible:ring-0 p-0 mb-8 placeholder:text-slate-200 text-slate-900 tracking-tight leading-tight"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Experiment Title..."
                            disabled={isLoading}
                        />

                        <div className="min-h-[600px]">
                            <CollaborativeEditor
                                content={content}
                                onUpdate={setContent}
                                elnId={elnEntry?._id}
                                onConnect={handleConnect}
                                onDisconnect={handleDisconnect}
                                userName={typeof window !== 'undefined' ? localStorage.getItem('userName') || 'Scientist' : 'Scientist'}
                                onImageInsert={handleImageInsertFromUpload}
                            />
                        </div>
                    </div>
                </div>

                {/* Meta Controls */}
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                        <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5 text-blue-500" />
                                Record Controls
                            </h3>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility & Access</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['draft', 'in-review', 'approved', 'published'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatus(s)}
                                            className={cn(
                                                "h-10 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all",
                                                status === s
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                                            )}
                                        >
                                            {s.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    Ontology Tags
                                    <TagIcon className="h-3.5 w-3.5 text-indigo-400" />
                                </Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Add classification..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        className="h-11 rounded-xl bg-slate-50 border-slate-100 text-sm focus:bg-white transition-colors pl-4"
                                    />
                                    <Plus className="absolute right-3 top-3 h-5 w-5 text-slate-300" />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {tags.map((tag) => (
                                        <Badge key={tag} className="bg-indigo-50 text-indigo-600 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer rounded-lg px-3 py-1 text-[10px] font-bold border-none group">
                                            #{tag}
                                            <Trash2 onClick={(e) => { e.stopPropagation(); removeTag(tag); }} className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                        <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Layout className="h-3.5 w-3.5 text-purple-500" />
                                Intelligence Patterns
                            </h3>
                        </div>
                        <CardContent className="p-3 space-y-1">
                            {Object.entries(TELMPLATES).map(([key, template]) => (
                                <Button
                                    key={key}
                                    variant="ghost"
                                    className="w-full justify-start text-xs h-12 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 font-bold transition-all px-4"
                                    onClick={() => handleApplyTemplate(key)}
                                >
                                    <div className="p-1.5 bg-slate-100 rounded-lg mr-3 group-hover:bg-purple-100">
                                        <Sparkles className="h-3 w-3 opacity-50" />
                                    </div>
                                    {template.name}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {collaborators?.length > 0 && (
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5 text-emerald-500" />
                                    Authorized Personnel
                                </h3>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                {collaborators.map((c) => (
                                    <div key={c._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-inner">
                                            {c.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700">{c.name}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">Research Associate</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ELNEditor;
