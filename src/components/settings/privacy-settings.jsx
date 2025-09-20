"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Save, RotateCcw, Lock } from "lucide-react"

export function PrivacySettings({ settings, onSettingsChange, onSave }) {
    const [localSettings, setLocalSettings] = useState(settings)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setLocalSettings(settings)
    }, [settings])

    const handleChange = (key, value) => {
        const newSettings = { ...localSettings, [key]: value }
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
                        <Lock className="h-5 w-5" />
                        Privacy Settings
                    </CardTitle>
                    <CardDescription>
                        Control your data privacy and visibility preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Activity Tracking</Label>
                            <div className="text-sm text-muted-foreground">
                                Allow the system to track your activity for analytics
                            </div>
                        </div>
                        <Switch
                            checked={localSettings.activityTracking || false}
                            onCheckedChange={(checked) => handleChange('activityTracking', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Share Usage Data</Label>
                            <div className="text-sm text-muted-foreground">
                                Help improve the product by sharing anonymous usage data
                            </div>
                        </div>
                        <Switch
                            checked={localSettings.shareUsageData || false}
                            onCheckedChange={(checked) => handleChange('shareUsageData', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => handleChange('activityTracking', false)}>
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