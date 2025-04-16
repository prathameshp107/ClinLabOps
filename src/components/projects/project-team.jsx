"use client"

import { Mail, MoreHorizontal, UserCog, UserMinus, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ProjectTeam({ team, onAddMember }) {
  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Project Team</CardTitle>
          <Button size="sm" onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {team?.map((member, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/30 hover:bg-background/70 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={
                      member.role === 'Project Lead' ? 'default' :
                        member.role === 'Data Scientist' ? 'secondary' : 'outline'
                    } className="text-xs">
                      {member.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{member.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Joined {member.joinedAt}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCog className="h-4 w-4 mr-2" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remove from Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}