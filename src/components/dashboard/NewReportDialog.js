"use client";

import { useState } from 'react';
import { X, FileText, FileSpreadsheet, FileBarChart2, FileArchive } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function NewReportDialog({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    format: 'PDF',
    tags: [],
    includeCharts: true,
    includeData: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const reportTypes = [
    { value: 'Performance', label: 'Performance' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'Dashboard', label: 'Dashboard' },
    { value: 'Status', label: 'Status' },
    { value: 'Resource', label: 'Resource' },
    { value: 'Financial', label: 'Financial' }
  ];

  const reportFormats = [
    { value: 'PDF', label: 'PDF' },
    { value: 'Excel', label: 'Excel' },
    { value: 'CSV', label: 'CSV' },
    { value: 'Word', label: 'Word' }
  ];

  const tagOptions = [
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'performance', label: 'Performance' },
    { id: 'executive', label: 'Executive' },
    { id: 'team', label: 'Team' },
    { id: 'project', label: 'Project' },
  ];

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.title || !formData.type) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate report generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Hold at 90% until we're done
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Simulate API call to generate report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete the progress
      setProgress(100);
      
      // Simulate a small delay for the progress to show 100%
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the onSubmit callback with the new report data
      const newReport = {
        id: `rep-${Date.now()}`,
        title: formData.title,
        type: formData.type,
        format: formData.format,
        size: '1.2 MB', // Simulated size
        created: new Date().toISOString(),
        status: 'ready',
        generatedBy: 'Current User', // In a real app, this would be the logged-in user
        tags: formData.tags
      };
      
      onSubmit(newReport);
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        type: '',
        format: 'PDF',
        tags: [],
        includeCharts: true,
        includeData: true
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const getFileIcon = (format) => {
    switch (format) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'Excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'CSV':
        return <FileBarChart2 className="h-5 w-5 text-blue-500" />;
      case 'Word':
        return <FileText className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon(formData.format)}
            <span>Generate New Report</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
              disabled={isGenerating}
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
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              disabled={isGenerating}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select report type" />
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Format
            </Label>
            <Select 
              value={formData.format}
              onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
              disabled={isGenerating}
            >
              <SelectTrigger className="col-span-3">
                <div className="flex items-center gap-2">
                  {getFileIcon(formData.format)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {reportFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center gap-2">
                      {getFileIcon(format.value)}
                      {format.label}
                    </div>
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
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={formData.tags.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                    disabled={isGenerating}
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal">
                    {tag.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Options
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  name="includeCharts"
                  checked={formData.includeCharts}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, includeCharts: checked }))
                  }
                  disabled={isGenerating}
                />
                <Label htmlFor="includeCharts" className="text-sm font-normal">
                  Include interactive charts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeData"
                  name="includeData"
                  checked={formData.includeData}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, includeData: checked }))
                  }
                  disabled={isGenerating}
                />
                <Label htmlFor="includeData" className="text-sm font-normal">
                  Include raw data
                </Label>
              </div>
            </div>
          </div>

          {isGenerating && (
            <div className="mt-2 space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Generating report... {progress}%
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !formData.title || !formData.type}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
