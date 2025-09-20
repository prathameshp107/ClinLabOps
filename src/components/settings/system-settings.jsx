"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Save, RotateCcw, Monitor, AlertTriangle } from "lucide-react"

export function SystemSettings({ settings, onSettingsChange, onSave }) {
    const [localSettings, setLocalSettings] = useState(settings)
    const [saving, setSaving] = useState(false)

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
        setSaving(true)
        try {
            await onSave(localSettings)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        System Settings
                        <Badge variant="destructive" className="ml-2">Admin Only</Badge>
                    </CardTitle>
                    <CardDescription>
                        Advanced system configuration and maintenance settings
                    </CardDescription>
                </CardHeader>
            </Card>

            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    These settings affect the entire system and should only be modified by administrators.
                    Changes may require system restart.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Maintenance Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Enable Maintenance Mode</Label>
                        <Switch
                            checked={localSettings.maintenance?.maintenanceMode || false}
                            onCheckedChange={(checked) => handleChange('maintenance', 'maintenanceMode', checked)}
                        />
                    </div>

                    {localSettings.maintenance?.maintenanceMode && (
                        <div className="space-y-2">
                            <Label>Maintenance Message</Label>
                            <Input
                                value={localSettings.maintenance?.maintenanceMessage || ''}
                                onChange={(e) => handleChange('maintenance', 'maintenanceMessage', e.target.value)}
                                placeholder="System is under maintenance. Please try again later."
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Performance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Enable Caching</Label>
                        <Switch
                            checked={localSettings.performance?.cacheEnabled !== false}
                            onCheckedChange={(checked) => handleChange('performance', 'cacheEnabled', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Enable Compression</Label>
                        <Switch
                            checked={localSettings.performance?.compressionEnabled !== false}
                            onCheckedChange={(checked) => handleChange('performance', 'compressionEnabled', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Logging Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Log Level</Label>
                        <Select
                            value={localSettings.logging?.level || 'info'}
                            onValueChange={(value) => handleChange('logging', 'level', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="debug">Debug</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="warn">Warning</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between">
                        <Button variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset to Defaults
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}