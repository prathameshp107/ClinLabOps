"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Send, UserCircle, AlertCircle, Clock, Download, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Mock users for @mentions
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", avatarUrl: "" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatarUrl: "" },
  { id: "3", name: "Robert Johnson", email: "robert@example.com", avatarUrl: "" },
  { id: "4", name: "Emily Brown", email: "emily@example.com", avatarUrl: "" },
  { id: "5", name: "Michael Wilson", email: "michael@example.com", avatarUrl: "" },
];

export const TaskComments = ({ taskId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [files, setFiles] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const commentContainerRef = useRef(null);
  
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
  const handleSubmitComment = () => {
    if (commentText.trim() === "" && files.length === 0) return;
    
    // Find and process @mentions
    const mentionRegex = /@([a-zA-Z0-9 ]+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(commentText)) !== null) {
      const mentionedName = match[1].trim();
      const mentionedUser = mockUsers.find(user => 
        user.name.toLowerCase() === mentionedName.toLowerCase()
      );
      
      if (mentionedUser) {
        mentions.push(mentionedUser.id);
      }
    }
    
    // Process file attachments
    const attachments = files.map(file => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // In a real app, you'd upload to a server
    }));
    
    // Create the new comment
    const newComment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      author: {
        id: "current-user", // In a real app, this would be the logged-in user
        name: "You",
        avatarUrl: ""
      },
      createdAt: new Date(),
      mentions,
      attachments,
      isNew: true // Flag for animation
    };
    
    // Add to comments and reset input
    setComments([...comments, newComment]);
    setCommentText("");
    setFiles([]);
    setShowMentionSuggestions(false);
    
    // In a real app, you would send notifications to mentioned users here
    if (mentions.length > 0) {
      console.log("Sending notifications to:", mentions);
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
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments ({comments.length})</h3>
      
      <div 
        className="space-y-4 max-h-[400px] overflow-y-auto p-2 -mx-2" 
        ref={commentContainerRef}
      >
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to add a comment!
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={comment.isNew ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatarUrl} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-sm">
                            {comment.author.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(comment.createdAt), { 
                              addSuffix: true 
                            })}
                          </div>
                        </div>
                        
                        <div className="text-sm whitespace-pre-wrap">
                          {formatCommentText(comment.text)}
                        </div>
                        
                        {comment.attachments && comment.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {comment.attachments.map((attachment) => (
                              <div 
                                key={attachment.id} 
                                className="bg-slate-50 dark:bg-slate-800 rounded p-2 text-xs flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <Paperclip className="h-3 w-3 mr-2" />
                                  <span className="truncate max-w-[180px]">{attachment.name}</span>
                                </div>
                                <Button size="icon" variant="ghost" className="h-5 w-5 p-0">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      <div className="border rounded-md p-3 space-y-3">
        <Textarea
          ref={textareaRef}
          placeholder="Add a comment... (Use @ to mention teammates)"
          value={commentText}
          onChange={handleTextareaChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmitComment();
            }
          }}
          className="min-h-[80px] resize-none"
        />
        
        {/* Mention suggestions */}
        {showMentionSuggestions && (
          <div className="absolute z-10 bg-background border rounded-md shadow-md p-1 max-h-[150px] overflow-y-auto">
            {mentionSuggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => handleSelectMention(user)}
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* File attachments preview */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="bg-slate-50 dark:bg-slate-800 rounded-md py-1 px-2 text-xs flex items-center gap-1"
              >
                <Paperclip className="h-3 w-3" />
                <span className="truncate max-w-[100px]">{file.name}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Attach Files
          </Button>
          
          <Button 
            onClick={handleSubmitComment}
            disabled={commentText.trim() === "" && files.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
