"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Edit, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PersonalInfoTab({ personalData, onUpdatePersonalData }) {
  const [isEditing, setIsEditing] = useState(false)

  // Provide default values if personalData is undefined
  const safePersonalData = personalData || {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
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

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date
    })
  }

  // Handle gender change
  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value
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

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? (
                      format(formData.dateOfBirth, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="p-2 bg-muted/50 rounded-md">
                {safePersonalData.dateOfBirth ? format(safePersonalData.dateOfBirth, "PPP") : "Not specified"}
              </div>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender</Label>
          {isEditing ? (
            <RadioGroup
              value={formData.gender}
              onValueChange={handleGenderChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="cursor-pointer">Other</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                <Label htmlFor="prefer-not-to-say" className="cursor-pointer">Prefer not to say</Label>
              </div>
            </RadioGroup>
          ) : (
            <div className="p-2 bg-muted/50 rounded-md capitalize">
              {safePersonalData.gender === "prefer-not-to-say" ? "Prefer not to say" : safePersonalData.gender || "Not specified"}
            </div>
          )}
        </div>

        <Separator />

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          {isEditing ? (
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          ) : (
            <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.address || "Not specified"}</div>
          )}
        </div>

        <Separator />

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Emergency Contact</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Contact Name</Label>
              {isEditing ? (
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.emergencyContactName || "Not specified"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
              {isEditing ? (
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.emergencyContactPhone || "Not specified"}</div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergencyContactRelation">Relationship</Label>
              {isEditing ? (
                <Input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">{safePersonalData.emergencyContactRelation || "Not specified"}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}