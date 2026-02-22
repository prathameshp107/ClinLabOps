'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Reply, Send } from 'lucide-react';

const ELNComments = ({
    comments = [],
    onAddComment,
    currentUserId,
    currentUser,
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

    const renderComment = (comment) => (
        <div key={comment._id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.avatar} alt={comment.author?.name} />
                    <AvatarFallback>
                        {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.author?.name || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(comment.timestamp || comment.createdAt)}
                        </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                    <div className="mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                            className="text-xs"
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                        </Button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                        <div className="mt-3 ml-6 flex space-x-2">
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                className="text-sm"
                                rows={2}
                            />
                            <Button
                                size="sm"
                                onClick={() => handleSubmitReply(comment._id)}
                                disabled={!replyText.trim()}
                            >
                                <Send className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3">
                            {comment.replies.map(renderReply)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderReply = (reply) => (
        <div key={reply._id} className="border-l-2 border-muted pl-3">
            <div className="flex space-x-3">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.author?.avatar} alt={reply.author?.name} />
                    <AvatarFallback>
                        {reply.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{reply.author?.name || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(reply.timestamp || reply.createdAt)}
                        </span>
                    </div>
                    <p className="mt-1 text-sm">{reply.content}</p>
                </div>
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Comments ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Add Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex space-x-2">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1"
                            rows={3}
                        />
                        <Button
                            type="submit"
                            disabled={!newComment.trim() || loading}
                            className="self-start bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map(renderComment)
                    ) : (
                        <p className="text-muted-foreground text-center py-4">
                            No comments yet. Be the first to add one!
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ELNComments;