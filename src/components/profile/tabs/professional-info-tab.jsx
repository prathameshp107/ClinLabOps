"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, Edit, Save, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfessionalInfoTab({ professionalData, onUpdateProfessionalData }) {
  const [isEditing, setIsEditing] = useState(false)

  // Provide default values if professionalData is undefined
  const safeProfessionalData = professionalData || {
    title: '',
    department: '',
    labLocation: '',
    dateJoined: null,
    employmentType: '',
    employeeId: '',
    certifications: [],
    supervisorName: '',
    supervisorTitle: ''
  }

  const [formData, setFormData] = useState(safeProfessionalData)

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateJoined: date
    })
  }

  // Handle save
  const handleSave = () => {
    onUpdateProfessionalData(formData)
    setIsEditing(false)
  }

  // Handle cancel
  const handleCancel = () => {
    setFormData(safeProfessionalData)
    setIsEditing(false)
  }

  return (
    <Card className="border border-border/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>
            Your professional details and lab-related information
          </CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title/Role */}
          <div className="space-y-2">
            <Label htmlFor="title">Title/Role</Label>
            {isEditing ? (
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safeProfessionalData.title || 'Not specified'}</div>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            {isEditing ? (
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Research & Development">Research & Development</SelectItem>
                  <SelectItem value="Quality Control">Quality Control</SelectItem>
                  <SelectItem value="Analytical Services">Analytical Services</SelectItem>
                  <SelectItem value="Toxicology">Toxicology</SelectItem>
                  <SelectItem value="Bioanalytical">Bioanalytical</SelectItem>
                  <SelectItem value="Clinical Operations">Clinical Operations</SelectItem>
                  <SelectItem value="Lab Management">Lab Management</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safeProfessionalData.department || 'Not specified'}</div>
            )}
          </div>

          {/* Lab Location */}
          <div className="space-y-2">
            <Label htmlFor="labLocation">Lab Location</Label>
            {isEditing ? (
              <Select
                value={formData.labLocation}
                onValueChange={(value) => handleSelectChange("labLocation", value)}
              >
                <SelectTrigger id="labLocation">
                  <SelectValue placeholder="Select lab location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Laboratory">Main Laboratory</SelectItem>
                  <SelectItem value="Research Wing">Research Wing</SelectItem>
                  <SelectItem value="Analytical Lab">Analytical Lab</SelectItem>
                  <SelectItem value="Toxicology Suite">Toxicology Suite</SelectItem>
                  <SelectItem value="Bioanalytical Lab">Bioanalytical Lab</SelectItem>
                  <SelectItem value="Clinical Lab">Clinical Lab</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safeProfessionalData.labLocation || 'Not specified'}</div>
            )}
          </div>

          {/* Date Joined */}
          <div className="space-y-2">
            <Label htmlFor="dateJoined">Date Joined</Label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateJoined && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateJoined ? (
                      format(formData.dateJoined, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateJoined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">
                {safeProfessionalData.dateJoined ? format(new Date(safeProfessionalData.dateJoined), "PPP") : 'Not specified'}
              </div>
            )}
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type</Label>
            {isEditing ? (
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleSelectChange("employmentType", value)}
              >
                <SelectTrigger id="employmentType">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safeProfessionalData.employmentType || 'Not specified'}</div>
            )}
          </div>

          {/* Employee ID */}
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <div className="p-2 bg-muted/50 rounded-md">{safeProfessionalData.employeeId || 'Not assigned'}</div>
          </div>
        </div>

        <Separator />

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Certifications</h3>

          <div className="flex flex-wrap gap-2">
            {safeProfessionalData.certifications.map((cert, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                {cert}
              </Badge>
            ))}
            {safeProfessionalData.certifications.length === 0 && (
              <div className="text-sm text-muted-foreground">No certifications added yet</div>
            )}
          </div>

          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="newCertification">Add Certification</Label>
                <div className="flex gap-2">
                  <Input
                    id="newCertification"
                    placeholder="e.g., GLP, Animal Handling"
                  />
                  <Button variant="outline">Add</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Supervisor */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Reporting Structure</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="supervisorName">Supervisor Name</Label>
              {isEditing ? (
                <Input
                  id="supervisorName"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">{safeProfessionalData.supervisorName || "Not specified"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisorTitle">Supervisor Title</Label>
              {isEditing ? (
                <Input
                  id="supervisorTitle"
                  name="supervisorTitle"
                  value={formData.supervisorTitle}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">{safeProfessionalData.supervisorTitle || "Not specified"}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}