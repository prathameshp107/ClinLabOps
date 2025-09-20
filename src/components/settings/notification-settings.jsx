"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
    Bell,
    Mail,
    Monitor,
    Save,
    RotateCcw,
    CheckCircle
} from "lucide-react"

export function NotificationSettings({ settings, onSettingsChange, onSave }) {
    const [localSettings, setLocalSettings] = useState(settings)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setLocalSettings(settings)
    }, [settings])

    const handleChange = (category, key, value) => {
        const newSettings = {
            ...localSettings,
            [category]: {
                ...localSettings[category],
                [key]: value
            }
        }
        setLocalSettings(newSettings)
        onSettingsChange(newSettings)
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await onSave(localSettings)
            toast({
                title: "Settings saved",
                description: "Notification settings have been updated successfully.",
                variant: "success",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save notification settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        const defaultSettings = {
            email: {
                enabled: true,
                taskAssignments: true,
                projectUpdates: true
            },
            inApp: {
                enabled: true,
                taskUpdates: true
            }
        }
        setLocalSettings(defaultSettings)
        onSettingsChange(defaultSettings)
    }

    const getNotificationCount = () => {
        let count = 0
        if (localSettings.email?.enabled) count++
        if (localSettings.inApp?.enabled) count++
        return count
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Settings
                        <Badge variant="secondary" className="ml-2">
                            {getNotificationCount()} active
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Control how you receive notifications about your tasks and projects
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Email Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Notifications
                        {localSettings.email?.enabled && (
                            <Badge variant="default" className="ml-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Enabled
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Receive notifications via email for important updates
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
                            <div className="text-sm text-muted-foreground">
                                Receive notifications via email
                            </div>
                        </div>
                        <Switch
                            id="emailEnabled"
                            checked={localSettings.email?.enabled || false}
                            onCheckedChange={(checked) => handleChange('email', 'enabled', checked)}
                        />
                    </div>

                    {localSettings.email?.enabled && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Task Assignments</Label>
                                        <div className="text-sm text-muted-foreground">
                                            When new tasks are assigned to you
                                        </div>
                                    </div>
                                    <Switch
                                        checked={localSettings.email?.taskAssignments || false}
                                        onCheckedChange={(checked) => handleChange('email', 'taskAssignments', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Project Updates</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Important project changes and milestones
                                        </div>
                                    </div>
                                    <Switch
                                        checked={localSettings.email?.projectUpdates || false}
                                        onCheckedChange={(checked) => handleChange('email', 'projectUpdates', checked)}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* In-App Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        In-App Notifications
                        {localSettings.inApp?.enabled && (
                            <Badge variant="default" className="ml-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Enabled
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Control notifications that appear within the application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="inAppEnabled">Enable In-App Notifications</Label>
                            <div className="text-sm text-muted-foreground">
                                Show notifications within the application
                            </div>
                        </div>
                        <Switch
                            id="inAppEnabled"
                            checked={localSettings.inApp?.enabled || false}
                            onCheckedChange={(checked) => handleChange('inApp', 'enabled', checked)}
                        />
                    </div>

                    {localSettings.inApp?.enabled && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Task Updates</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Notifications for task status changes
                                        </div>
                                    </div>
                                    <Switch
                                        checked={localSettings.inApp?.taskUpdates || false}
                                        onCheckedChange={(checked) => handleChange('inApp', 'taskUpdates', checked)}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset to Defaults
                        </Button>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}