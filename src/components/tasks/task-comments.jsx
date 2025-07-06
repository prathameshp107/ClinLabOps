"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Send, UserCircle, AlertCircle, Clock, Download, X, Bold, Italic, Underline, Smile, AtSign, MoreHorizontal, ThumbsUp, MessageCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "./modern-rich-text-editor";
import { getTaskComments, addTaskComment, updateTaskComment, removeTaskComment } from "@/services/taskService";

// Helper: mock reactions and replies for demo
const mockReactions = [
  { type: "like", icon: <ThumbsUp className="h-4 w-4 mr-1" />, count: 12 },
  { type: "reply", icon: <MessageCircle className="h-4 w-4 mr-1" />, count: 3 },
];

// Helper: flatten comments for demo (in real app, use parentId for threads)
const mockReplies = {
  // commentId: [replies]
};

export const TaskComments = ({
  taskId,
  initialComments = [],
  onAddComment,
  onEditComment,
  onDeleteComment,
  maxHeight = 400,
  className = ""
}) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [files, setFiles] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const commentContainerRef = useRef(null);
  const [sortOrder, setSortOrder] = useState("recent");
  const [showCount, setShowCount] = useState(3); // For 'Show more' demo
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [currentUser] = useState(mockTaskUsers['current-user']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch comments from backend
  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    getTaskComments(taskId)
      .then(setComments)
      .catch(err => setError(err.message))
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
        const filtered = mockUsers.filter(user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );

        setMentionSuggestions(filtered);
        setShowMentionSuggestions(filtered.length > 0);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  }, [commentText, cursorPosition]);

  // Scroll to bottom of comments when new ones are added
  useEffect(() => {
    if (commentContainerRef.current) {
      commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
    }
  }, [comments]);

  // Call onCommentsChange if provided
  useEffect(() => {
    if (onAddComment) onAddComment(comments);
  }, [comments, onAddComment]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  // Remove a file from the list
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

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
    if (commentText.trim() === "" && files.length === 0) return;
    try {
      const newComment = await addTaskComment(taskId, {
        text: commentText,
        author: { id: "current-user", name: "Current User" },
        createdAt: new Date().toISOString(),
        replies: [],
      });
      setComments(prev => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId, newText) => {
    try {
      const updated = await updateTaskComment(taskId, commentId, { text: newText });
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: updated.text } : c));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await removeTaskComment(taskId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Format the comment text with highlighted mentions
  const formatCommentText = (text) => {
    if (!text) return "";

    const mentionRegex = /@([a-zA-Z0-9 ]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
      }

      // Add the mention with different styling
      const mentionedName = match[1].trim();
      const mentionedUser = mockUsers.find(user =>
        user.name.toLowerCase() === mentionedName.toLowerCase()
      );

      if (mentionedUser) {
        parts.push(
          <Badge variant="secondary" className="mx-1 bg-primary/10" key={`mention-${match.index}`}>
            @{mentionedName}
          </Badge>
        );
      } else {
        parts.push(<span key={`mention-${match.index}`}>@{mentionedName}</span>);
      }

      lastIndex = match.index + match[0].length;
    }

    // Add the remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  // Render a single comment and its replies, joined by a vertical line
  const renderComment = (comment, isReply = false, isLastReply = false) => (
    <div className={`flex gap-3 group relative ${isReply ? 'ml-10' : ''} py-4`}>
      {/* Vertical line for replies */}
      {isReply && !isLastReply && (
        <div className="absolute -left-5 top-8 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-700" style={{ height: 'calc(100% - 2rem)' }} />
      )}
      <Avatar className="h-9 w-9 mt-1">
        <AvatarImage src={comment.author.avatarUrl} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{comment.author.name}</span>
          <span className="text-xs text-zinc-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
        </div>
        <div className="text-[15px] mt-1 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: comment.text }} />
        {/* Attachments */}
        {comment.attachments && comment.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {comment.attachments.map((attachment) => (
              <div key={attachment.id} className="bg-zinc-50 dark:bg-zinc-800 rounded px-2 py-1 text-xs flex items-center gap-2">
                <Paperclip className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}
        {/* Reactions, Reply, Menu */}
        <div className="flex items-center gap-4 mt-2 text-zinc-500 text-xs">
          <button className="flex items-center hover:text-orange-500 transition"><ThumbsUp className="h-4 w-4 mr-1" />25</button>
          <button className="flex items-center hover:text-orange-500 transition"><MessageCircle className="h-4 w-4 mr-1" />3</button>
          <button className="hover:underline">Reply</button>
          <button className="ml-auto"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
        {/* Replies (joined visually) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-2 relative">
            {comment.replies.map((reply, idx) => renderComment(reply, true, idx === comment.replies.length - 1))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-zinc-900 my-8 mx-auto px-2 sm:px-6 lg:px-12 py-6">
      {/* Unified Comment Input Area */}
      <div className="w-full mb-6">
        <div className="flex items-start gap-0 w-full">
          {/* Input Card */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmitComment();
            }}
            className="flex-1 w-full"
          >
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl px-6 py-4 flex flex-col gap-3 w-full transition-shadow focus-within:shadow-lg hover:shadow-md">
              {/* Toolbar is inside RichTextEditor */}
              <div className="flex-1">
                <RichTextEditor
                  value={commentText}
                  onChange={setCommentText}
                  placeholder="Add comment..."
                />
              </div>
              <Button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-primary/90 transition mt-3 self-end">Submit</Button>
            </div>
          </form>
        </div>
      </div>
      {/* Comments Header and List (unchanged) */}
      <div className="flex items-center justify-between px-2 sm:px-6 pt-2 pb-4 w-full">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Comments</h3>
          <span className="bg-orange-100 text-orange-600 rounded-full px-2 py-0.5 text-xs font-bold">{comments.length}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <span>Most recent</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      {/* Comments List */}
      <div className="px-2 sm:px-6 pb-2 w-full">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">No comments yet. Be the first to add a comment!</div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 w-full">
            {comments.slice(0, showCount).map(comment => (
              <div className="py-5" key={comment.id}>{renderComment(comment)}</div>
            ))}
          </div>
        )}
        {/* Show more button */}
        {comments.length > showCount && (
          <div className="flex justify-center mt-4">
            <button className="text-orange-600 text-sm font-medium hover:underline" onClick={() => setShowCount(c => c + 3)}>Show more <span className="ml-1">↓</span></button>
          </div>
        )}
      </div>
    </div>
  );
};
