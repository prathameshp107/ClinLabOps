"use client"

import { Mail, MoreHorizontal, UserCog, UserMinus, UserPlus, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const MemberRoleBadge = ({ role }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'Project Lead':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Data Scientist':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Developer':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Designer':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 rounded ${getRoleColor(role)}`}
    >
      {role}
    </Badge>
  );
};

export function ProjectTeam({ team, onAddMember }) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            Project Team
          </CardTitle>
          <Button
            size="sm"
            onClick={onAddMember}
            className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {team?.map((member, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs bg-gray-100 text-gray-600 font-medium">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MemberRoleBadge role={member.role} />
                    <span className="text-xs text-gray-500">{member.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Joined {member.joinedAt}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">
                      <UserCog className="h-4 w-4 mr-2 text-gray-500" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-sm text-red-600">
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