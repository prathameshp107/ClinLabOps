"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import { getTaskAttachments, addTaskAttachment, removeTaskAttachment } from "@/services/taskService";

export function TaskFiles({ task }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Guard clause for when task is undefined
  if (!task) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        <p>No task selected</p>
      </div>
    );
  }

  const fetchFiles = useCallback(async () => {
    if (!task?.id) return;
    setLoading(true);
    try {
      const attachments = await getTaskAttachments(task.id);
      // Ensure we always have an array
      setFiles(Array.isArray(attachments) ? attachments : []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [task?.id]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      try {
        const uploaded = await addTaskAttachment(task?.id, file, "Current User");
        setFiles(prev => [...prev, uploaded]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    });
    setIsDragging(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    disabled: loading
  });

  const handleDeleteFile = async (id) => {
    try {
      await removeTaskAttachment(task?.id, id);
      setFiles(files.filter(file => file.id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const getFileIcon = (fileName) => {
    // Handle case where fileName is undefined or not a string
    if (!fileName || typeof fileName !== 'string') {
      return <FileText className="h-10 w-10 text-gray-500" />;
    }

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

  // Ensure files is always an array for rendering
  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Files & Attachments
          </CardTitle>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
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
            isDragging ? "border-primary bg-primary/5" : "border-border",
            loading && "opacity-50 pointer-events-none"
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

        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {safeFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30"
                >
                  {getFileIcon(file.name)}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name || 'Unnamed file'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{file.size || 'Unknown size'}</span>
                      <span>•</span>
                      <span>Uploaded by {file.uploadedBy || 'Unknown user'}</span>
                      <span>•</span>
                      <span>
                        {file.uploadedAt
                          ? format(new Date(file.uploadedAt), 'MMM d, yyyy')
                          : 'Unknown date'}
                      </span>
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

          </div>
        )}
      </CardContent>
    </Card>
  );
}