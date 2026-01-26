"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FileText, Image as ImageIcon, FileJson, Loader2, AlertCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { reportService } from "@/services/reportService";

export function FileViewer({ report }) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (!report) return;

        // Reset state when report changes
        setContent(null);
        setError(null);
        setObjectUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });

        const fetchContent = async () => {
            setLoading(true);
            try {
                const blob = await reportService.getContent(report._id);
                const url = URL.createObjectURL(blob);
                setObjectUrl(url);

                const format = report.format?.toLowerCase();

                if (format === 'json') {
                    const text = await blob.text();
                    try {
                        setContent(JSON.parse(text));
                    } catch (e) {
                        setContent(text); // Fallback to text if parse fails
                    }
                } else if (['xlsx', 'xls', 'csv'].includes(format)) {
                    const arrayBuffer = await blob.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer);
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    setContent(jsonData);
                } else if (format === 'pdf' || ['jpg', 'jpeg', 'png', 'gif'].includes(format)) {
                    // Content is effectively the blob URL, no extra processing needed
                    setContent(null);
                }
                // Other formats just use the specific fallback UI

            } catch (err) {
                console.error("Error loading report content:", err);
                setError("Failed to load document content");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();

        return () => {
            // Cleanup function inside useEffect might not have access to latest objectUrl if not careful, 
            // but cleaner is to revoke based on a ref or just let it be supplanted.
            // We handle revocation at start of effect.
        };
    }, [report]);

    // Clean up object URL on unmount
    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
    }, [objectUrl]);


    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-destructive flex-col gap-2"><AlertCircle className="h-8 w-8" /><p>{error}</p></div>
    }

    const format = report?.format?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(format)) {
        return <div className="flex justify-center items-center bg-muted/20 p-4 rounded-lg"><img src={objectUrl} alt={report.title} className="max-w-full max-h-[600px] object-contain" /></div>;
    }

    if (format === 'pdf') {
        return <iframe src={objectUrl} className="w-full h-[600px] border rounded-lg" title={report.title}></iframe>;
    }

    if (['xlsx', 'xls', 'csv'].includes(format) && Array.isArray(content)) {
        return (
            <ScrollArea className="h-[600px] w-full border rounded-lg">
                <div className="w-full">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            {content.length > 0 && (
                                <tr className="bg-muted border-b">
                                    {content[0].map((header, j) => (
                                        <th key={j} className="p-2 border-r last:border-r-0 text-left font-medium whitespace-nowrap sticky top-0 bg-muted">
                                            {header !== null && header !== undefined ? String(header) : ''}
                                        </th>
                                    ))}
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {content.slice(1).map((row, i) => (
                                <tr key={i} className="border-b hover:bg-muted/50">
                                    {Array.isArray(row) ? row.map((cell, j) => (
                                        <td key={j} className="p-2 border-r last:border-r-0 whitespace-nowrap">
                                            {cell !== null && cell !== undefined ? String(cell) : ''}
                                        </td>
                                    )) : <td className="p-2">{String(row)}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )
    }

    if (format === 'json') {
        return (
            <ScrollArea className="h-[600px] w-full border rounded-lg bg-muted/10 p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap">{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</pre>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">Preview not available for {format?.toUpperCase()} files</p>
            <p className="text-xs text-muted-foreground mt-1">Please download the file to view it</p>
        </div>
    );
}
