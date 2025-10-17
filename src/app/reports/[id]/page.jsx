"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, ArrowLeft, Calendar, FileText, User, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import ReportCharts from "@/components/reports/report-charts";

const ReportDetailPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data for demonstration
    const mockReport = {
        id: id,
        title: "Regulatory Compliance Report",
        type: "regulatory",
        format: "pdf",
        created: new Date().toISOString(),
        generatedBy: "System",
        status: "generated",
        size: 2457600, // 2.4 MB
        tags: ["regulatory", "compliance", "audit"],
        description: "This report provides an overview of all compliance requirements and audit findings.",
        filters: {
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "active",
            department: "Compliance"
        },
        summary: {
            totalItems: 24,
            byStatus: {
                "pending": 5,
                "in-progress": 12,
                "completed": 7
            },
            byCategory: {
                "safety": 10,
                "environmental": 8,
                "quality": 6
            },
            averageCompletion: 72
        },
        data: [
            {
                id: "1",
                name: "Safety Protocol Review",
                status: "completed",
                priority: "high",
                progress: 100,
                startDate: "2025-03-15",
                endDate: "2025-04-30",
                team: "Safety Team"
            },
            {
                id: "2",
                name: "Environmental Compliance Audit",
                status: "in-progress",
                priority: "high",
                progress: 75,
                startDate: "2025-01-10",
                endDate: "2025-06-30",
                team: "Environmental Team"
            },
            {
                id: "3",
                name: "Quality Assurance Checklist",
                status: "pending",
                priority: "medium",
                progress: 0,
                startDate: "2025-04-01",
                endDate: "2025-11-15",
                team: "Quality Team"
            }
        ]
    };

    useEffect(() => {
        // Simulate API call to fetch report details
        setTimeout(() => {
            setReport(mockReport);
            setLoading(false);
        }, 500);
    }, [id]);

    const handleDownload = () => {
        toast.info(`Downloading ${report.title} as ${report.format}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "generated":
                return <Badge variant="default">Generated</Badge>;
            case "pending":
                return <Badge variant="secondary">Pending</Badge>;
            case "scheduled":
                return <Badge variant="outline">Scheduled</Badge>;
            case "generating":
                return <Badge variant="outline">Generating...</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "low":
                return <Badge variant="secondary">Low</Badge>;
            case "medium":
                return <Badge variant="default">Medium</Badge>;
            case "high":
                return <Badge variant="destructive">High</Badge>;
            default:
                return <Badge variant="secondary">{priority}</Badge>;
        }
    };

    const getFormatIcon = (format) => {
        // Handle case where format might be undefined
        if (!format) {
            return <span className="font-bold">N/A</span>;
        }

        switch (format.toLowerCase()) {
            case "pdf":
                return <span className="text-red-500 font-bold">PDF</span>;
            case "xlsx":
                return <span className="text-green-500 font-bold">XLSX</span>;
            case "csv":
                return <span className="text-blue-500 font-bold">CSV</span>;
            default:
                return <span className="font-bold">{format.toUpperCase()}</span>;
        }
    };

    const formatDateString = (dateString) => {
        // Handle case where dateString might be invalid
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return "Invalid Date";
            }
            return format(date, "PPP");
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Report not found</h2>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                    The requested report could not be found. It may have been deleted or you may not have permission to view it.
                </p>
                <div className="flex gap-2">
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                    <Button onClick={() => router.push('/reports')}>
                        <FileText className="mr-2 h-4 w-4" />
                        View All Reports
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{report.title}</h1>
                    <p className="text-muted-foreground">
                        Detailed view of your report
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Button onClick={handleDownload} className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Report Details</CardTitle>
                        <CardDescription>
                            Overview and summary information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Report Type</h3>
                                    <p className="font-medium">
                                        {report.type === "regulatory" && "Regulatory Reports"}
                                        {report.type === "research" && "Research Reports"}
                                        {report.type === "miscellaneous" && "Miscellaneous Reports"}
                                        {!["regulatory", "research", "miscellaneous"].includes(report.type) && report.type}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    {getFormatIcon(report.format)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Format</h3>
                                    <p className="font-medium">{report.format.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                    <div>{getStatusBadge(report.status)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Generated By</h3>
                                    <p className="font-medium">{report.generatedBy}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                                    <p className="font-medium">{formatDateString(report.created)}</p>
                                </div>
                            </div>

                            {report.size && (
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">File Size</h3>
                                        <p className="font-medium">{formatFileSize(report.size)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Filters Applied</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(report.filters).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between rounded-md bg-muted p-3">
                                        <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-sm">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold">{report.summary.totalItems || report.summary.totalProjects}</div>
                                        <div className="text-sm text-muted-foreground">Total Items</div>
                                    </CardContent>
                                </Card>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold">{report.summary.averageCompletion || report.summary.averageProgress}%</div>
                                        <div className="text-sm text-muted-foreground">Avg. Completion</div>
                                    </CardContent>
                                </Card>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold">{report.summary.byStatus.active || report.summary.byStatus['in-progress'] || 0}</div>
                                        <div className="text-sm text-muted-foreground">Active</div>
                                    </CardContent>
                                </Card>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold">{report.summary.byPriority?.high || report.summary.byCategory?.safety || 0}</div>
                                        <div className="text-sm text-muted-foreground">High Priority</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {report.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {report.description || "No description provided for this report."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Charts Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Visual Analytics</CardTitle>
                    <CardDescription>
                        Charts and graphs representing the report data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ReportCharts summary={report.summary} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Data</CardTitle>
                    <CardDescription>
                        Breakdown of all items included in this report
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Item</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-left py-3 px-4">Priority</th>
                                    <th className="text-left py-3 px-4">Progress</th>
                                    <th className="text-left py-3 px-4">Dates</th>
                                    <th className="text-left py-3 px-4">Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.data.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-muted/50">
                                        <td className="py-3 px-4 font-medium">{item.name}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant={item.status === 'completed' ? 'default' : item.status === 'in-progress' ? 'secondary' : 'outline'}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">{getPriorityBadge(item.priority)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-secondary rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            {formatDateString(item.startDate)} - {formatDateString(item.endDate)}
                                        </td>
                                        <td className="py-3 px-4">{item.team}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportDetailPage;