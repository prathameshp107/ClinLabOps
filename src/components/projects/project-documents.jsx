"use client"

import { useState, useMemo, useEffect } from "react"
import { Download, Eye, FileSpreadsheet, FileText, MoreHorizontal, Search, Share, Trash, Upload, ChevronLeft, ChevronRight, FileStack, File, X, Plus, Filter, SortAsc, Clock, User, Calendar, Star, AlertCircle, CheckCircle, FileCheck, FileX, FolderOpen, Archive, Lock, Unlock, Globe, Users, EyeOff, Copy, Edit, Bookmark, Tag, FolderPlus, Grid, List, BarChart3, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

const FileIcon = ({ type }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
      case 'pptx':
        return <FileSpreadsheet className="h-6 w-6 text-orange-500" />;
      case 'img':
        return <File className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-slate-500" />;
    }
  };

  return (
    <div className="h-12 w-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200/50">
      {getFileIcon(type)}
    </div>
  );
};

export function ProjectDocuments({ documents = [], onUpload }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [viewMode, setViewMode] = useState("list") // "list" or "grid"
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadTags, setUploadTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [showStats, setShowStats] = useState(true)
  const [uploadError, setUploadError] = useState("")

  const filteredDocuments = useMemo(() => {
    return documents?.filter(doc => {
      const matchesSearch = searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesType = typeFilter === "all" || doc.type === typeFilter
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    }).sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.uploadedAt) - new Date(a.uploadedAt)
        case "size":
          return b.size - a.size
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return new Date(b.uploadedAt) - new Date(a.uploadedAt)
      }
    }) || []
  }, [documents, searchQuery, typeFilter, statusFilter, sortBy])

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredDocuments, currentPage, itemsPerPage])

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4)
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      if (startPage > 2) {
        pages.push("...")
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) {
        pages.push("...")
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleAddTag = () => {
    if (newTag && !uploadTags.includes(newTag)) {
      setUploadTags([...uploadTags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setUploadTags(uploadTags.filter(tag => tag !== tagToRemove))
  }

  const handleUpload = async () => {
    setIsLoading(true)
    setUploadError("")
    try {
      if (onUpload && selectedFile) {
        await onUpload(selectedFile, { tags: uploadTags })
      }
    setIsUploadModalOpen(false)
    setSelectedFile(null)
    setUploadTags([])
    } catch (err) {
      setUploadError(err.message || "Failed to upload document")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open) => {
    setIsUploadModalOpen(open)
    if (!open) {
      setSelectedFile(null)
      setUploadTags([])
    }
  }

  // Real-time activity simulation
  useEffect(() => {
    const activities = [
      'Document uploaded',
      'File downloaded',
      'Document shared',
      'Comment added',
      'Version updated',
      'Access granted',
      'Document archived'
    ]

    const simulateActivity = () => {
      if (documents.length > 0) {
        const randomDoc = documents[Math.floor(Math.random() * documents.length)]
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]

        const newActivity = {
          id: Date.now(),
          action: randomActivity,
          document: randomDoc.name,
          user: randomDoc.uploadedBy,
          timestamp: new Date().toLocaleTimeString()
        }

        setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)])
      }
    }

    const interval = setInterval(simulateActivity, Math.random() * 8000 + 5000)
    return () => clearInterval(interval)
  }, [documents])

  // Calculate document statistics
  const documentStats = useMemo(() => {
    const totalSize = documents.reduce((sum, doc) => sum + (Number(doc.size) || 0), 0)
    const typeCounts = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1
      return acc
    }, {})
    const statusCounts = documents.reduce((acc, doc) => {
      acc[doc.status || 'active'] = (acc[doc.status || 'active'] || 0) + 1
      return acc
    }, {})

    return {
      total: documents.length,
      totalSize: totalSize,
      typeCounts,
      statusCounts,
      averageSize: documents.length > 0 ? totalSize / documents.length : 0
    }
  }, [documents])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Enhanced Header Section */}
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <FileStack className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Project Documents</h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-slate-600">Manage and organize your project files</p>
                  {recentActivity.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Live</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="border-slate-200 hover:bg-slate-50"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showStats ? 'Hide' : 'Show'} Stats
            </Button>
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 border-0"
          onClick={() => handleOpenChange(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Document
        </Button>
      </div>
        </div>

        {/* Document Statistics */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-200/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Documents</p>
                    <p className="text-2xl font-bold text-blue-900">{documentStats.total}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileStack className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-200/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Size</p>
                    <p className="text-2xl font-bold text-green-900">{(documentStats.totalSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/30 border border-purple-200/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg Size</p>
                    <p className="text-2xl font-bold text-purple-900">{(documentStats.averageSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 border border-amber-200/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Recent Activity</p>
                    <p className="text-2xl font-bold text-amber-900">{recentActivity.length}</p>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Activity className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Enhanced Search and Filter Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/60 backdrop-blur-sm border-slate-200/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-white/60 backdrop-blur-sm border-slate-200/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="pptx">PowerPoint</SelectItem>
                  <SelectItem value="img">Images</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white/60 backdrop-blur-sm border-slate-200/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white/60 backdrop-blur-sm border-slate-200/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-9 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-9 px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
      </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>{filteredDocuments.length} documents found</span>
              {searchQuery && (
                <span className="text-blue-600">for "{searchQuery}"</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedDocuments.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {selectedDocuments.length} selected
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Documents List */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-slate-900/5 overflow-hidden">
        <CardContent className="p-0">
          {paginatedDocuments.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {paginatedDocuments.map((doc, i) => (
                    <div key={doc.id} className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <FileIcon type={doc.type} />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 truncate mb-1">{doc.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{Math.round(Number(doc.size) / 1024)} KB</span>
                            {doc.status && (
                              <Badge variant="outline" className={`text-xs ${doc.status === 'active' ? 'border-green-200 text-green-700 bg-green-50' :
                                doc.status === 'archived' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                                  doc.status === 'draft' ? 'border-gray-200 text-gray-700 bg-gray-50' :
                                    'border-blue-200 text-blue-700 bg-blue-50'
                                }`}>
                                {doc.status}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-600 mb-2">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="font-medium text-slate-900">{doc.uploadedBy}</span>
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{doc.uploadedAt}</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {doc.tags?.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300/50 px-2 py-0.5 text-xs font-medium rounded-full hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-colors">
                                <Tag className="h-3 w-3 mr-1" />{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <Button variant="outline" size="sm" className="h-9 px-3 text-sm border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                          <Eye className="h-4 w-4 mr-1" />View
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 px-3 text-sm border-slate-200 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors">
                          <Download className="h-4 w-4 mr-1" />Download
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors">
                              <MoreHorizontal className="h-5 w-5 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-xl p-2">
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                              <Eye className="h-4 w-4 mr-3 text-blue-600" />Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-green-50 transition-colors">
                              <Download className="h-4 w-4 mr-3 text-green-600" />Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-purple-50 transition-colors">
                              <Share className="h-4 w-4 mr-3 text-purple-600" />Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-amber-50 transition-colors">
                              <Copy className="h-4 w-4 mr-3 text-amber-600" />Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                              <Edit className="h-4 w-4 mr-3 text-indigo-600" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-slate-200/50" />
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                              <Trash className="h-4 w-4 mr-3" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
            <div className="divide-y divide-slate-100/80">
              {paginatedDocuments.map((doc, i) => (
                <div key={doc.id} className="group flex items-center justify-between px-6 py-5 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-blue-50/30 transition-all duration-200">
                  <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                    <FileIcon type={doc.type} />
                          {doc.status === 'archived' && (
                            <div className="absolute -top-1 -right-1 p-1 bg-amber-100 rounded-full">
                              <Archive className="h-3 w-3 text-amber-600" />
                            </div>
                          )}
                          {doc.status === 'review' && (
                            <div className="absolute -top-1 -right-1 p-1 bg-blue-100 rounded-full">
                              <AlertCircle className="h-3 w-3 text-blue-600" />
                            </div>
                          )}
                        </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-slate-900 truncate">
                          {doc.name}
                        </h3>
                            <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                {Math.round(doc.size / 1024)} KB
                        </span>
                              {doc.status && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${doc.status === 'active' ? 'border-green-200 text-green-700 bg-green-50' :
                                    doc.status === 'archived' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                                      doc.status === 'draft' ? 'border-gray-200 text-gray-700 bg-gray-50' :
                                        'border-blue-200 text-blue-700 bg-blue-50'
                                    }`}
                                >
                                  {doc.status}
                                </Badge>
                              )}
                            </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 text-sm text-slate-600 mb-3">
                        <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                          <span className="font-medium text-slate-900">{doc.uploadedBy}</span>
                        </span>
                        <span className="text-slate-400">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                        <span>{doc.uploadedAt}</span>
                            </span>
                            {doc.lastModified && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="text-xs text-slate-500">Modified {doc.lastModified}</span>
                              </>
                            )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {doc.tags?.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300/50 px-3 py-1 text-xs font-medium rounded-full hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-colors"
                          >
                                <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-sm border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                    <Button
                      variant="outline"
                      size="sm"
                            className="h-9 px-3 text-sm border-slate-200 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                    >
                            <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                        </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-xl p-2">
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                              <Eye className="h-4 w-4 mr-3 text-blue-600" />
                              Preview Document
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-green-50 transition-colors">
                              <Download className="h-4 w-4 mr-3 text-green-600" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-purple-50 transition-colors">
                              <Share className="h-4 w-4 mr-3 text-purple-600" />
                              Share Document
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-amber-50 transition-colors">
                              <Copy className="h-4 w-4 mr-3 text-amber-600" />
                              Copy Link
                        </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                              <Edit className="h-4 w-4 mr-3 text-indigo-600" />
                              Edit Details
                        </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-slate-200/50" />
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                          <Trash className="h-4 w-4 mr-3" />
                              Delete Document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-blue-50/20 border-t border-slate-100/80">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0 border-slate-200 hover:bg-blue-50 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {pageNumbers.map((page, index) => (
                    <Button
                      key={index}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => typeof page === 'number' && goToPage(page)}
                      disabled={typeof page !== 'number'}
                      className={`h-9 w-9 p-0 transition-all ${page === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25'
                        : 'border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0 border-slate-200 hover:bg-blue-50 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileStack className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="text-slate-600 mb-8 max-w-md leading-relaxed">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search filters or upload a new document to get started.'
                  : 'Upload your first document to start organizing your project files. Support for PDF, Word, Excel, PowerPoint, and image files.'
                }
              </p>
              <div className="flex items-center gap-4">
              <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 px-6 py-3"
                onClick={() => handleOpenChange(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                  Upload Document
                </Button>
                {(searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant="outline"
                    className="px-6 py-3 border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      setSearchQuery("")
                      setTypeFilter("all")
                      setStatusFilter("all")
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
              </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Upload Document</DialogTitle>
            <DialogDescription className="text-slate-600">
              Add a new document to your project collection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="file-upload" className="text-sm font-medium text-slate-700">Select File</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-gradient-to-br from-slate-50/50 to-blue-50/20 hover:border-blue-300 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <span className="text-base font-medium text-slate-900 mb-1">
                    {selectedFile ? selectedFile.name : "Click to select a file"}
                  </span>
                  <span className="text-sm text-slate-500">
                    PDF, Word, Excel, PowerPoint, or Image files
                  </span>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="tags" className="text-sm font-medium text-slate-700">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {uploadTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-white/60 backdrop-blur-sm border border-gray-200/50"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="h-11 bg-white/60 backdrop-blur-sm border-gray-200/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  className="h-11 px-4 bg-white/60 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50 rounded-xl shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? "Uploading..." : "Upload Document"}
            </Button>
            {uploadError && <div className="text-red-500 text-sm mt-2">{uploadError}</div>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}