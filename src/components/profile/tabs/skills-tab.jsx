"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Plus, X, Save, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function SkillsTab({ skills, specializations, onAddSkill, onRemoveSkill, onUpdateSpecializations }) {
  const [newSkill, setNewSkill] = useState("")
  const [isEditingSpecializations, setIsEditingSpecializations] = useState(false)
  const [specializationsData, setSpecializationsData] = useState(specializations)
  
  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      onAddSkill(newSkill.trim())
      setNewSkill("")
    }
  }
  
  // Handle specialization proficiency change
  const handleProficiencyChange = (index, value) => {
    const updatedSpecializations = [...specializationsData]
    updatedSpecializations[index].proficiency = parseInt(value)
    setSpecializationsData(updatedSpecializations)
  }
  
  // Handle save specializations
  const handleSaveSpecializations = () => {
    onUpdateSpecializations(specializationsData)
    setIsEditingSpecializations(false)
  }
  
  // Handle cancel editing specializations
  const handleCancelSpecializations = () => {
    setSpecializationsData(specializations)
    setIsEditingSpecializations(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Technical Skills */}
      <Card className="border border-border/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>
              Your technical skills and competencies
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="flex items-center gap-1 py-1.5 px-3 bg-muted/70"
              >
                {skill}
                <button 
                  onClick={() => onRemoveSkill(skill)}
                  className="ml-1 text-muted-foreground hover:text-destructive rounded-full"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {skill}</span>
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <div className="text-sm text-muted-foreground">No skills added yet</div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="newSkill">Add New Skill</Label>
            <div className="flex gap-2">
              <Input
                id="newSkill"
                placeholder="e.g., PCR, HPLC, Cell Culture"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSkill()
                  }
                }}
              />
              <Button onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add skill</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Areas of Specialization */}
      <Card className="border border-border/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Areas of Specialization</CardTitle>
            <CardDescription>
              Your areas of expertise and proficiency levels
            </CardDescription>
          </div>
          {!isEditingSpecializations ? (
            <Button variant="outline" onClick={() => setIsEditingSpecializations(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelSpecializations}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveSpecializations}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {specializationsData.map((specialization, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">{specialization.name}</Label>
                <span className="text-xs text-muted-foreground">
                  {specialization.proficiency}%
                </span>
              </div>
              {isEditingSpecializations ? (
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={specialization.proficiency}
                  onChange={(e) => handleProficiencyChange(index, e.target.value)}
                  className="w-full"
                />
              ) : (
                <Progress value={specialization.proficiency} className="h-2" />
              )}
            </div>
          ))}
          
          {specializationsData.length === 0 && (
            <div className="text-sm text-muted-foreground">No specializations added yet</div>
          )}
          
          {isEditingSpecializations && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <Label>Add New Specialization</Label>
                <div className="flex gap-2">
                  <Input placeholder="Specialization name" />
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add specialization</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}