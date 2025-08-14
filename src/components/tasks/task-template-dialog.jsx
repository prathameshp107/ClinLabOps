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
import { Label } from "@/components/ui/label"
import { PlusCircle, Save, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define form schema with Zod
const templateFormSchema = z.object({
  name: z.string().min(3, {
    message: "Template name must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Template description must be at least 3 characters.",
  }),
  defaultPriority: z.string({
    required_error: "Please select a default priority level.",
  }),
  defaultStatus: z.string({
    required_error: "Please select a default status.",
  }),
  defaultAssigneeRole: z.string().optional(),
  categoryTags: z.array(z.string()).optional(),
});

export const TaskTemplateDialog = ({ open, onOpenChange, template, mode, onSubmit, users, categories }) => {
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  // Initialize form with React Hook Form and Zod validation
  const form = useForm({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      defaultPriority: "medium",
      defaultStatus: "pending",
      defaultAssigneeRole: "",
      categoryTags: [],
    },
  });

  // Reset form when dialog opens/closes or when template changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && template) {
        form.reset({
          name: template.name,
          description: template.description,
          defaultPriority: template.defaultPriority,
          defaultStatus: template.defaultStatus,
          defaultAssigneeRole: template.defaultAssigneeRole || "",
          categoryTags: template.categoryTags || [],
        });
        setTags(template.categoryTags || []);
      } else {
        form.reset({
          name: "",
          description: "",
          defaultPriority: "medium",
          defaultStatus: "pending",
          defaultAssigneeRole: "",
          categoryTags: [],
        });
        setTags([]);
      }
    }
  }, [open, mode, template, form]);

  // Handle form submission
  const handleSubmit = (data) => {
    // Format the template data
    const formattedTemplate = {
      ...data,
      categoryTags: tags,
    };

    // If editing, add the id
    if (mode === "edit" && template) {
      formattedTemplate.id = template.id;
    }

    // Submit the template
    onSubmit(formattedTemplate);
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Template" : "Edit Template"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a reusable template for similar lab tasks."
              : "Update the details of this template."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter template name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter template description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what kind of tasks this template is for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="defaultPriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Priority*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Status*</FormLabel>
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
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="defaultAssigneeRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Assignee Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="scientist">Scientist</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optionally set a default role for task assignees
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Category Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddTag}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>
                Add tags to categorize this template
              </FormDescription>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {mode === "create" ? "Create Template" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
