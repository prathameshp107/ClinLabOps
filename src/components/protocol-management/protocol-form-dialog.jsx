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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto p-0 gap-0 border border-border/40 shadow-lg rounded-xl bg-background/95 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30 bg-muted/20">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {mode === "create" ? (
              <>
                <div className="bg-primary/10 p-2 rounded-full shadow-sm">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Create New Protocol
                </span>
              </>
            ) : (
              <>
                <div className="bg-blue-500/10 p-2 rounded-full shadow-sm">
                  <Save className="h-5 w-5 text-blue-500" />
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-blue-500/70 bg-clip-text text-transparent">
                  Edit Protocol
                </span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 mt-2 ml-10">
            {mode === "create"
              ? "Create a new laboratory protocol with detailed procedures."
              : "Update the details of this laboratory protocol."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="px-6 py-5">
              <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-8 bg-muted/30 p-1 rounded-lg">
                  <TabsTrigger value="basic" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <div className="flex flex-col items-center justify-center py-1 px-1 sm:flex-row sm:gap-2">
                      <div className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">1</div>
                      <span>Basic Info</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <div className="flex flex-col items-center justify-center py-1 px-1 sm:flex-row sm:gap-2">
                      <div className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">2</div>
                      <span>Details</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="procedure" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <div className="flex flex-col items-center justify-center py-1 px-1 sm:flex-row sm:gap-2">
                      <div className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">3</div>
                      <span>Procedure</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="attachments" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <div className="flex flex-col items-center justify-center py-1 px-1 sm:flex-row sm:gap-2">
                      <div className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">4</div>
                      <span>Attachments</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-5 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                          <FormLabel className="text-sm font-medium">Protocol Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter protocol title" 
                              {...field} 
                              className="mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                          <FormLabel className="text-sm font-medium">Protocol ID</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Auto-generated" 
                              {...field} 
                              disabled 
                              className="mt-1.5 bg-muted/50 border-border/40"
                            />
                          </FormControl>
                          <FormDescription className="text-xs mt-1.5">
                            Automatically generated ID
                          </FormDescription>
                          <FormMessage className="text-xs mt-0.5" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                          <FormLabel className="text-sm font-medium">Category / Study Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30">
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
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                          <FormLabel className="text-sm font-medium">Version Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 1.0" 
                              {...field} 
                              className="mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                        <FormLabel className="text-sm font-medium">Author / Team Members</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter author names" 
                            {...field} 
                            className="mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                        <FormLabel className="text-sm font-medium">Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Draft">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                Draft
                              </div>
                            </SelectItem>
                            <SelectItem value="In Review">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                In Review
                              </div>
                            </SelectItem>
                            <SelectItem value="Approved">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                Approved
                              </div>
                            </SelectItem>
                            <SelectItem value="Archived">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                                Archived
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs mt-1.5" />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-5 mt-2">
                  <FormField
                    control={form.control}
                    name="objectives"
                    render={({ field }) => (
                      <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                        <FormLabel className="text-sm font-medium">Objectives / Purpose</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the objectives of this protocol" 
                            className="min-h-[120px] mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="materials"
                    render={({ field }) => (
                      <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                        <FormLabel className="text-sm font-medium">Materials and Methods</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List all required materials and methods" 
                            className="min-h-[120px] mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="outcomes"
                    render={({ field }) => (
                      <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                        <FormLabel className="text-sm font-medium">Expected Outcomes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the expected outcomes" 
                            className="min-h-[120px] mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1.5" />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="procedure" className="space-y-5 mt-2">
                  <FormField
                    control={form.control}
                    name="procedure"
                    render={({ field }) => (
                      <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                        <FormLabel className="text-sm font-medium">Step-by-Step Procedure</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed step-by-step instructions" 
                            className="min-h-[300px] mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs mt-1.5">
                          Describe each step in detail, including timing, measurements, and safety precautions.
                        </FormDescription>
                        <FormMessage className="text-xs mt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field }) => (
                      <FormItem className="bg-card/30 p-4 rounded-lg border border-border/30 shadow-sm">
                        <FormLabel className="text-sm font-medium">References</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List any references or supporting literature" 
                            className="min-h-[100px] mt-1.5 bg-background/70 border-border/40 focus-visible:ring-primary/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1.5" />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="attachments" className="space-y-5 mt-2">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center bg-muted/10 hover:bg-muted/20 transition-colors">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileUp className="h-8 w-8 text-primary/80" />
                      </div>
                      <h3 className="text-lg font-medium">Upload Supporting Documents</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Drag and drop files here or click to browse. Accepted file types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG.
                      </p>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-md text-sm font-medium mt-2 shadow-sm hover:shadow transition-all">
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
                    <div className="mt-6 bg-card/30 p-5 rounded-lg border border-border/30 shadow-sm">
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <FileUp className="h-3 w-3 text-primary" />
                        </div>
                        Uploaded Files ({files.length})
                      </h4>
                      <div className="space-y-2.5">
                        {files.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between bg-background/70 rounded-lg p-3 text-sm border border-border/20 hover:border-border/40 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-md mr-3">
                                <FileUp className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {(file.size / 1024).toFixed(2)} KB • Uploaded just now
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file)}
                              className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

            <DialogFooter className="px-6 py-4 border-t border-border/30 gap-2 bg-muted/20">
              <div className="flex items-center mr-auto">
                <div className="flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className={`h-2 w-2 rounded-full ${activeTab === "basic" ? "bg-primary" : "bg-primary/30"}`}></div>
                    <div className={`h-2 w-2 rounded-full ${activeTab === "details" ? "bg-primary" : "bg-primary/30"}`}></div>
                    <div className={`h-2 w-2 rounded-full ${activeTab === "procedure" ? "bg-primary" : "bg-primary/30"}`}></div>
                    <div className={`h-2 w-2 rounded-full ${activeTab === "attachments" ? "bg-primary" : "bg-primary/30"}`}></div>
                  </div>
                  <span className="text-sm text-muted-foreground ml-3">
                    Step {activeTab === "basic" ? "1" : activeTab === "details" ? "2" : activeTab === "procedure" ? "3" : "4"} of 4
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
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
                  className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                >
                  Continue to Next Step
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="outline"
                    onClick={() => {
                      form.setValue("status", "Draft");
                    }}
                    className="border-yellow-500/30 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      form.setValue("status", "In Review");
                    }}
                    className="bg-primary hover:bg-primary/90 text-white shadow-sm"
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