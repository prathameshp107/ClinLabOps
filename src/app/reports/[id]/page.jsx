"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, ArrowLeft, Calendar, FileText, User, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { reportService } from "@/services/reportService";
import { FileViewer } from "@/components/reports/file-viewer";
import { formatFileSize } from "@/lib/utils";

const ReportDetailPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const fetchedReport = await reportService.getById(id);
                setReport(fetchedReport);
            } catch (error) {
                console.error("Error fetching report:", error);
                toast.error("Failed to load report details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    const handleDownload = async () => {
        try {
            await reportService.download(report._id);
            toast.success("Download started");
        } catch (error) {
            console.error('Download error:', error);
            toast.error("Failed to download report");
        }
    };

    const getFormatIcon = (format) => {
        if (!format) return <span className="font-bold">N/A</span>;
        switch (format.toLowerCase()) {
            case "pdf": return <span className="text-red-500 font-bold">PDF</span>;
            case "xlsx": return <span className="text-green-500 font-bold">XLSX</span>;
            case "csv": return <span className="text-blue-500 font-bold">CSV</span>;
            case "json": return <span className="text-yellow-500 font-bold">JSON</span>;
            default: return <span className="font-bold">{format.toUpperCase()}</span>;
        }
    };

    const formatDateString = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid Date";
            return format(date, "PPP p");
        } catch (error) {
            return "Invalid Date";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center py-12 h-screen">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Report not found</h2>
                <Button onClick={() => router.push('/reports')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Reports
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{report.title}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Badge variant="outline" className="capitalize">
                                    {report.type?.replace(/([A-Z])/g, ' $1').trim()}
                                </Badge>
                                <span>•</span>
                                <span>Uploaded {formatDateString(report.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - File Viewer */}
                    <div className={`${isMaximized ? 'fixed inset-0 z-50 bg-background p-6' : 'lg:col-span-2 space-y-6'}`}>
                        <Card className={`flex flex-col ${isMaximized ? 'h-full shadow-2xl' : 'h-[800px]'}`}>
                            <CardHeader className="border-b bg-muted/30 pb-3 shrink-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-base">Document Preview</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{report.format?.toUpperCase()}</Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 ml-2"
                                            onClick={() => setIsMaximized(!isMaximized)}
                                            title={isMaximized ? "Minimize view" : "Maximize view"}
                                        >
                                            {isMaximized ? (
                                                <Minimize2 className="h-4 w-4" />
                                            ) : (
                                                <Maximize2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden bg-muted/10 relative">
                                <div className="absolute inset-0 p-4 overflow-auto flex flex-col">
                                    <FileViewer report={report} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Details */}
                    {!isMaximized && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Description</span>
                                        <p className="mt-1 text-sm">{report.description || "No description provided."}</p>
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">File Size</span>
                                            <p className="font-medium">{formatFileSize(report.fileSize || report.size || 0)}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Format</span>
                                            <p className="font-medium">{getFormatIcon(report.format)}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Uploaded By</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="bg-primary/10 p-1 rounded-full">
                                                    <User className="h-3 w-3 text-primary" />
                                                </div>
                                                <span className="font-medium text-sm">{report.uploadedBy?.name || "Unknown"}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Type</span>
                                            <p className="font-medium capitalize">{report.type?.replace(/([A-Z])/g, ' $1').trim()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportDetailPage;