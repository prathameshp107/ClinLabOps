"use client";

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download, Eye, FileText, FileSpreadsheet, Plus, FileArchive, FilePieChart, FileBarChart2, RefreshCw, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PreviewReportDialog } from './PreviewReportDialog';
import { UploadReportDialog } from './UploadReportDialog';
import { ReportsPagination } from './ReportsPagination';
import { reportService } from '@/services/reportService';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function ReportsTab({ reports, reportTypes, reportFormats }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the 10 most recent reports
  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoading(true);
        const response = await reportService.getAll();
        const reports = response.reports || (Array.isArray(response) ? response : []);
        setRecentReports(reports.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch recent reports:', error);
        setRecentReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    const reportsToFilter = recentReports.length > 0 ? recentReports : reports;

    return reportsToFilter.filter(report => {
      // Search filter - check title and description
      const matchesSearch = (report?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report?.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter - handle the actual report type from database
      const reportType = report?.type || '';
      const matchesType = selectedType === 'all' ||
        reportType === selectedType;

      // Format filter - handle the actual report format from database
      const reportFormat = report?.format || '';
      const matchesFormat = selectedFormat === 'all' ||
        reportFormat === selectedFormat;

      return matchesSearch && matchesType && matchesFormat;
    }).sort((a, b) => {
      // Fix sorting to work with actual database fields
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties and date objects
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'created') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle nested properties like uploadedBy.name
      if (sortConfig.key === 'uploadedBy.name') {
        aValue = a?.uploadedBy?.name || '';
        bValue = b?.uploadedBy?.name || '';
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [recentReports, reports, searchQuery, selectedType, selectedFormat, sortConfig]);

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

  const handleDownload = async (reportId, e) => {
    if (e) e.stopPropagation();
    try {
      await reportService.download(reportId);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const handleUploadReport = async (uploadedReport) => {
    try {
      // Refresh the reports list after upload
      const response = await reportService.getAll({ limit: 10 });
      const reports = response.reports || (Array.isArray(response) ? response : []);
      setRecentReports(reports.slice(0, 10));

      // Show success message
      alert(`Successfully uploaded report: ${uploadedReport?.title || 'Unknown'}`);
    } catch (error) {
      console.error('Failed to refresh reports after upload:', error);
    }
  };

  const getFileIcon = (format) => {
    switch (format?.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'csv':
        return <FileBarChart2 className="h-4 w-4 text-blue-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-4 w-4 text-blue-700" />;
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

      {/* Upload Report Dialog */}
      <UploadReportDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUploadReport}
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
              {reportTypes && reportTypes.length > 0 ? (
                reportTypes.map((type) => {
                  // Handle both string and object formats
                  const value = typeof type === 'object' ? (type.value || type.label || type.toString()) : type;
                  const label = typeof type === 'object' ? (type.label || type.value || type.toString()) : type;
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })
              ) : (
                // Fallback to common report types if none provided
                <>
                  <SelectItem value="regulatory">Regulatory Reports</SelectItem>
                  <SelectItem value="research">Research Reports</SelectItem>
                  <SelectItem value="miscellaneous">Miscellaneous Reports</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-[150px]">
              <FileText className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              {reportFormats && reportFormats.length > 0 ? (
                reportFormats.map((format) => {
                  // Handle both string and object formats
                  const value = typeof format === 'object' ? (format.value || format.label || format.toString()) : format;
                  const label = typeof format === 'object' ? (format.label || format.value || format.toString()) : format;
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })
              ) : (
                // Fallback to common formats if none provided
                <>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Button
            className="ml-auto"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Report
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/reports')}
          >
            See Reports
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Showing the 10 most recent reports from your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Loading reports...</span>
            </div>
          ) : (
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
                    <TableHead className="cursor-pointer" onClick={() => requestSort('type')}>
                      <div className="flex items-center">
                        Type
                        {sortConfig.key === 'type' && (
                          <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('format')}>
                      <div className="flex items-center">
                        Format
                        {sortConfig.key === 'format' && (
                          <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('createdAt')}>
                      <div className="flex items-center">
                        Created
                        {sortConfig.key === 'createdAt' && (
                          <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('uploadedBy.name')}>
                      <div className="flex items-center">
                        Uploaded By
                        {sortConfig.key === 'uploadedBy.name' && (
                          <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReports.length > 0 ? (
                    paginatedReports.map((report) => (
                      <TableRow
                        key={report._id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handlePreview(report)}
                      >
                        <TableCell className="font-medium">{report?.title || 'Untitled'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report?.type?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFileIcon(report?.format)}
                            {report?.format?.toUpperCase() || 'PDF'}
                          </div>
                        </TableCell>
                        <TableCell>{report?.createdAt ? format(new Date(report.createdAt), 'MMM d, yyyy') : 'Unknown'}</TableCell>
                        <TableCell>{report?.uploadedBy?.name || 'Unknown User'}</TableCell>
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
                              onClick={(e) => handleDownload(report._id, e)}
                              title="Download report"
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
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
                            Get started by uploading your first report.
                          </p>
                          <Button onClick={() => setIsUploadDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Report
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalItems > 0 && !loading && (
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