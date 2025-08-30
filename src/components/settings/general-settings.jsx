"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Globe, Save, RotateCcw, CheckCircle } from "lucide-react"

export function GeneralSettings({ settings, onSettingsChange, onSave }) {
    const [localSettings, setLocalSettings] = useState(settings)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setLocalSettings(settings)
    }, [settings])

    const handleChange = (key, value) => {
        const newSettings = { ...localSettings, [key]: value }
        setLocalSettings(newSettings)
        onSettingsChange(newSettings)
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await onSave(localSettings)
            toast({
                title: "Settings saved",
                description: "General settings have been updated successfully.",
                variant: "success",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save general settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        const defaultSettings = {
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/dd/yyyy',
            autoSave: true
        }
        setLocalSettings(defaultSettings)
        onSettingsChange(defaultSettings)
    }

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' },
        { value: 'de', label: 'Deutsch' }
    ]

    const timezones = [
        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
        { value: 'Europe/Paris', label: 'Central European Time (CET)' }
    ]

    const dateFormats = [
        { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (12/31/2024)' },
        { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (31/12/2024)' },
        { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2024-12-31)' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        General Settings
                    </CardTitle>
                    <CardDescription>
                        Configure basic application preferences
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Language & Region */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Language & Region</CardTitle>
                    <CardDescription>
                        Set your preferred language and regional formats
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select
                                value={localSettings.language || 'en'}
                                onValueChange={(value) => handleChange('language', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select
                                value={localSettings.timezone || 'UTC'}
                                onValueChange={(value) => handleChange('timezone', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timezones.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Date Format */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Date Format</CardTitle>
                    <CardDescription>
                        Choose how dates are displayed throughout the application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select
                            value={localSettings.dateFormat || 'MM/dd/yyyy'}
                            onValueChange={(value) => handleChange('dateFormat', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                                {dateFormats.map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                        {format.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Application Behavior */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Application Behavior</CardTitle>
                    <CardDescription>
                        Configure how the application behaves
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="autoSave">Auto-save</Label>
                            <div className="text-sm text-muted-foreground">
                                Automatically save changes as you work
                            </div>
                        </div>
                        <Switch
                            id="autoSave"
                            checked={localSettings.autoSave || false}
                            onCheckedChange={(checked) => handleChange('autoSave', checked)}
                        />
                    </div>
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

                    {localSettings.autoSave && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            <span>Auto-save is enabled - changes are saved automatically</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}