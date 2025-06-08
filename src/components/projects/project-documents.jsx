"use client"

import { useState, useMemo } from "react"
import { Download, Eye, FileSpreadsheet, FileText, MoreHorizontal, Search, Share, Trash, Upload, ChevronLeft, ChevronRight, FileStack, File, X, Plus, Filter, SortAsc } from "lucide-react"
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

export function ProjectDocuments({ documents = [] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadTags, setUploadTags] = useState([])
  const [newTag, setNewTag] = useState("")

  const filteredDocuments = useMemo(() => {
    return documents?.filter(doc => {
      const matchesSearch = searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesType = typeFilter === "all" || doc.type === typeFilter

      return matchesSearch && matchesType
    }) || []
  }, [documents, searchQuery, typeFilter])

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

  const handleUpload = () => {
    console.log('Uploading file:', selectedFile)
    console.log('With tags:', uploadTags)
    setIsUploadModalOpen(false)
    setSelectedFile(null)
    setUploadTags([])
  }

  const handleOpenChange = (open) => {
    setIsUploadModalOpen(open)
    if (!open) {
      setSelectedFile(null)
      setUploadTags([])
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <FileStack className="h-6 w-6 text-white" />
            </div>
            Project Documents
          </h1>
          <p className="text-slate-600">Manage and organize your project files</p>
        </div>
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 border-0"
          onClick={() => handleOpenChange(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Document
        </Button>
      </div>

      
      {/* Documents List */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-slate-900/5 overflow-hidden">
        <CardContent className="p-0">
          {paginatedDocuments.length > 0 ? (
            <div className="divide-y divide-slate-100/80">
              {paginatedDocuments.map((doc, i) => (
                <div key={doc.id} className="group flex items-center justify-between px-6 py-5 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-blue-50/30 transition-all duration-200">
                  <div className="flex items-center gap-4 flex-1">
                    <FileIcon type={doc.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-slate-900 truncate">
                          {doc.name}
                        </h3>
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {doc.size}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 text-sm text-slate-600 mb-3">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="font-medium text-slate-900">{doc.uploadedBy}</span>
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>{doc.uploadedAt}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {doc.tags?.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300/50 px-3 py-1 text-xs font-medium rounded-full hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-sm border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
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
                      <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm">
                        <DropdownMenuItem className="text-sm hover:bg-blue-50">
                          <Eye className="h-4 w-4 mr-3 text-slate-500" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm hover:bg-blue-50">
                          <Share className="h-4 w-4 mr-3 text-slate-500" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-sm text-red-600 hover:bg-red-50">
                          <Trash className="h-4 w-4 mr-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-6 shadow-inner">
                <FileStack className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
              <p className="text-slate-600 mb-6 max-w-sm">Try adjusting your search filters or upload a new document to get started.</p>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
                onClick={() => handleOpenChange(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Upload Your First Document
              </Button>
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
              disabled={!selectedFile}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}