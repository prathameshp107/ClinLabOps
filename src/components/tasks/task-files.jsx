"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { 
  FileText, 
  FileSpreadsheet, 
  FilePlus, 
  Download, 
  Trash, 
  Eye, 
  Upload 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

export function TaskFiles({ task }) {
  const [files, setFiles] = useState(task.files);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const onDrop = (acceptedFiles) => {
    // In a real app, you would upload these files to the backend
    const newFiles = acceptedFiles.map(file => ({
      id: `f${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User" // In a real app, this would be the current user
    }));
    
    setFiles([...files, ...newFiles]);
    setIsDragging(false);
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  });
  
  const handleDeleteFile = (id) => {
    // In a real app, you would delete the file from the backend
    setFiles(files.filter(file => file.id !== id));
  };
  
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-10 w-10 text-blue-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Files & Attachments
          </CardTitle>
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors mb-4",
            isDragging ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <div className="text-center">
            <FilePlus className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Drag & drop files here</p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse your files
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30"
              >
                {getFileIcon(file.name)}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Uploaded by {file.uploadedBy}</span>
                    <span>•</span>
                    <span>{format(new Date(file.uploadedAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {files.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No files attached to this task yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}