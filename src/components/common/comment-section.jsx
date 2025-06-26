"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Check, Paperclip, Smile, X, Image as ImageIcon, FileText, FileArchive, MessageSquare } from "lucide-react"

export const CommentSection = ({
  currentUser = { id: '1', name: 'Current User', avatar: '/avatars/01.png' },
  comments = [],
  onAddComment,
  onDeleteComment,
  className = '',
  placeholder = 'Add a comment...',
  showAttachments = true,
  showMentions = true,
  autoFocus = false
}) => {
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const textareaRef = useRef(null)
  const mentionSuggestionsRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  // Mock users for mentions
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/01.png' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatars/02.png' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: '/avatars/03.png' },
  ]

  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newComment;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setNewComment(before + emojiData.emoji + after);
    setShowEmojiPicker(false);
  };

  // Handle mention detection in comment input
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @mention
    const atSymbolIndex = value.lastIndexOf('@');
    if (atSymbolIndex !== -1 && (atSymbolIndex === 0 || /[\s\n]/.test(value[atSymbolIndex - 1]))) {
      const query = value.substring(atSymbolIndex + 1).split(/[\s\n]/)[0]; // Get the current word after @
      setMentionQuery(query || '');

      if (query && query.length > 0) {
        setShowMentionSuggestions(true);

        // Position the mention suggestions
        const textarea = textareaRef.current;
        if (textarea) {
          const { top, left } = getCaretCoordinates(textarea, atSymbolIndex);
          setMentionPosition({ top, left });
        }
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
      setMentionQuery('');
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (files.length === 0) return;

    // Filter out files larger than 10MB
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Some files exceed the 10MB limit and were not attached.",
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if ((!newComment.trim() && attachedFiles.length === 0) || isUploading) return;

    setIsUploading(true);

    try {
      // Upload files if any
      const uploadedFiles = [];
      for (const fileData of attachedFiles) {
        // Simulate file upload
        uploadedFiles.push({
          id: fileData.id,
          name: fileData.name,
          url: `#${fileData.id}`,
          type: fileData.type,
          size: fileData.size,
          preview: fileData.preview
        });
      }

      // Create comment object
      const comment = {
        id: `comment-${Date.now()}`,
        userId: currentUser.id,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        attachments: uploadedFiles,
        user: currentUser
      };

      // Call the onAddComment callback
      if (onAddComment) {
        await onAddComment(comment);
      }

      // Reset form
      setNewComment('');
      setAttachedFiles([]);
      setShowEmojiPicker(false);
      setIsCommenting(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    if (onDeleteComment) {
      try {
        await onDeleteComment(commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast({
          title: "Error",
          description: "Failed to delete comment. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      attachedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [attachedFiles]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    } else if (fileType.includes('zip') || fileType.includes('compressed')) {
      return <FileArchive className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Comments List */}
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p>No comments yet</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={comment.user?.avatar} alt={comment.user?.name} />
                  <AvatarFallback>{comment.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.user?.name || 'Unknown User'}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    {onDeleteComment && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete comment</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>

                  {/* Attachments */}
                  {comment.attachments?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {comment.attachments.map((file) => (
                        <a
                          key={file.id}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                          <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Comment Form */}
      <div className="border-t pt-4">
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsCommenting(true)}
              placeholder={placeholder}
              className="min-h-[80px] resize-none pr-10"
              autoFocus={autoFocus}
            />

            {/* Emoji Picker Button */}
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                    <span className="sr-only">Add emoji</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add emoji</TooltipContent>
              </Tooltip>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute right-0 bottom-10 z-10">
                <div className="bg-background border rounded-md shadow-lg p-2">
                  {/* In a real implementation, you would use an emoji picker component here */}
                  <div className="grid grid-cols-8 gap-1">
                    {['😀', '😊', '👍', '❤️', '🔥', '🎉', '👏', '🙏'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="text-2xl p-1 hover:bg-muted rounded"
                        onClick={() => {
                          setNewComment(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              {attachedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between bg-muted/50 rounded-md p-2 text-sm">
                  <div className="flex items-center gap-2">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-background border flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium truncate max-w-[200px]">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {showAttachments && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach file</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {(isCommenting || newComment.trim() || attachedFiles.length > 0) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNewComment('');
                    setAttachedFiles([]);
                    setIsCommenting(false);
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={(!newComment.trim() && attachedFiles.length === 0) || isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
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
  );
};

export default CommentSection;
