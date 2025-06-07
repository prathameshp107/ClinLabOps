"use client"

import { useState, useMemo } from "react"
import { Download, Eye, FileSpreadsheet, FileText, MoreHorizontal, Search, Share, Trash, Upload, ChevronLeft, ChevronRight, FileStack, File } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const FileIcon = ({ type }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'pptx':
        return <FileSpreadsheet className="h-5 w-5 text-orange-500" />;
      case 'img':
        return <File className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="h-9 w-9 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
      {getFileIcon(type)}
    </div>
  );
};

export function ProjectDocuments({ documents }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

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

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
            <FileStack className="h-4 w-4 text-gray-500" />
            Project Documents
          </CardTitle>
          <Button 
            size="sm" 
            className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Upload Document
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="relative flex-1 min-w-[250px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search documents..." 
              className="pl-9 h-8 w-full text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <Select 
            value={typeFilter} 
            onValueChange={(value) => {
              setTypeFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-[140px] text-sm border-gray-200">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">Word Document</SelectItem>
              <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
              <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
              <SelectItem value="img">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {paginatedDocuments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {paginatedDocuments.map((doc, i) => (
              <div key={doc.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileIcon type={doc.type} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mt-0.5">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Uploaded by <span className="font-medium text-gray-700">{doc.uploadedBy}</span></span>
                      <span>•</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags?.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 px-2 py-0.5 text-xs font-medium rounded">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs border-gray-200 hover:bg-gray-100">
                    <Download className="h-3 w-3 mr-1.5" />
                    Download
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="text-sm">
                        <Eye className="h-4 w-4 mr-2 text-gray-500" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm">
                        <Share className="h-4 w-4 mr-2 text-gray-500" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-sm text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 px-4 py-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0 border-gray-200"
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
                    className={`h-7 w-7 p-0 ${
                      page === currentPage 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
                  className="h-7 w-7 p-0 border-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileStack className="h-10 w-10 mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-900 mb-1">No documents found</p>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or upload a new document.</p>
            <Button 
              className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Upload Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}