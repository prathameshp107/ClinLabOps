"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
    Shield,
    Lock,
    Save,
    RotateCcw,
    CheckCircle
} from "lucide-react"

export function SecuritySettings({ settings, onSettingsChange, onSave }) {
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
                description: "Security settings have been updated successfully.",
                variant: "success",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save security settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        const defaultSettings = {
            twoFactorAuth: {
                enabled: false
            },
            sessionManagement: {
                sessionDuration: 720
            },
            passwordPolicy: {
                minimumLength: 8
            }
        }
        setLocalSettings(defaultSettings)
        onSettingsChange(defaultSettings)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Settings
                    </CardTitle>
                    <CardDescription>
                        Configure basic security preferences for your account
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Two-Factor Authentication
                        {localSettings.twoFactorAuth?.enabled && (
                            <Badge variant="default" className="ml-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Enabled
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="twoFactorEnabled">Enable Two-Factor Authentication</Label>
                            <div className="text-sm text-muted-foreground">
                                Require a second form of authentication when logging in
                            </div>
                        </div>
                        <Switch
                            id="twoFactorEnabled"
                            checked={localSettings.twoFactorAuth?.enabled || false}
                            onCheckedChange={(checked) => handleChange('twoFactorAuth', 'enabled', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Session Management</CardTitle>
                    <CardDescription>
                        Control how long you stay logged in
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                        <Input
                            id="sessionDuration"
                            type="number"
                            min="30"
                            max="1440"
                            value={localSettings.sessionManagement?.sessionDuration || 720}
                            onChange={(e) => handleChange('sessionManagement', 'sessionDuration', parseInt(e.target.value))}
                        />
                        <div className="text-sm text-muted-foreground">
                            How long you stay logged in (30 minutes - 24 hours)
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Password Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Password Requirements</CardTitle>
                    <CardDescription>
                        Set minimum password requirements
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="minimumLength">Minimum Password Length</Label>
                        <Input
                            id="minimumLength"
                            type="number"
                            min="6"
                            max="32"
                            value={localSettings.passwordPolicy?.minimumLength || 8}
                            onChange={(e) => handleChange('passwordPolicy', 'minimumLength', parseInt(e.target.value))}
                        />
                        <div className="text-sm text-muted-foreground">
                            Minimum number of characters required for passwords
                        </div>
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