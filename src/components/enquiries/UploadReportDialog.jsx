"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, File, X, CheckCircle, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function UploadReportDialog({ open, onOpenChange, enquiryId, onSuccess }) {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [reportTitle, setReportTitle] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [reportType, setReportType] = useState("final");
    const [isFinalReport, setIsFinalReport] = useState(true);
    const [notifyCustomer, setNotifyCustomer] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    // Handle file drop
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    // Handle drag events
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Remove file from selection
    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get file icon based on type
    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        switch (extension) {
            case 'pdf':
                return "📄";
            case 'doc':
            case 'docx':
                return "📝";
            case 'xls':
            case 'xlsx':
                return "📊";
            case 'csv':
                return "📋";
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return "🖼️";
            default:
                return "📁";
        }
    };

    // Reset form
    const resetForm = () => {
        setFiles([]);
        setReportTitle("");
        setReportDescription("");
        setReportType("final");
        setIsFinalReport(true);
        setNotifyCustomer(true);
        setUploading(false);
        setUploadStatus(null);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            toast({
                title: "No files selected",
                description: "Please select at least one file to upload",
                variant: "destructive"
            });
            return;
        }

        if (!reportTitle.trim()) {
            toast({
                title: "Report title required",
                description: "Please provide a title for this report",
                variant: "destructive"
            });
            return;
        }

        setUploading(true);

        // Simulate upload process
        setTimeout(() => {
            // In a real application, you would upload files to a server here
            setUploadStatus('success');
            setUploading(false);

            // Show success toast
            toast({
                title: "Upload successful",
                description: `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`,
                variant: "default"
            });

            // Call success callback and close modal after 1 second
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onOpenChange(false);
                resetForm();
            }, 1000);
        }, 2000);
    };

    // Handle modal close
    const handleClose = () => {
        if (!uploading) {
            resetForm();
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <DialogHeader>
                        <DialogTitle>Upload Report or Document</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="reportTitle">Report Title</Label>
                            <Input
                                id="reportTitle"
                                placeholder="Enter a descriptive title for this report"
                                value={reportTitle}
                                onChange={(e) => setReportTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reportDescription">Description (Optional)</Label>
                            <Textarea
                                id="reportDescription"
                                placeholder="Provide additional details about this report"
                                value={reportDescription}
                                onChange={(e) => setReportDescription(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reportType">Report Type</Label>
                            <Select
                                value={reportType}
                                onValueChange={setReportType}
                            >
                                <SelectTrigger id="reportType">
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="preliminary">Preliminary Report</SelectItem>
                                    <SelectItem value="progress">Progress Update</SelectItem>
                                    <SelectItem value="test">Test Results</SelectItem>
                                    <SelectItem value="final">Final Report</SelectItem>
                                    <SelectItem value="other">Other Document</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label>Upload Files</Label>

                            {/* Drag and drop area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${files.length > 0 ? 'border-muted bg-muted/50' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}`}
                                onClick={triggerFileInput}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <Upload className="h-10 w-10 text-muted-foreground/50" />
                                    <h3 className="text-lg font-medium">Drag files here or click to browse</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Support for PDF, Word, Excel, CSV, and image files
                                    </p>
                                </div>
                            </div>

                            {/* File list */}
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                        {files.map((file, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-xl">{getFileIcon(file)}</div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-medium truncate max-w-[300px]">{file.name}</p>
                                                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(index);
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="isFinalReport">Mark as Final Report</Label>
                                    <p className="text-sm text-muted-foreground">
                                        This will be highlighted as the final report for this enquiry
                                    </p>
                                </div>
                                <Switch
                                    id="isFinalReport"
                                    checked={isFinalReport}
                                    onCheckedChange={setIsFinalReport}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="notifyCustomer">Notify Customer</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send an email notification to the customer about this upload
                                    </p>
                                </div>
                                <Switch
                                    id="notifyCustomer"
                                    checked={notifyCustomer}
                                    onCheckedChange={setNotifyCustomer}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleClose}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={uploading || files.length === 0 || !reportTitle.trim()}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {uploading ? (
                                <>
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Upload Status */}
                {uploadStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 border-t"
                    >
                        <div className={`flex items-center space-x-4 p-4 rounded-lg ${uploadStatus === 'success' ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                            }`}>
                            {uploadStatus === 'success' ? (
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-medium">
                                    {uploadStatus === 'success' ? 'Upload Successful' : 'Upload Failed'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {uploadStatus === 'success'
                                        ? `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully.`
                                        : 'There was an error uploading your files. Please try again.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </DialogContent>
        </Dialog>
    );
}