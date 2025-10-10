"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Edit, Save, X } from "lucide-react"

export function PersonalInfoTab({ personalData, onUpdatePersonalData }) {
  const [isEditing, setIsEditing] = useState(false)

  // Provide default values if personalData is undefined
  const safePersonalData = personalData || {
    fullName: '',
    email: '',
    phone: '',
    department: ''
  }

  const [formData, setFormData] = useState(safePersonalData)

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle save
  const handleSave = () => {
    onUpdatePersonalData(formData)
    setIsEditing(false)
  }

  // Handle cancel
  const handleCancel = () => {
    setFormData(safePersonalData)
    setIsEditing(false)
  }

  return (
    <Card className="border border-border/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your personal details and contact information
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
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            {isEditing ? (
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.fullName || 'Not specified'}</div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.email || 'Not specified'}</div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.phone || 'Not specified'}</div>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            {isEditing ? (
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.department || 'Not specified'}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}