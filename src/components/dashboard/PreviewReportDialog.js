"use client";

import { useState, useEffect } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const getFileIcon = (format) => {
  switch (format) {
    case 'PDF':
      return <FileText className="h-12 w-12 text-red-500" />;
    case 'Excel':
      return <FileSpreadsheet className="h-12 w-12 text-green-600" />;
    default:
      return <FileText className="h-12 w-12 text-blue-500" />;
  }
};

export function PreviewReportDialog({ report, open, onOpenChange, onDownload }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setProgress(0);
      
      // Simulate loading progress
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer);
            setLoading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [open, report?.id]);

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Report Preview</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4 border rounded-lg bg-muted/20">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              {getFileIcon(report.format)}
              <div className="w-full max-w-xs space-y-2">
                <p className="text-sm text-center text-muted-foreground">
                  Loading {report.title}...
                </p>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(report.format)}
                  <div>
                    <h3 className="text-lg font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.size} • {new Date(report.created).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDownload(report.id)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="border rounded-lg bg-background p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    {getFileIcon(report.format)}
                  </div>
                  <h4 className="text-lg font-medium">Preview Unavailable</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a preview of what the report would look like. In a real application, 
                    this would display the actual report content or an embedded viewer.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => onDownload(report.id)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Full Report
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Report Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-muted-foreground">Type:</div>
                    <div>{report.type}</div>
                    <div className="text-muted-foreground">Format:</div>
                    <div>{report.format}</div>
                    <div className="text-muted-foreground">Size:</div>
                    <div>{report.size}</div>
                    <div className="text-muted-foreground">Created:</div>
                    <div>{new Date(report.created).toLocaleString()}</div>
                    <div className="text-muted-foreground">Generated By:</div>
                    <div>{report.generatedBy}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {report.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
