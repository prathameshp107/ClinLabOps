"use client";

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Search, Filter, Download, Eye, Trash2, FileText, FileSpreadsheet, Plus, FileArchive, FilePieChart, FileBarChart2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PreviewReportDialog } from './PreviewReportDialog';
import { ReportsPagination } from './ReportsPagination';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function ReportsTab({ reports, reportTypes, reportFormats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [previewReport, setPreviewReport] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === 'all' || report.type === selectedType;
      const matchesFormat = selectedFormat === 'all' || report.format === selectedFormat;

      return matchesSearch && matchesType && matchesFormat;
    }).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [reports, searchQuery, selectedType, selectedFormat, sortConfig]);

  // Pagination logic
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReports.slice(startIndex, startIndex + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Preview functionality
  const handlePreview = (report) => {
    setPreviewReport(report);
    setIsPreviewOpen(true);
  };

  const handleDownload = (reportId, e) => {
    if (e) e.stopPropagation();
    const report = reports.find(r => r.id === reportId);
    console.log(`Downloading report: ${report.title}`);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${report.title.replace(/\s+/g, '_')}.${report.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (reportId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      console.log(`Deleting report ${reportId}`);
      // In a real app, this would call an API to delete the report
    }
  };

  const getFileIcon = (format) => {
    switch (format) {
      case 'PDF':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'Excel':
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'CSV':
        return <FileBarChart2 className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Preview Dialog */}
      <PreviewReportDialog
        report={previewReport}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onDownload={handleDownload}
      />

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {reportTypes.map((type) => {
                const value = typeof type === 'object' ? type.value : type;
                const label = typeof type === 'object' ? type.label : type;
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-[150px]">
              <FileText className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              {reportFormats.map((format) => {
                const value = typeof format === 'object' ? format.value : format;
                const label = typeof format === 'object' ? format.label : format;
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button className="ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            View and manage your reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px] cursor-pointer" onClick={() => requestSort('title')}>
                    <div className="flex items-center">
                      Title
                      {sortConfig.key === 'title' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('created')}>
                    <div className="flex items-center">
                      Created
                      {sortConfig.key === 'created' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((report) => (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handlePreview(report)}
                    >
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(report.format)}
                          {report.format}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(report.created), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted/50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(report);
                            }}
                            title="Preview report"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Preview</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted/50"
                            onClick={(e) => handleDownload(report.id, e)}
                            title="Download report"
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted/50 text-destructive hover:text-destructive"
                            onClick={(e) => handleDelete(report.id, e)}
                            title="Delete report"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-6">
                        <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No reports found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Try adjusting your search or filter to find what you&apos;re looking for.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedType('all');
                            setSelectedFormat('all');
                            setCurrentPage(1);
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="mt-4">
              <ReportsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

ReportsTab.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      created: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date)
      ]).isRequired,
      generatedBy: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  reportTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  reportFormats: PropTypes.arrayOf(PropTypes.string).isRequired,
};
