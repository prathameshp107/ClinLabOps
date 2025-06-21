"use client";

import { useState } from 'react';
import { Upload, X, FileText, FileSpreadsheet, FileBarChart2, FileArchive } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UploadReportDialog({ open, onOpenChange, onUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    tags: []
  });

  const reportTypes = [
    { value: 'Performance', label: 'Performance' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'Dashboard', label: 'Dashboard' },
    { value: 'Status', label: 'Status' },
    { value: 'Resource', label: 'Resource' },
    { value: 'Financial', label: 'Financial' },
    { value: 'Other', label: 'Other' }
  ];

  const tagOptions = [
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'performance', label: 'Performance' },
    { id: 'executive', label: 'Executive' },
    { id: 'team', label: 'Team' },
    { id: 'project', label: 'Project' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Set default title from filename without extension
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({
        ...prev,
        title: prev.title || fileName
      }));
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    if (!formData.title) {
      alert('Please enter a title for the report');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create report object
      const newReport = {
        id: `rep-${Date.now()}`,
        title: formData.title,
        type: formData.type || 'Other',
        format: file.name.split('.').pop().toUpperCase(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        created: new Date().toISOString(),
        status: 'ready',
        generatedBy: 'Current User',
        tags: formData.tags,
        file: file.name
      };

      // Call the onUpload callback with the new report
      onUpload(newReport);
      
      // Reset form
      setFile(null);
      setFormData({
        title: '',
        description: '',
        type: '',
        tags: []
      });
      
      // Close the dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileText className="h-5 w-5 text-gray-500" />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'csv':
        return <FileBarChart2 className="h-5 w-5 text-blue-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <span>Upload Report</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* File Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={isUploading}
              />
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs">({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Enter report title"
              disabled={isUploading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Enter report description (optional)"
              rows={3}
              disabled={isUploading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Type
            </Label>
            <Select 
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              disabled={isUploading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select report type (optional)" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Tags
            </Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={formData.tags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    disabled={isUploading}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal">
                    {tag.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={isUploading || !file || !formData.title}
          >
            {isUploading ? 'Uploading...' : 'Upload Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
