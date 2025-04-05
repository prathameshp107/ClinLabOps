"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send, Smile, Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextRevealCard } from "@/components/ui/aceternity/text-reveal-card";

export function TaskComments({ task }) {
  const [comments, setComments] = useState(task.comments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentEndRef = useRef(null);
  
  // Auto-scroll to the latest comment
  useEffect(() => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);
  
  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newCommentObj = {
        id: `c${Date.now()}`,
        text: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: "current-user", // In a real app, this would be the current user's ID
          name: "Current User", // In a real app, this would be the current user's name
          avatar: "/avatars/current-user.png" // In a real app, this would be the current user's avatar
        }
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment("");
      setIsSubmitting(false);
    }, 500);
  };
  
  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Smile className="h-4 w-4 text-primary" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
          {comments.length === 0 ? (
            <TextRevealCard
              text="Be the first to comment on this task"
              revealText="Add your thoughts, questions, or updates"
              className="h-40 w-full"
            />
          ) : (
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>
                    <div className="mt-1 text-sm bg-muted/50 p-3 rounded-lg">
                      {comment.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={commentEndRef} />
            </AnimatePresence>
          )}
        </div>
        
        <div className="border-t pt-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/current-user.png" alt="You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddComment();
                  }
                }}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAddComment} 
                  disabled={newComment.trim() === "" || isSubmitting}
                  className={cn(isSubmitting && "opacity-70")}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to send
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}