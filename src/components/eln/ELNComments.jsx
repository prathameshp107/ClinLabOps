'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Reply, Send, User, CornerDownRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge"


const ELNComments = ({
    comments = [],
    onAddComment,
    onDeleteComment,
    currentUserId,
    elnAuthorId,
    loading = false
}) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await onAddComment(newComment.trim(), null);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleSubmitReply = async (parentId) => {
        if (!replyText.trim()) return;

        try {
            await onAddComment(replyText.trim(), parentId);
            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const formatDate = (dateString) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };

    const renderReply = (reply) => (
        <div key={reply._id} className="relative pl-8 pt-4">
            <div className="absolute left-0 top-6 w-6 h-[2px] bg-slate-200" />
            <div className="absolute left-0 top-0 w-[2px] h-6 bg-slate-200" />

            <div className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <Avatar className="h-6 w-6 ring-2 ring-white shadow-sm">
                    <AvatarImage src={reply.author?.avatar} />
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-bold">
                        {reply.author?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{reply.author?.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                            {formatDate(reply.timestamp || reply.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{reply.content}</p>
                    {(currentUserId === reply.author?._id || currentUserId === elnAuthorId) && (
                        <div className="mt-2 flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteComment(reply._id)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                title="Delete Reply"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderComment = (comment, idx) => (
        <motion.div
            key={comment._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
        >
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <Avatar className="h-10 w-10 ring-4 ring-white shadow-md">
                        <AvatarImage src={comment.author?.avatar} />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                            {comment.author?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="w-[2px] flex-1 bg-slate-100 my-2" />
                </div>

                <div className="flex-1 pb-8">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-900">{comment.author?.name}</span>
                            <span className="text-xs text-slate-400 font-medium font-mono uppercase tracking-tighter">
                                {formatDate(comment.timestamp || comment.createdAt)}
                            </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{comment.content}</p>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                    className="h-7 px-3 rounded-full text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    <Reply className="h-3 w-3 mr-1.5" />
                                    Reply
                                </Button>
                            </div>
                            {(currentUserId === comment.author?._id || currentUserId === elnAuthorId) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteComment(comment._id)}
                                    className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                    title="Delete Comment"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>

                        {/* Reply Input */}
                        <AnimatePresence>
                            {replyingTo === comment._id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                                        <Textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Join the discussion..."
                                            className="min-h-[80px] bg-slate-50 border-none rounded-2xl text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                                        />
                                        <Button
                                            size="icon"
                                            onClick={() => handleSubmitReply(comment._id)}
                                            disabled={!replyText.trim()}
                                            className="h-10 w-10 flex-shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Replies List */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="space-y-2">
                            {comment.replies.map(renderReply)}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 px-8 py-6">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-lg font-extrabold text-slate-900 tracking-tight">Technical Discussion</span>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">
                        {comments.length} Thoughts
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-8">
                {/* Master Input */}
                <form onSubmit={handleSubmitComment} className="mb-10">
                    <div className="relative group">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your scientific observations or peer-review notes..."
                            className="w-full min-h-[120px] bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-6 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-200 transition-all outline-none resize-none shadow-inner"
                        />
                        <div className="absolute right-4 bottom-4">
                            <Button
                                type="submit"
                                disabled={!newComment.trim() || loading}
                                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 px-6 h-11 rounded-2xl font-bold transition-all disabled:opacity-50"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Post
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="space-y-2">
                    {comments.length > 0 ? (
                        comments.map(renderComment)
                    ) : (
                        <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                            <CornerDownRight className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                            <h4 className="font-bold text-slate-900">No Discussion Yet</h4>
                            <p className="text-xs text-slate-400 max-w-[200px] mx-auto">
                                Be the first scientist to provide feedback on this experiment.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ELNComments;
