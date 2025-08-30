"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Save, RotateCcw, Globe } from "lucide-react"

export function IntegrationSettings({ settings, onSettingsChange, onSave }) {
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
                        <Globe className="h-5 w-5" />
                        Integration Settings
                    </CardTitle>
                    <CardDescription>
                        Connect with third-party services and APIs
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Slack Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Enable Slack Integration</Label>
                        <Switch
                            checked={localSettings.slack?.enabled || false}
                            onCheckedChange={(checked) => handleChange('slack', 'enabled', checked)}
                        />
                    </div>
                    {localSettings.slack?.enabled && (
                        <div className="space-y-2">
                            <Label>Workspace URL</Label>
                            <Input
                                value={localSettings.slack?.workspace || ''}
                                onChange={(e) => handleChange('slack', 'workspace', e.target.value)}
                                placeholder="your-workspace.slack.com"
                            />
                        </div>
                    )}
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