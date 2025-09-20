"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import {
    Settings,
    User,
    Bell,
    Shield,
    Database,
    Palette,
    Globe,
    Lock,
    Mail,
    Smartphone,
    Key,
    Users,
    FileText,
    Trash2,
    Download,
    Upload,
    AlertTriangle,
    CheckCircle,
    Clock,
    Monitor
} from "lucide-react"

// Import settings components
import { GeneralSettings } from "@/components/settings/general-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"
import { getSettings, updateSettings } from "@/services/settingsService"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general")
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(true)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const { toast } = useToast()

    // Load settings on component mount
    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            setLoading(true)
            const settingsData = await getSettings()
            setSettings(settingsData)
        } catch (error) {
            console.error('Error loading settings:', error)
            toast({
                title: "Error",
                description: "Failed to load settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSettingsChange = (section, newSettings) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...newSettings
            }
        }))
        setHasUnsavedChanges(true)
    }

    const saveSettings = async (section, sectionSettings) => {
        try {
            await updateSettings(section, sectionSettings)
            setHasUnsavedChanges(false)
            toast({
                title: "Settings saved",
                description: "Your settings have been updated successfully.",
                variant: "success",
            })
        } catch (error) {
            console.error('Error saving settings:', error)
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            })
        }
    }

    // Settings navigation configuration - simplified
    const settingsNavigation = [
        {
            id: "general",
            label: "General",
            icon: <Settings className="h-4 w-4" />,
            description: "Basic preferences and language settings",
            badge: null
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: <Bell className="h-4 w-4" />,
            description: "Email and app notification preferences",
            badge: null
        },
        {
            id: "security",
            label: "Security",
            icon: <Shield className="h-4 w-4" />,
            description: "Password and account security",
            badge: null
        },
        {
            id: "theme",
            label: "Appearance",
            icon: <Palette className="h-4 w-4" />,
            description: "Theme and display preferences",
            badge: null
        }
    ]

    if (loading) {
        return (
            <DashboardLayout>
                <div className="w-full px-4 py-6">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading settings...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="w-full px-4 py-6">
                {/* Page Header */}
                <div className="flex flex-col space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your account settings and application preferences
                            </p>
                        </div>
                        {hasUnsavedChanges && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Unsaved changes
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Settings Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    {/* Categories Navigation - Horizontal Toggle Style */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Categories</CardTitle>
                            <CardDescription className="text-sm">
                                Choose a settings category to configure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-muted/50 p-1">
                                {settingsNavigation.map((item) => (
                                    <TabsTrigger
                                        key={item.id}
                                        value={item.id}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                                            "hover:bg-background/50 transition-all duration-200 rounded-md"
                                        )}
                                    >
                                        <div className="flex-shrink-0">{item.icon}</div>
                                        <div className="text-center">
                                            <div className="font-medium text-sm">{item.label}</div>
                                            {item.badge && (
                                                <Badge variant={item.badge.variant} className="mt-1 text-xs">
                                                    {item.badge.text}
                                                </Badge>
                                            )}
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </CardContent>
                    </Card>

                    {/* Settings Content */}
                    <div className="w-full">
                        <TabsContent value="general" className="m-0">
                            <GeneralSettings
                                settings={settings.general || {}}
                                onSettingsChange={(newSettings) => handleSettingsChange('general', newSettings)}
                                onSave={(sectionSettings) => saveSettings('general', sectionSettings)}
                            />
                        </TabsContent>

                        <TabsContent value="notifications" className="m-0">
                            <NotificationSettings
                                settings={settings.notifications || {}}
                                onSettingsChange={(newSettings) => handleSettingsChange('notifications', newSettings)}
                                onSave={(sectionSettings) => saveSettings('notifications', sectionSettings)}
                            />
                        </TabsContent>

                        <TabsContent value="security" className="m-0">
                            <SecuritySettings
                                settings={settings.security || {}}
                                onSettingsChange={(newSettings) => handleSettingsChange('security', newSettings)}
                                onSave={(sectionSettings) => saveSettings('security', sectionSettings)}
                            />
                        </TabsContent>

                        <TabsContent value="theme" className="m-0">
                            <ThemeSettings
                                settings={settings.theme || {}}
                                onSettingsChange={(newSettings) => handleSettingsChange('theme', newSettings)}
                                onSave={(sectionSettings) => saveSettings('theme', sectionSettings)}
                            />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}