"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
    User,
    Mail,
    Phone,
    Building,
    Lock,
    Bell,
    Globe,
    Shield,
    LogOut,
    Edit,
    Upload,
    CheckCircle2,
    AlertCircle,
    Clock,
    Calendar,
    ChevronRight,
    BarChart2,
    Activity,
    Smartphone,
    Eye,
    EyeOff,
    Save,
    X,
    Check,
    Laptop,
    Moon,
    Sun,
    Trash2
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";


// Mock user data
const userData = {
    id: "usr_123456",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@labtasker.com",
    phone: "+1 (555) 123-4567",
    role: "Senior Researcher",
    department: "Oncology Research",
    avatar: "/avatars/sarah-johnson.jpg",
    lastLogin: "2023-11-12T08:30:00Z",
    tasksCreated: 42,
    tasksAssigned: 28,
    tasksCompleted: 35,
    joinDate: "2022-03-15T00:00:00Z",
    activeProjects: 5,
    daysActive: 245,
    twoFactorEnabled: true,
    notificationPreferences: {
        email: true,
        push: true,
        taskReminders: true,
        mentions: true,
        updates: false
    },
    language: "en-US",
    timezone: "America/New_York",
    theme: "system",
    profileCompletion: 85
};

// Mock activity data
const activityData = [
    {
        id: 1,
        type: "task_created",
        title: "Created a new task",
        description: "PCR Analysis for Project X",
        time: "2 hours ago",
        project: "Oncology Research"
    },
    {
        id: 2,
        type: "comment_added",
        title: "Added a comment",
        description: "Left feedback on sample preparation protocol",
        time: "Yesterday",
        project: "Clinical Trial XYZ"
    },
    {
        id: 3,
        type: "task_completed",
        title: "Completed a task",
        description: "Calibrate laboratory equipment",
        time: "2 days ago",
        project: "Lab Maintenance"
    },
    {
        id: 4,
        type: "document_uploaded",
        title: "Uploaded a document",
        description: "Research protocol documentation",
        time: "3 days ago",
        project: "Proteomics Study"
    },
    {
        id: 5,
        type: "task_assigned",
        title: "Assigned a task",
        description: "Review research grant proposal",
        time: "1 week ago",
        project: "Grant Applications"
    }
];

// Mock active sessions
const activeSessions = [
    {
        id: "sess_1",
        device: "MacBook Pro",
        browser: "Chrome",
        location: "Boston, MA",
        ip: "192.168.1.1",
        lastActive: "Active now",
        isCurrent: true
    },
    {
        id: "sess_2",
        device: "iPhone 13",
        browser: "Safari",
        location: "Boston, MA",
        ip: "192.168.1.2",
        lastActive: "2 hours ago",
        isCurrent: false
    },
    {
        id: "sess_3",
        device: "Windows PC",
        browser: "Firefox",
        location: "New York, NY",
        ip: "192.168.1.3",
        lastActive: "Yesterday",
        isCurrent: false
    }
];

export default function ProfilePage() {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState(userData);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(userData);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const fileInputRef = useRef(null);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditedUser(user);
    };

    const handleSaveProfile = () => {
        setUser(editedUser);
        setIsEditing(false);
        toast({
            title: "Profile updated",
            description: "Your profile information has been updated successfully.",
            variant: "success"
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = () => {
        // Password validation would go here
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "New password and confirmation must match.",
                variant: "destructive"
            });
            return;
        }

        // Reset form and show success
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        toast({
            title: "Password updated",
            description: "Your password has been changed successfully.",
            variant: "success"
        });
    };

    const handleNotificationChange = (key, value) => {
        setUser(prev => ({
            ...prev,
            notificationPreferences: {
                ...prev.notificationPreferences,
                [key]: value
            }
        }));

        toast({
            title: "Preferences updated",
            description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${value ? 'enabled' : 'disabled'}.`,
            variant: "success"
        });
    };

    const handleTwoFactorToggle = () => {
        setUser(prev => ({
            ...prev,
            twoFactorEnabled: !prev.twoFactorEnabled
        }));

        toast({
            title: "Two-factor authentication",
            description: `Two-factor authentication ${!user.twoFactorEnabled ? 'enabled' : 'disabled'}.`,
            variant: "success"
        });
    };

    const handleAvatarUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you would upload the file to a server
            // For this demo, we'll just simulate a successful upload
            const reader = new FileReader();
            reader.onload = (event) => {
                setUser(prev => ({
                    ...prev,
                    avatar: event.target.result
                }));

                toast({
                    title: "Avatar updated",
                    description: "Your profile picture has been updated successfully.",
                    variant: "success"
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setUser(prev => ({
            ...prev,
            theme: newTheme
        }));

        toast({
            title: "Theme updated",
            description: `Theme set to ${newTheme}.`,
            variant: "success"
        });
    };

    const handleLanguageChange = (value) => {
        setUser(prev => ({
            ...prev,
            language: value
        }));

        toast({
            title: "Language updated",
            description: `Language set to ${value}.`,
            variant: "success"
        });
    };

    const handleTimezoneChange = (value) => {
        setUser(prev => ({
            ...prev,
            timezone: value
        }));

        toast({
            title: "Timezone updated",
            description: `Timezone set to ${value}.`,
            variant: "success"
        });
    };

    const handleSessionTerminate = (sessionId) => {
        // In a real app, you would call an API to terminate the session
        toast({
            title: "Session terminated",
            description: "The selected session has been terminated.",
            variant: "success"
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate time since join date
    const calculateTimeSinceJoin = (dateString) => {
        const joinDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffYears > 0) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
        } else if (diffMonths > 0) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8 pb-20">
            <Toaster />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-lg shadow-sm border border-border/50"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>
                <Button variant="outline" onClick={() => window.history.back()} className="mt-2 md:mt-0">
                    <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Dashboard
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - User Overview Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Profile Overview Card */}
                    <Card className="overflow-hidden border-none shadow-md">
                        <CardHeader className="relative p-0">
                            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40"></div>
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 p-1.5 rounded-full bg-background shadow-md">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 border-4 border-background">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <button
                                        onClick={handleAvatarUpload}
                                        className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <Upload className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-16 text-center">
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.role}</p>
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                                <Building className="h-3.5 w-3.5" />
                                <span>{user.department}</span>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Profile Completion</span>
                                    <span className="font-medium">{user.profileCompletion}%</span>
                                </div>
                                <Progress value={user.profileCompletion} className="h-2" />

                                <div className="grid grid-cols-3 gap-2 pt-2">
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                                        <span className="text-xl font-bold">{user.tasksCreated}</span>
                                        <span className="text-xs text-muted-foreground">Created</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                                        <span className="text-xl font-bold">{user.tasksCompleted}</span>
                                        <span className="text-xs text-muted-foreground">Completed</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
                                        <span className="text-xl font-bold">{user.activeProjects}</span>
                                        <span className="text-xs text-muted-foreground">Projects</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1 text-left">
                                        <p className="text-sm text-muted-foreground">Member since</p>
                                        <p className="text-sm font-medium">{formatDate(user.joinDate)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1 text-left">
                                        <p className="text-sm text-muted-foreground">Last login</p>
                                        <p className="text-sm font-medium">
                                            {new Date(user.lastLogin).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1 text-left">
                                        <p className="text-sm text-muted-foreground">Account age</p>
                                        <p className="text-sm font-medium">{calculateTimeSinceJoin(user.joinDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleEditToggle}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Activity Snapshot */}
                    <Card className="border-none shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[300px]">
                                <div className="px-6 pb-6">
                                    {activityData.map((activity, index) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 * index }}
                                            className="relative pl-6 pb-6"
                                        >
                                            {index < activityData.length - 1 && (
                                                <div className="absolute left-2.5 top-3 w-px h-full bg-muted-foreground/20"></div>
                                            )}
                                            <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{activity.title}</p>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {activity.project}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column - Settings Tabs */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid grid-cols-4 mb-6">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                            <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        </TabsList>

                        {/* Personal Information Tab */}
                        <TabsContent value="personal">
                            <Card className="border-none shadow-md">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">Personal Information</CardTitle>
                                            <CardDescription className="mt-1.5">
                                                Update your personal details and contact information
                                            </CardDescription>
                                        </div>
                                        {!isEditing && (
                                            <Button onClick={handleEditToggle} variant="outline" className="h-9">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Information
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2.5">
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={isEditing ? editedUser.name : user.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`h-10 ${!isEditing ? "bg-muted/50" : ""}`}
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label htmlFor="email" className="text-sm font-medium">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={isEditing ? editedUser.email : user.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`h-10 ${!isEditing ? "bg-muted/50" : ""}`}
                                                placeholder="Enter your email address"
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label htmlFor="phone" className="text-sm font-medium">
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={isEditing ? editedUser.phone : user.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`h-10 ${!isEditing ? "bg-muted/50" : ""}`}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label htmlFor="department" className="text-sm font-medium">
                                                Department
                                            </Label>
                                            <Input
                                                id="department"
                                                name="department"
                                                value={isEditing ? editedUser.department : user.department}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`h-10 ${!isEditing ? "bg-muted/50" : ""}`}
                                                placeholder="Enter your department"
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label htmlFor="role" className="text-sm font-medium">
                                                Role
                                            </Label>
                                            <Input
                                                id="role"
                                                name="role"
                                                value={isEditing ? editedUser.role : user.role}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`h-10 ${!isEditing ? "bg-muted/50" : ""}`}
                                                placeholder="Enter your role"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                {isEditing && (
                                    <CardFooter className="flex justify-end gap-3 pt-6">
                                        <Button 
                                            variant="outline" 
                                            onClick={handleEditToggle}
                                            className="h-9"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleSaveProfile}
                                            className="h-9"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <div className="space-y-6">
                                {/* Password Update */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">Current Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="currentPassword"
                                                        name="currentPassword"
                                                        type={showPassword ? "text" : "password"}
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={handlePasswordSubmit}>
                                            Update Password
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Two-Factor Authentication */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Two-Factor Authentication</CardTitle>
                                        <CardDescription>
                                            Add an extra layer of security to your account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-medium">Two-factor authentication</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.twoFactorEnabled
                                                        ? "Your account is protected with two-factor authentication"
                                                        : "Enable two-factor authentication for enhanced security"}
                                                </p>
                                            </div>
                                            <Switch
                                                checked={user.twoFactorEnabled}
                                                onCheckedChange={handleTwoFactorToggle}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Active Sessions */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Active Sessions</CardTitle>
                                        <CardDescription>
                                            Manage your active sessions across devices
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {activeSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className={`flex items-center justify-between p-4 rounded-lg ${session.isCurrent ? "bg-primary/10" : "bg-muted/50"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${session.isCurrent ? "bg-primary/20" : "bg-muted"
                                                            }`}>
                                                            {session.device.includes("iPhone") || session.device.includes("Android") ? (
                                                                <Smartphone className="h-5 w-5" />
                                                            ) : (
                                                                <Laptop className="h-5 w-5" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium">{session.device}</p>
                                                                {session.isCurrent && (
                                                                    <Badge variant="outline" className="text-xs">Current</Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                <span>{session.browser}</span>
                                                                <span>•</span>
                                                                <span>{session.location}</span>
                                                                <span>•</span>
                                                                <span>{session.lastActive}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!session.isCurrent && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleSessionTerminate(session.id)}
                                                        >
                                                            <LogOut className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Preferences Tab */}
                        <TabsContent value="preferences">
                            <div className="space-y-6">
                                {/* Theme Settings */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Appearance</CardTitle>
                                        <CardDescription>
                                            Customize the appearance of the application
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div
                                                className={`relative cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center ${user.theme === "light" ? "border-primary" : "border-transparent"
                                                    }`}
                                                onClick={() => handleThemeChange("light")}
                                            >
                                                <div className="h-24 w-full rounded-md bg-[#f8fafc] border mb-3 flex items-center justify-center">
                                                    <Sun className="h-6 w-6 text-[#64748b]" />
                                                </div>
                                                <span className="font-medium">Light</span>
                                                {user.theme === "light" && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div
                                                className={`relative cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center ${user.theme === "dark" ? "border-primary" : "border-transparent"
                                                    }`}
                                                onClick={() => handleThemeChange("dark")}
                                            >
                                                <div className="h-24 w-full rounded-md bg-[#1e293b] border border-[#334155] mb-3 flex items-center justify-center">
                                                    <Moon className="h-6 w-6 text-[#94a3b8]" />
                                                </div>
                                                <span className="font-medium">Dark</span>
                                                {user.theme === "dark" && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div
                                                className={`relative cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center ${user.theme === "system" ? "border-primary" : "border-transparent"
                                                    }`}
                                                onClick={() => handleThemeChange("system")}
                                            >
                                                <div className="h-24 w-full rounded-md bg-gradient-to-r from-[#f8fafc] to-[#1e293b] border mb-3 flex items-center justify-center">
                                                    <div className="flex">
                                                        <Sun className="h-6 w-6 text-[#64748b]" />
                                                        <Moon className="h-6 w-6 text-[#94a3b8] -ml-1" />
                                                    </div>
                                                </div>
                                                <span className="font-medium">System</span>
                                                {user.theme === "system" && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Language and Timezone */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Language & Region</CardTitle>
                                        <CardDescription>
                                            Set your preferred language and timezone
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Language</Label>
                                                <Select
                                                    value={user.language}
                                                    onValueChange={handleLanguageChange}
                                                >
                                                    <SelectTrigger id="language">
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="en-US">English (US)</SelectItem>
                                                        <SelectItem value="en-GB">English (UK)</SelectItem>
                                                        <SelectItem value="fr-FR">French</SelectItem>
                                                        <SelectItem value="de-DE">German</SelectItem>
                                                        <SelectItem value="es-ES">Spanish</SelectItem>
                                                        <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                                                        <SelectItem value="ja-JP">Japanese</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="timezone">Timezone</Label>
                                                <Select
                                                    value={user.timezone}
                                                    onValueChange={handleTimezoneChange}
                                                >
                                                    <SelectTrigger id="timezone">
                                                        <SelectValue placeholder="Select timezone" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                                        <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                                                        <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                                                        <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notification Preferences */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Notification Preferences</CardTitle>
                                        <CardDescription>
                                            Manage how you receive notifications
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive notifications via email
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="email-notifications"
                                                    checked={user.notificationPreferences.email}
                                                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                                                />
                                            </div>

                                            <Separator />

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="push-notifications">Push Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive notifications in the browser
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="push-notifications"
                                                    checked={user.notificationPreferences.push}
                                                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                                                />
                                            </div>

                                            <Separator />

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="task-reminders">Task Reminders</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Get reminders about upcoming and overdue tasks
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="task-reminders"
                                                    checked={user.notificationPreferences.taskReminders}
                                                    onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                                                />
                                            </div>

                                            <Separator />

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="mentions">Mentions</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Get notified when someone mentions you
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="mentions"
                                                    checked={user.notificationPreferences.mentions}
                                                    onCheckedChange={(checked) => handleNotificationChange('mentions', checked)}
                                                />
                                            </div>

                                            <Separator />

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="updates">System Updates</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Get notified about system updates and new features
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="updates"
                                                    checked={user.notificationPreferences.updates}
                                                    onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Statistics Tab */}
                        <TabsContent value="statistics">
                            <div className="space-y-6">
                                {/* Task Statistics */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Task Statistics</CardTitle>
                                        <CardDescription>
                                            Overview of your task performance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Task Completion Chart */}
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-medium">Task Completion Rate</h3>
                                                <div className="h-[200px] relative">
                                                    {/* This would be a chart in a real implementation */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
                                                            <div
                                                                className="absolute inset-0 rounded-full border-8 border-primary"
                                                                style={{
                                                                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(Math.PI * 2 * (user.tasksCompleted / user.tasksAssigned))
                                                                        }% ${50 - 50 * Math.sin(Math.PI * 2 * (user.tasksCompleted / user.tasksAssigned))
                                                                        }%, 50% 50%)`
                                                                }}
                                                            ></div>
                                                            <div className="text-center">
                                                                <div className="text-2xl font-bold">
                                                                    {Math.round((user.tasksCompleted / user.tasksAssigned) * 100)}%
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">Completion</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="p-2 rounded-lg bg-muted/50">
                                                        <p className="text-xs text-muted-foreground">Assigned</p>
                                                        <p className="text-lg font-bold">{user.tasksAssigned}</p>
                                                    </div>
                                                    <div className="p-2 rounded-lg bg-muted/50">
                                                        <p className="text-xs text-muted-foreground">Completed</p>
                                                        <p className="text-lg font-bold">{user.tasksCompleted}</p>
                                                    </div>
                                                    <div className="p-2 rounded-lg bg-muted/50">
                                                        <p className="text-xs text-muted-foreground">Pending</p>
                                                        <p className="text-lg font-bold">{user.tasksAssigned - user.tasksCompleted}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Activity Heatmap */}
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-medium">Activity Heatmap</h3>
                                                <div className="h-[200px] bg-muted/30 rounded-lg flex items-center justify-center">
                                                    <p className="text-muted-foreground text-sm">Activity heatmap would go here</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-3 w-3 rounded-sm bg-primary/20"></div>
                                                        <span className="text-xs text-muted-foreground">Less</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="h-3 w-3 rounded-sm bg-primary/40"></div>
                                                        <div className="h-3 w-3 rounded-sm bg-primary/60"></div>
                                                        <div className="h-3 w-3 rounded-sm bg-primary/80"></div>
                                                        <div className="h-3 w-3 rounded-sm bg-primary"></div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs text-muted-foreground">More</span>
                                                        <div className="h-3 w-3 rounded-sm bg-primary"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Project Involvement */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Project Involvement</CardTitle>
                                        <CardDescription>
                                            Overview of your project participation
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="p-4 rounded-lg bg-muted/30 text-center">
                                                    <p className="text-sm text-muted-foreground">Active Projects</p>
                                                    <p className="text-3xl font-bold mt-1">{user.activeProjects}</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-muted/30 text-center">
                                                    <p className="text-sm text-muted-foreground">Days Active</p>
                                                    <p className="text-3xl font-bold mt-1">{user.daysActive}</p>
                                                </div>
                                                <div className="p-4 rounded-lg bg-muted/30 text-center">
                                                    <p className="text-sm text-muted-foreground">Avg. Tasks per Project</p>
                                                    <p className="text-3xl font-bold mt-1">
                                                        {Math.round(user.tasksAssigned / user.activeProjects)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Project Contribution</h3>
                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Oncology Research</span>
                                                            <span>65%</span>
                                                        </div>
                                                        <Progress value={65} className="h-2" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Clinical Trial XYZ</span>
                                                            <span>42%</span>
                                                        </div>
                                                        <Progress value={42} className="h-2" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Lab Maintenance</span>
                                                            <span>28%</span>
                                                        </div>
                                                        <Progress value={28} className="h-2" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Proteomics Study</span>
                                                            <span>85%</span>
                                                        </div>
                                                        <Progress value={85} className="h-2" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Grant Applications</span>
                                                            <span>15%</span>
                                                        </div>
                                                        <Progress value={15} className="h-2" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Performance Metrics */}
                                <Card className="border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle>Performance Metrics</CardTitle>
                                        <CardDescription>
                                            Your performance over time
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[250px] bg-muted/30 rounded-lg flex items-center justify-center">
                                            <p className="text-muted-foreground text-sm">Performance chart would go here</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                            <div className="p-3 rounded-lg bg-muted/30">
                                                <p className="text-xs text-muted-foreground">Avg. Completion Time</p>
                                                <p className="text-lg font-bold mt-1">3.2 days</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-muted/30">
                                                <p className="text-xs text-muted-foreground">On-time Rate</p>
                                                <p className="text-lg font-bold mt-1">92%</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-muted/30">
                                                <p className="text-xs text-muted-foreground">Collaboration Score</p>
                                                <p className="text-lg font-bold mt-1">8.7/10</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-muted/30">
                                                <p className="text-xs text-muted-foreground">Efficiency Rating</p>
                                                <p className="text-lg font-bold mt-1">A+</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Danger Zone */}
                    <Card className="border-none shadow-md border-destructive/20">
                        <CardHeader className="text-destructive">
                            <CardTitle>Danger Zone</CardTitle>
                            <CardDescription className="text-destructive/80">
                                Irreversible account actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="font-medium">Delete Account</p>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently delete your account and all associated data
                                        </p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove all of your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
                                                    <Input id="confirm-delete" placeholder="DELETE" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button variant="destructive">
                                                    I understand, delete my account
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}