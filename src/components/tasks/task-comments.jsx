"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send, Smile, Paperclip, Image as ImageIcon, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextRevealCard } from "@/components/ui/aceternity/text-reveal-card";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function TaskComments({ task }) {
  const [comments, setComments] = useState(task.comments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
          id: "current-user",
          name: "Current User",
          avatar: "/avatars/current-user.png"
        }
      };

      setComments([...comments, newCommentObj]);
      setNewComment("");
      setIsSubmitting(false);
    }, 500);
  };

  const addEmoji = (emoji) => {
    setNewComment(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <Card className="flex flex-col h-[600px] bg-background/60 backdrop-blur-xl border-border/40 shadow-xl">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Smile className="h-5 w-5 text-primary" />
          </div>
          Comments
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
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
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex gap-3 group"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-background">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                      <div className="mt-1 text-sm bg-muted/30 p-3 rounded-xl border border-border/40 shadow-sm">
                        {comment.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={commentEndRef} />
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-background">
              <AvatarImage src="/avatars/current-user.png" alt="You" />
              <AvatarFallback className="bg-primary/10 text-primary">Y</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px] resize-none bg-background/50 backdrop-blur-sm border-border/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddComment();
                  }
                }}
              />

              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Picker
                        data={data}
                        onEmojiSelect={addEmoji}
                        theme="light"
                        previewPosition="none"
                        skinTonePosition="none"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleAddComment}
                  disabled={newComment.trim() === "" || isSubmitting}
                  className={cn(
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    isSubmitting && "opacity-70"
                  )}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium bg-muted rounded">⌘</span>
                <span>+</span>
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium bg-muted rounded">↵</span>
                <span>to send</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}