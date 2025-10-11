"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { toast } from "@/components/ui/use-toast"
import {
    PlusCircle,
    Upload,
    FileText,
    Edit,
    RefreshCw,
    File,
    FileSpreadsheet,
    FileTextIcon,
    FileJson,
    FileBarChart,
    Image,
    Eye,
    Download,
    Calendar,
    User
} from "lucide-react"
import { reportService } from "@/services/reportService"
import { formatFileSize } from "@/lib/utils"
import config from '@/config/config'

function ReportsPage() {
    const router = useRouter()
    const [reports, setReports] = useState([])
    const [filteredReports, setFilteredReports] = useState([])
    const [filterType, setFilterType] = useState("all")
    const [loading, setLoading] = useState(true)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)

    const [newReport, setNewReport] = useState({
        title: "",
        type: "",
        format: "pdf",
        description: "",
        file: null
    })

    // Fetch reports from API
    const fetchReports = useCallback(async () => {
        try {
            setLoading(true)
            // Always fetch all reports to enable local filtering
            const response = await reportService.getAll()
            const reportsData = response.reports || (Array.isArray(response) ? response : [])
            setReports(reportsData)
        } catch (error) {
            console.error('Failed to fetch reports:', error)
            setReports([])
            toast({
                title: "Error",
                description: "Failed to load reports. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    useEffect(() => {
        // Filter reports locally based on filterType
        if (filterType === "all") {
            setFilteredReports(reports)
        } else {
            setFilteredReports(reports.filter(report => report.type === filterType))
        }
    }, [reports, filterType])

    const handleUploadReport = async () => {
        if (!newReport.type || !newReport.file) {
            toast({
                title: "Validation Error",
                description: "Please select a report type and file.",
                variant: "destructive",
            })
            return
        }

        // If no title is provided, use the filename (without extension) as the title
        let reportTitle = newReport?.file?.name ? newReport.file.name : newReport.title;
        if (!reportTitle && newReport.file) {
            // Extract filename without extension
            const fileNameWithoutExt = newReport.file.name.replace(/\.[^/.]+$/, "");
            reportTitle = fileNameWithoutExt;
        }

        try {
            const formData = new FormData()
            formData.append('title', reportTitle)
            formData.append('type', newReport.type)
            formData.append('description', newReport.description)
            formData.append('format', newReport.format)
            formData.append('file', newReport.file)

            const result = await reportService.upload(formData)

            if (result) {
                toast({
                    title: "Success",
                    description: "Report uploaded successfully!",
                })
                setIsUploadDialogOpen(false)
                setNewReport({ title: "", type: "", format: "pdf", description: "", file: null })
                fetchReports() // Refresh the reports list
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload report. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteReport = async (id) => {
        if (confirm("Are you sure you want to delete this report?")) {
            try {
                await reportService.delete(id)
                toast({
                    title: "Success",
                    description: "Report deleted successfully!",
                })
                fetchReports() // Refresh the reports list
            } catch (error) {
                console.error('Delete error:', error)
                toast({
                    title: "Delete Failed",
                    description: "Failed to delete report. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    const handleDownloadReport = async (report) => {
        try {
            await reportService.download(report._id)
        } catch (error) {
            console.error('Download error:', error)
            toast({
                title: "Error",
                description: "Failed to download report. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleViewReport = (report) => {
        setSelectedReport(report)
        setIsViewModalOpen(true)
    }

    const renderReportTable = (reportsToRender) => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3">Loading reports...</span>
                </div>
            )
        }

        if (!reportsToRender || reportsToRender.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                    <p className="text-muted-foreground mb-4">
                        {filterType === "all"
                            ? "Get started by uploading a new report."
                            : `No ${filterType} reports available.`}
                    </p>
                    <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Upload Report
                    </Button>
                </div>
            )
        }

        return (
            <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                Report
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                Type
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                Format
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                Uploaded By
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                Uploaded
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {reportsToRender.map((report) => (
                            <tr key={report._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                    <div className="flex items-center gap-3">
                                        {getFormatIcon(report.format)}
                                        <div>
                                            <div className="font-medium">{report.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {report.description || "No description"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                    <div className="capitalize">{report.type.replace(/([A-Z])/g, ' $1').trim()}</div>
                                </td>
                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                    <div className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold capitalize">
                                        {report.format}
                                    </div>
                                </td>
                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                    <div className="text-sm text-muted-foreground">
                                        {report.uploadedBy?.name || "Unknown User"}
                                    </div>
                                </td>
                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                    <div className="text-sm text-muted-foreground">
                                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}
                                    </div>
                                </td>
                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadReport(report)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewReport(report)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteReport(report._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const getFormatIcon = (format) => {
        switch (format?.toLowerCase()) {
            case 'pdf':
                return <FileText className="h-8 w-8 text-red-500" />
            case 'xlsx':
            case 'xls':
                return <FileSpreadsheet className="h-8 w-8 text-green-500" />
            case 'csv':
                return <FileBarChart className="h-8 w-8 text-blue-500" />
            case 'docx':
            case 'doc':
                return <FileTextIcon className="h-8 w-8 text-blue-700" />
            case 'json':
                return <FileJson className="h-8 w-8 text-yellow-500" />
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <Image className="h-8 w-8 text-purple-500" />
            default:
                return <File className="h-8 w-8 text-gray-500" />
        }
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Reports</h1>
                            <p className="text-muted-foreground">
                                Upload, view, and manage your reports
                            </p>
                        </div>
                        <Button onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Upload Report
                        </Button>
                    </div>

                    {/* View Report Modal */}
                    <Dialog open={isViewModalOpen} onOpenChange={(open) => setIsViewModalOpen(open)}>
                        <DialogContent className="sm:max-w-[600px] max-w-[95vw] p-0 rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
                            <DialogHeader className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 shrink-0">
                                <DialogTitle className="flex items-center gap-3 text-2xl">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        {selectedReport && getFormatIcon(selectedReport.format)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground">{selectedReport?.title}</span>
                                        <span className="text-sm font-normal text-muted-foreground">
                                            Detailed information about the report
                                        </span>
                                    </div>
                                </DialogTitle>
                            </DialogHeader>

                            {selectedReport && (
                                <div className="grid gap-5 px-6 py-4 overflow-y-auto flex-grow">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Type</Label>
                                        <div className="col-span-3">
                                            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
                                                {selectedReport.type?.replace(/([A-Z])/g, ' $1').trim() || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Format</Label>
                                        <div className="col-span-3">
                                            <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                                                {selectedReport.format || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">File Size</Label>
                                        <div className="col-span-3">
                                            <div className="flex items-center gap-2">
                                                <File className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{selectedReport.fileSize ? formatFileSize(selectedReport.fileSize) : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Uploaded By</Label>
                                        <div className="col-span-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-muted rounded-full p-1">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <span className="font-medium">{selectedReport.uploadedBy?.name || 'Unknown User'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Uploaded</Label>
                                        <div className="col-span-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-muted rounded-full p-1">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <span className="font-medium">
                                                    {selectedReport.createdAt
                                                        ? new Date(selectedReport.createdAt).toLocaleString()
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label className="text-right pt-2 font-medium">Description</Label>
                                        <div className="col-span-3">
                                            <div className="text-sm bg-muted/50 rounded-lg p-3 min-h-[60px]">
                                                {selectedReport.description || 'No description provided'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label className="text-right pt-2 font-medium">Preview</Label>
                                        <div className="col-span-3">
                                            {['jpg', 'jpeg', 'png', 'gif'].includes(selectedReport.format?.toLowerCase()) ? (
                                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                                    <img
                                                        src={`${config.api.backendUrl}${selectedReport.fileUrl}`}
                                                        alt={selectedReport.title}
                                                        className="w-full max-h-64 object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="border rounded-lg p-6 bg-muted/50 flex items-center justify-center min-h-40 shadow-sm">
                                                    <div className="text-center">
                                                        <div className="bg-muted rounded-full p-3 inline-block mb-3">
                                                            <FileText className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-sm text-muted-foreground font-medium">
                                                            Preview not available for {selectedReport.format?.toUpperCase()} files
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Download the file to view its contents
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="gap-2 sm:justify-end px-6 py-4 bg-muted/30 shrink-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => selectedReport && handleDownloadReport(selectedReport)}
                                    className="px-6"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Upload Report Dialog */}
                    <Dialog open={isUploadDialogOpen} onOpenChange={(open) => {
                        setIsUploadDialogOpen(open)
                        if (!open) {
                            // Reset form when closing
                            setNewReport({ title: "", type: "", format: "pdf", description: "", file: null })
                            setIsDragOver(false)
                        }
                    }}>
                        <DialogContent className="sm:max-w-[700px] max-w-[95vw] p-0 max-h-[90vh] flex flex-col">
                            <div className="p-6 overflow-y-auto flex-grow">
                                <DialogHeader className="pt-4 px-2">
                                    <DialogTitle className="text-2xl">Upload New Report</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details and upload your report file
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Title <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            value={newReport.title}
                                            onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                                            placeholder="Enter report title"
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">
                                            Report Type <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={newReport.type} onValueChange={(value) => setNewReport({ ...newReport, type: value })}>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select report type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="regulatory">Regulatory Reports</SelectItem>
                                                <SelectItem value="research">Research Reports</SelectItem>
                                                <SelectItem value="miscellaneous">Miscellaneous Reports</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={newReport.description}
                                            onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                                            placeholder="Enter report description"
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            File <span className="text-destructive">*</span>
                                        </Label>
                                        <div
                                            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${isDragOver
                                                ? 'border-primary bg-primary/10 scale-[1.02]'
                                                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                                                }`}
                                            onDragOver={(e) => {
                                                e.preventDefault()
                                                setIsDragOver(true)
                                            }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                setIsDragOver(false)
                                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                    const file = e.dataTransfer.files[0]
                                                    setNewReport({ ...newReport, file })
                                                    // Auto-detect format from file extension
                                                    const ext = file.name.split('.').pop().toLowerCase()
                                                    if (['pdf', 'xlsx', 'csv', 'docx', 'json', 'jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                                                        setNewReport(prev => ({ ...prev, format: ext }))
                                                    }
                                                }
                                            }}
                                            onClick={() => document.getElementById('file-input')?.click()}
                                        >
                                            <input
                                                id="file-input"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const file = e.target.files[0]
                                                        setNewReport({ ...newReport, file })
                                                        // Auto-detect format from file extension
                                                        const ext = file.name.split('.').pop().toLowerCase()
                                                        if (['pdf', 'xlsx', 'csv', 'docx', 'json', 'jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                                                            setNewReport(prev => ({ ...prev, format: ext }))
                                                        }
                                                    }
                                                }}
                                                accept=".pdf,.xlsx,.csv,.docx,.json,.jpg,.jpeg,.png,.gif"
                                            />
                                            {newReport.file ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                                                        <FileText className="h-10 w-10 text-primary" />
                                                    </div>
                                                    <p className="font-medium text-lg truncate max-w-full px-4">{newReport.file.name}</p>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        {formatFileSize(newReport.file.size)}
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setNewReport({ ...newReport, file: null })
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Change File
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-muted rounded-full p-4 mb-5">
                                                        <Upload className="h-12 w-12 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold mb-2">Drag & drop your file here</h3>
                                                    <p className="text-muted-foreground mb-1">
                                                        or click to browse files
                                                    </p>
                                                    <div className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium mt-3">
                                                        PDF, XLSX, CSV, DOCX, JSON, JPG, PNG, GIF
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center">
                                            Maximum file size: 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="gap-3 pt-4 px-6 pb-6 bg-muted/30 shrink-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsUploadDialogOpen(false)}
                                    className="h-11"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUploadReport}
                                    disabled={!newReport.type || !newReport.file}
                                    className="h-11 gap-2 px-6"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Report
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Tabs defaultValue="all" className="w-full">
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="all" onClick={() => setFilterType("all")}>All Reports</TabsTrigger>
                                <TabsTrigger value="regulatory" onClick={() => setFilterType("regulatory")}>Regulatory Reports</TabsTrigger>
                                <TabsTrigger value="research" onClick={() => setFilterType("research")}>Research Reports</TabsTrigger>
                                <TabsTrigger value="miscellaneous" onClick={() => setFilterType("miscellaneous")}>Miscellaneous Reports</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchReports}
                                    disabled={loading}
                                >
                                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card>
                                <CardHeader>
                                    <CardTitle>All Reports</CardTitle>
                                    <CardDescription>
                                        Manage all your uploaded and generated reports
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderReportTable(filteredReports)}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="regulatory">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Regulatory Reports</CardTitle>
                                    <CardDescription>
                                        Compliance and regulatory reports
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderReportTable(filteredReports.filter(report => report.type === "regulatory"))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="research">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Research Reports</CardTitle>
                                    <CardDescription>
                                        Scientific research and experimental reports
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderReportTable(filteredReports.filter(report => report.type === "research"))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="miscellaneous">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Miscellaneous Reports</CardTitle>
                                    <CardDescription>
                                        Other reports and documentation
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderReportTable(filteredReports.filter(report => report.type === "miscellaneous"))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ReportsPage