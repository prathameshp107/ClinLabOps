"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Send, UserCircle, AlertCircle, Clock, Download, X, Bold, Italic, Underline, Smile, AtSign, MoreHorizontal, ThumbsUp, MessageCircle, Reply } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "./modern-rich-text-editor";
import { getTaskComments, addTaskComment, updateTaskComment, removeTaskComment } from "@/services/taskService";

export const TaskComments = ({
  taskId,
  initialComments = [],
  onAddComment,
  onEditComment,
  onDeleteComment,
  maxHeight = 400,
  className = "",
  users = [],
  currentUserId = null
}) => {
  console.log('TaskComments received props:', { taskId, users, currentUserId });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const commentContainerRef = useRef(null);
  const [sortOrder, setSortOrder] = useState("recent");
  const [showCount, setShowCount] = useState(5); // Show more comments by default
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get currentUser from users prop or fallback
  const currentUser = users.find(u => u.id === currentUserId) || users[0] || { id: 'current-user', name: 'Current User' };
  console.log('TaskComments currentUser:', currentUser, 'currentUserId:', currentUserId, 'users:', users);

  // Fetch comments from backend
  useEffect(() => {
    if (!taskId || taskId === 'unknown') return;
    setLoading(true);
    getTaskComments(taskId)
      .then(commentsData => {
        // Sort comments by createdAt in descending order (newest first)
        const sortedComments = [...commentsData].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
        setShowCount(Math.max(5, sortedComments.length)); // Show all comments by default
      })
      .catch(err => {
        console.error('Error fetching comments:', err);
        setError(err.message || 'Failed to load comments');
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  // Monitor for @mentions
  useEffect(() => {
    if (commentText.includes("@")) {
      const lastAtSymbol = commentText.lastIndexOf("@");
      if (lastAtSymbol !== -1 && cursorPosition > lastAtSymbol) {
        const query = commentText.substring(lastAtSymbol + 1, cursorPosition).toLowerCase();
        setMentionQuery(query);
        // Filter users based on query
        const filtered = users.filter(user =>
          user.name.toLowerCase().includes(query) ||
          (user.email && user.email.toLowerCase().includes(query))
        );
        setMentionSuggestions(filtered);
        setShowMentionSuggestions(filtered.length > 0);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  }, [commentText, cursorPosition, users]);

  // Scroll to bottom of comments when new ones are added
  useEffect(() => {
    if (commentContainerRef.current && comments.length > 0) {
      commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
    }
  }, [comments]);

  // Call onCommentsChange if provided
  useEffect(() => {
    if (onAddComment) onAddComment(comments);
  }, [comments, onAddComment]);

  // Handle textarea input to track cursor position
  const handleTextareaChange = (e) => {
    setCommentText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Insert mention into comment text
  const handleSelectMention = (user) => {
    const beforeMention = commentText.substring(0, commentText.lastIndexOf("@"));
    const afterMention = commentText.substring(cursorPosition);
    const newText = `${beforeMention}@${user.name} ${afterMention}`;

    setCommentText(newText);
    setShowMentionSuggestions(false);

    // Set focus back to textarea after selecting mention
    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = beforeMention.length + user.name.length + 2; // +2 for @ and space
      setTimeout(() => {
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        setCursorPosition(newCursorPos);
      }, 0);
    }
  };

  // Submit a new comment
  const handleSubmitComment = async () => {
    if (commentText.trim() === "") return;
    if (!taskId || taskId === 'unknown') {
      setError(`Invalid task ID: "${taskId}". Please refresh the page.`);
      console.error('TaskComments received invalid taskId:', taskId);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const newCommentData = {
        text: commentText,
        author: currentUser.id || currentUser._id, // Use the actual user ID
        authorName: currentUser.name, // Store the author name for display
        createdAt: new Date().toISOString(),
        replies: [],
      };

      const newComment = await addTaskComment(taskId, newCommentData);

      // Ensure the comment has all necessary properties
      const commentWithAuthor = {
        ...newComment,
        id: newComment.id || newComment._id || `temp-${Date.now()}`,
        authorName: newComment.authorName || currentUser.name,
        createdAt: newComment.createdAt || new Date().toISOString(),
        text: newComment.text || commentText
      };

      // Add the new comment to the state and sort by date (newest first)
      const updatedComments = [...comments, commentWithAuthor].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setComments(updatedComments);
      setCommentText("");
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message || 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId, newText) => {
    if (!taskId || taskId === 'unknown') {
      setError('Invalid task ID');
      return;
    }
    try {
      const updated = await updateTaskComment(taskId, commentId, { text: newText });
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: updated.text } : c));
      setEditingComment(null);
    } catch (err) {
      setError(err.message || 'Failed to update comment');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!taskId || taskId === 'unknown') {
      setError('Invalid task ID');
      return;
    }
    try {
      await removeTaskComment(taskId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  // Render a single comment and its replies
  const renderComment = (comment, isReply = false, isLastReply = false) => {
    // Hydrate author from users array or use stored authorName
    let authorName = 'Unknown';
    let authorAvatar = '';
    let authorInitial = '?';

    // Try to find the author in the users array first
    if (comment.author) {
      const authorUser = users.find(u => u.id === comment.author) ||
        users.find(u => u._id === comment.author);
      if (authorUser) {
        authorName = authorUser.name || (authorUser.firstName && authorUser.lastName ?
          `${authorUser.firstName} ${authorUser.lastName}` :
          authorUser.firstName || authorUser.lastName || 'Unknown User');
        authorAvatar = authorUser.avatarUrl || authorUser.avatar || '';
        authorInitial = authorName.charAt(0).toUpperCase();
      }
    }

    // Fallback to stored authorName if available
    if (authorName === 'Unknown' && comment.authorName) {
      authorName = comment.authorName;
      authorInitial = comment.authorName.charAt(0).toUpperCase();
    }

    // Additional fallback to currentUser if no author info
    if (authorName === 'Unknown' && currentUser) {
      authorName = currentUser.name || (currentUser.firstName && currentUser.lastName ?
        `${currentUser.firstName} ${currentUser.lastName}` :
        currentUser.firstName || currentUser.lastName || 'Current User');
      authorInitial = authorName.charAt(0).toUpperCase();
    }

    // Safely format the date
    let timeAgo = '';
    try {
      if (comment.createdAt) {
        const date = new Date(comment.createdAt);
        if (!isNaN(date.getTime())) {
          timeAgo = formatDistanceToNow(date, { addSuffix: true });
        } else {
          timeAgo = 'Invalid date';
        }
      } else {
        timeAgo = 'Unknown time';
      }
    } catch (error) {
      console.error('Error formatting date:', error, comment.createdAt);
      timeAgo = 'Unknown time';
    }

    return (
      <div className={`group relative py-4 ${isReply ? 'ml-8 pl-6 border-l-2 border-zinc-200 dark:border-zinc-700' : ''}`}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-zinc-800">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-primary-foreground">
              {authorInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{authorName}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{timeAgo}</span>
            </div>
            <div
              className="text-[15px] text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap prose prose-sm max-w-none prose-zinc dark:prose-invert dark:prose-headings:text-zinc-100 dark:prose-p:text-zinc-300 dark:prose-a:text-blue-400 dark:prose-blockquote:border-zinc-700 dark:prose-code:bg-zinc-800 dark:prose-code:text-zinc-100 dark:prose-li:text-zinc-300"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
            {/* Actions */}
            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-zinc-500 hover:text-primary hover:bg-primary/10 dark:text-zinc-400 dark:hover:text-primary dark:hover:bg-primary/10"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-xs">Like</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-zinc-500 hover:text-primary hover:bg-primary/10 dark:text-zinc-400 dark:hover:text-primary dark:hover:bg-primary/10"
              >
                <Reply className="h-4 w-4 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-zinc-500 hover:text-primary hover:bg-primary/10 dark:text-zinc-400 dark:hover:text-primary dark:hover:bg-primary/10"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            {/* Replies (joined visually) */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {comment.replies.map((reply, idx) => renderComment(reply, true, idx === comment.replies.length - 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={`${className} bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Comments
          <Badge variant="secondary" className="ml-2 bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {comments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div
          ref={commentContainerRef}
          className="space-y-6 overflow-y-auto pb-6 custom-scrollbar"
          style={{ maxHeight: comments.length > 0 ? maxHeight : 'auto' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground dark:text-zinc-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
              <p>Loading comments...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground dark:text-zinc-400">
              <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium mb-1">No comments yet</p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment, idx) =>
                renderComment(comment, false, idx === comments.length - 1)
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Unified Comment Input Area */}
        <div className="w-full mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-zinc-800">
              <AvatarImage src={currentUser?.avatarUrl || currentUser?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-primary-foreground">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmitComment();
              }}
              className="flex-1"
            >
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/30 focus-within:bg-white dark:focus-within:bg-zinc-800">
                <RichTextEditor
                  value={commentText}
                  onChange={setCommentText}
                  placeholder="Add a comment..."
                />
                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
                    >
                      <AtSign className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="rounded-full px-4 h-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
                    disabled={!commentText.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                        Posting...
                      </>
                    ) : (
                      'Comment'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};