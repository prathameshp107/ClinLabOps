"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Save, FileUp, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"

// Define form schema with Zod
const protocolFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  id: z.string().optional(),
  category: z.string({
    required_error: "Please select a category.",
  }),
  version: z.string().min(1, {
    message: "Version is required.",
  }),
  author: z.string().min(3, {
    message: "Author name must be at least 3 characters.",
  }),
  objectives: z.string().min(10, {
    message: "Objectives must be at least 10 characters.",
  }),
  materials: z.string().min(10, {
    message: "Materials must be at least 10 characters.",
  }),
  procedure: z.string().min(10, {
    message: "Procedure must be at least 10 characters.",
  }),
  outcomes: z.string().min(10, {
    message: "Expected outcomes must be at least 10 characters.",
  }),
  references: z.string().optional(),
  status: z.string().default("Draft"),
});

export function ProtocolFormDialog({
  open,
  onOpenChange,
  protocol,
  mode,
  onSubmit
}) {
  const [activeTab, setActiveTab] = useState("basic")
  const [files, setFiles] = useState([])

  // Initialize form with React Hook Form and Zod validation
  const form = useForm({
    resolver: zodResolver(protocolFormSchema),
    defaultValues: {
      title: "",
      id: "",
      category: "",
      version: "1.0",
      author: "",
      objectives: "",
      materials: "",
      procedure: "",
      outcomes: "",
      references: "",
      status: "Draft",
    },
  });

  // Reset form when dialog opens/closes or when protocol changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && protocol) {
        form.reset({
          title: protocol.title || "",
          id: protocol.id || "",
          category: protocol.category || "",
          version: protocol.version || "1.0",
          author: protocol.author || "",
          objectives: protocol.objectives || "",
          materials: protocol.materials || "",
          procedure: protocol.procedure || "",
          outcomes: protocol.outcomes || "",
          references: protocol.references || "",
          status: protocol.status || "Draft",
        });
        setFiles(protocol.files || []);
      } else {
        form.reset({
          title: "",
          id: `PROT-${Date.now()}`,
          category: "",
          version: "1.0",
          author: "",
          objectives: "",
          materials: "",
          procedure: "",
          outcomes: "",
          references: "",
          status: "Draft",
        });
        setFiles([]);
      }
    }
  }, [open, mode, protocol, form]);

  // Handle form submission
  const handleSubmit = (data) => {
    // Add files to the data
    const formattedProtocol = {
      ...data,
      files,
    };

    // Submit the protocol
    onSubmit(formattedProtocol);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));
    
    setFiles([...files, ...newFiles]);
  };

  // Handle file removal
  const handleRemoveFile = (fileToRemove) => {
    setFiles(files.filter(file => file.name !== fileToRemove.name));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto p-0 gap-0 border border-border/40 shadow-lg rounded-lg bg-background/95 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {mode === "create" ? (
              <>
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                Create New Protocol
              </>
            ) : (
              <>
                <div className="bg-blue-500/10 p-1.5 rounded-full">
                  <Save className="h-5 w-5 text-blue-500" />
                </div>
                Edit Protocol
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 mt-1.5">
            {mode === "create"
              ? "Create a new laboratory protocol with detailed procedures."
              : "Update the details of this laboratory protocol."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="px-6 py-4">
              <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="procedure">Procedure</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protocol Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter protocol title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protocol ID</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Auto-generated" 
                              {...field} 
                              disabled 
                              className="bg-muted/50"
                            />
                          </FormControl>
                          <FormDescription>
                            Automatically generated ID
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category / Study Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pharmacokinetics">Pharmacokinetics</SelectItem>
                              <SelectItem value="Toxicology">Toxicology</SelectItem>
                              <SelectItem value="Efficacy">Efficacy</SelectItem>
                              <SelectItem value="Bioanalytical">Bioanalytical</SelectItem>
                              <SelectItem value="Formulation">Formulation</SelectItem>
                              <SelectItem value="Safety">Safety</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1.0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author / Team Members</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter author names" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objectives / Purpose</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the objectives of this protocol" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="materials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Materials and Methods</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List all required materials and methods" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="outcomes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Outcomes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the expected outcomes" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="procedure" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="procedure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step-by-Step Procedure</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed step-by-step instructions" 
                            className="min-h-[300px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Describe each step in detail, including timing, measurements, and safety precautions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>References</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List any references or supporting literature" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="attachments" className="space-y-4">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileUp className="h-8 w-8 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Upload Supporting Documents</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Drag and drop files here or click to browse. Accepted file types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG.
                      </p>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium mt-2">
                          Browse Files
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between bg-muted/50 rounded-md p-2 text-sm"
                          >
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-1.5 rounded-md mr-2">
                                <FileUp className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-border/30 gap-2">
              <div className="flex items-center mr-auto">
                <div className="text-sm text-muted-foreground">
                  {activeTab === "basic" ? "1" : activeTab === "details" ? "2" : activeTab === "procedure" ? "3" : "4"} of 4
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {activeTab !== "attachments" ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (activeTab === "basic") setActiveTab("details");
                    else if (activeTab === "details") setActiveTab("procedure");
                    else if (activeTab === "procedure") setActiveTab("attachments");
                  }}
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="outline"
                    onClick={() => {
                      form.setValue("status", "Draft");
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      form.setValue("status", "In Review");
                    }}
                  >
                    Submit for Review
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    );
}