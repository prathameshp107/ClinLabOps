"use client";

import { useState } from "react";
import { User, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TaskAssignee({ task, teamMembers }) {
  const [assignee, setAssignee] = useState(task.assignee);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAssigneeChange = (member) => {
    // In a real app, you would update the assignee on the backend
    setAssignee(member);
    setIsOpen(false);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Assignee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{assignee.name}</p>
              <p className="text-xs text-muted-foreground">{assignee.role || "Team Member"}</p>
            </div>
          </div>
          
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Reassign
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {teamMembers.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => handleAssigneeChange(member)}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    member.id === assignee.id && "bg-primary/10"
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                  {member.id === assignee.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto h-2 w-2 rounded-full bg-primary"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}