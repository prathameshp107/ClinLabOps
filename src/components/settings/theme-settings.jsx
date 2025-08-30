"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import {
    Palette,
    Monitor,
    Sun,
    Moon,
    Save,
    RotateCcw
} from "lucide-react"

export function ThemeSettings({ settings, onSettingsChange, onSave }) {
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

        // Apply theme changes immediately
        if (key === 'mode') {
            applyTheme(value)
        }
    }

    const applyTheme = (mode) => {
        const root = document.documentElement
        if (mode === 'dark') {
            root.classList.add('dark')
        } else if (mode === 'light') {
            root.classList.remove('dark')
        } else {
            // Auto mode - check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await onSave(localSettings)
            toast({
                title: "Settings saved",
                description: "Theme settings have been updated successfully.",
                variant: "success",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save theme settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        const defaultSettings = {
            mode: 'light',
            primaryColor: 'blue'
        }
        setLocalSettings(defaultSettings)
        onSettingsChange(defaultSettings)
        applyTheme(defaultSettings.mode)
    }

    const colorOptions = [
        { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
        { value: 'green', label: 'Green', color: 'bg-green-500' },
        { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
        { value: 'red', label: 'Red', color: 'bg-red-500' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Appearance Settings
                    </CardTitle>
                    <CardDescription>
                        Customize the look and feel of your interface
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Theme Mode */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Theme Mode
                    </CardTitle>
                    <CardDescription>
                        Choose between light, dark, or automatic theme
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup
                        value={localSettings.mode || 'light'}
                        onValueChange={(value) => handleChange('mode', value)}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="light" id="light" />
                            <div className="flex items-center gap-2 flex-1">
                                <Sun className="h-4 w-4" />
                                <Label htmlFor="light" className="flex-1 cursor-pointer">
                                    Light
                                </Label>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="dark" id="dark" />
                            <div className="flex items-center gap-2 flex-1">
                                <Moon className="h-4 w-4" />
                                <Label htmlFor="dark" className="flex-1 cursor-pointer">
                                    Dark
                                </Label>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="auto" id="auto" />
                            <div className="flex items-center gap-2 flex-1">
                                <Monitor className="h-4 w-4" />
                                <Label htmlFor="auto" className="flex-1 cursor-pointer">
                                    Auto
                                </Label>
                            </div>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Primary Color */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Primary Color
                    </CardTitle>
                    <CardDescription>
                        Choose the primary color for buttons and accents
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {colorOptions.map((color) => (
                            <Button
                                key={color.value}
                                variant={localSettings.primaryColor === color.value ? "default" : "outline"}
                                className="h-16 p-0 relative flex-col gap-2"
                                onClick={() => handleChange('primaryColor', color.value)}
                            >
                                <div className={`w-6 h-6 rounded-full ${color.color}`} />
                                <span className="text-sm">{color.label}</span>
                            </Button>
                        ))}
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
                </CardContent>
            </Card>
        </div>
    )
}