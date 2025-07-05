"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

// Icons
import {
  Search,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Microscope,
  ClipboardList,
  FlaskConical,
  UserCog,
  BarChart,
  Download,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  FileQuestion,
  Bug,
  AlertCircle,
  Upload,
  ChevronRight,
  ExternalLink,
  BookOpen,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Beaker,
  Atom,
  Briefcase,
  Cog,
  LayoutDashboard,
} from "lucide-react"

// Form schema for support ticket
const supportFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  category: z.string({
    required_error: "Please select an issue category",
  }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  attachFile: z.any().optional(),
});

export default function HelpSupportPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  // Initialize form with user data if available
  const form = useForm({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "",
      description: "",
      attachFile: undefined,
    },
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUserData(userData);
          
          // Pre-fill the form with user data
          form.setValue("name", userData.fullName || "");
          form.setValue("email", userData.email || "");
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [form]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("Support ticket submitted:", data);
      
      // Show success toast
      toast({
        title: "Support Request Submitted",
        description: "We've received your request and will respond shortly.",
        variant: "success",
      });
      
      // Reset form
      form.reset({
        name: userData?.fullName || "",
        email: userData?.email || "",
        subject: "",
        category: "",
        description: "",
        attachFile: undefined,
      });
    } catch (error) {
      console.error("Error submitting support request:", error);
      
      // Show error toast
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick access cards data
  const quickAccessCards = [
    {
      title: "Using the Lab System",
      description: "Learn the basics of navigating and using the platform",
      icon: <Microscope className="h-8 w-8" />,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      link: "#lab-system"
    },
    {
      title: "Managing Projects & Experiments",
      description: "Create, track, and manage your research work",
      icon: <ClipboardList className="h-8 w-8" />,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
      link: "#projects"
    },
    {
      title: "Protocols & Equipment",
      description: "Access and manage laboratory protocols and equipment",
      icon: <FlaskConical className="h-8 w-8" />,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
      link: "#protocols"
    },
    {
      title: "User Accounts & Roles",
      description: "Manage permissions, roles, and user settings",
      icon: <UserCog className="h-8 w-8" />,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      link: "#accounts"
    },
    {
      title: "Settings & Configuration",
      description: "Customize your workspace and preferences",
      icon: <Settings className="h-8 w-8" />,
      color: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
      link: "#settings"
    },
    {
      title: "Reports & Data Export",
      description: "Generate reports and export your research data",
      icon: <BarChart className="h-8 w-8" />,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
      link: "#reports"
    },
  ];

  // FAQ data organized by categories
  const faqData = {
    general: [
      {
        question: "How do I get started with LabTasker?",
        answer: "To get started, log in with your credentials and visit the Dashboard. From there, you can access all features including experiments, protocols, and team management. We recommend completing your profile and exploring the tutorial section first."
      },
      {
        question: "Is my data secure on the platform?",
        answer: "Yes, all data is encrypted both in transit and at rest. We implement industry-standard security protocols and regular security audits. Your laboratory data is protected with role-based access controls and comprehensive audit logs."
      },
      {
        question: "Can I access the system on mobile devices?",
        answer: "Yes, LabTasker is fully responsive and works on tablets and smartphones. While the desktop experience offers the most comprehensive features, you can monitor experiments, receive notifications, and perform essential tasks on mobile devices."
      }
    ],
    experiments: [
      {
        question: "How do I create a new experiment?",
        answer: "Navigate to the Experiments section and click the '+ New Experiment' button. Fill in the required fields including title, description, protocol reference, and team members. You can also attach files and set up custom fields specific to your experiment type."
      },
      {
        question: "Can I duplicate an existing experiment?",
        answer: "Yes, open the experiment you want to duplicate, click the three-dot menu in the top right corner, and select 'Duplicate'. This will create a copy with all protocols and settings, allowing you to modify as needed for your new experiment."
      },
      {
        question: "How do I track experiment progress?",
        answer: "Each experiment has a progress tracker showing completed steps and upcoming tasks. You can view detailed timelines, set milestones, and generate progress reports. Team members can update status in real-time as they complete tasks."
      }
    ],
    protocols: [
      {
        question: "Where can I find standard protocols?",
        answer: "Standard protocols are available in the Protocol Library. Navigate to Protocols > Library and browse by category or use the search function. You can view, download, or add protocols to your experiments directly from the library."
      },
      {
        question: "How do I create a custom protocol?",
        answer: "Go to Protocols > Create New. Use our protocol builder to define steps, materials, equipment, and safety precautions. You can save drafts, request peer review, and publish approved protocols to your organization's library."
      },
      {
        question: "Can I import protocols from other systems?",
        answer: "Yes, we support importing protocols in several formats including PDF, Word, and structured XML formats. Go to Protocols > Import and follow the instructions to map fields from your existing protocols to our system."
      }
    ],
    equipment: [
      {
        question: "How do I reserve laboratory equipment?",
        answer: "Navigate to Equipment > Booking Calendar. Select the equipment you need, choose available time slots, and enter your experiment details. Bookings can be recurring and will be visible to your team to avoid scheduling conflicts."
      },
      {
        question: "What if equipment needs maintenance?",
        answer: "Users can report maintenance needs by selecting the equipment and clicking 'Report Issue'. Administrators receive notifications and can schedule maintenance, which will block the equipment from being reserved during that period."
      },
      {
        question: "How do I track equipment usage history?",
        answer: "Each equipment page has a 'Usage History' tab showing past reservations, maintenance records, and calibration dates. This helps with compliance documentation and resource planning."
      }
    ],
    account: [
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login screen and enter your email address. You'll receive a secure link to reset your password. For security reasons, links expire after 24 hours. If you're already logged in, you can change your password in Profile Settings."
      },
      {
        question: "How do I update my profile information?",
        answer: "Click on your profile picture in the top right corner and select 'Profile Settings'. Here you can update your personal information, change your profile picture, set notification preferences, and manage connected applications."
      },
      {
        question: "What permissions do different user roles have?",
        answer: "LabTasker has several role types including Administrators, Lab Managers, Scientists, and Technicians. Each role has different permissions for creating, editing, and approving content. Administrators can customize role permissions in the Admin Panel."
      }
    ],
    data: [
      {
        question: "How do I export my research data?",
        answer: "Go to Data > Export and select the experiments or datasets you want to export. Choose your preferred format (CSV, Excel, JSON, or structured XML) and include any additional metadata. You can schedule regular exports or perform one-time downloads."
      },
      {
        question: "Can I generate reports for regulatory submissions?",
        answer: "Yes, navigate to Reports > Regulatory and select the appropriate template for your submission type (FDA, EMA, etc.). The system will compile all relevant experiment data, quality control records, and compliance documentation into a structured report."
      },
      {
        question: "How long is data retained in the system?",
        answer: "Data retention follows your organization's policies and regulatory requirements. By default, all research data is retained indefinitely with version history. Administrators can configure custom retention policies in the Admin Panel."
      }
    ]
  };

  // Helpful links data
  const helpfulLinks = [
    {
      title: "User Manual",
      description: "Complete documentation for all features",
      icon: <FileText className="h-5 w-5" />,
      link: "/docs/user-manual.pdf"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step visual guides",
      icon: <FileQuestion className="h-5 w-5" />,
      link: "/tutorials"
    },
    {
      title: "Compliance Documentation",
      description: "GLP, GCP, and regulatory guidance",
      icon: <FileCheck className="h-5 w-5" />,
      link: "/compliance"
    },
    {
      title: "System Status",
      description: "Check current platform status",
      icon: <AlertCircle className="h-5 w-5" />,
      link: "/system-status"
    },
    {
      title: "Release Notes",
      description: "Latest features and updates",
      icon: <BookOpen className="h-5 w-5" />,
      link: "/release-notes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-background/80 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Help & Support
              </h1>
              <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-2xl">
                Find answers, learn about features, or contact our support team for personalized assistance
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs md:text-sm shadow-sm hover:shadow transition-all rounded-full px-4 h-9 md:h-10"
              >
                <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                <span className="hidden xs:inline">Contact Support</span>
                <span className="xs:hidden">Contact</span>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs md:text-sm shadow-sm hover:shadow-md transition-all rounded-full px-4 h-9 md:h-10"
              >
                <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                <span className="hidden xs:inline">Live Chat</span>
                <span className="xs:hidden">Chat</span>
              </Button>
            </div>
          </div>
          
          {/* Global Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search for protocols, features, or common issues..."
              className="pl-11 py-6 md:py-7 text-sm md:text-base shadow-lg rounded-2xl border-muted/40 focus:border-primary/50 transition-all bg-background/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* Quick Access Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 flex items-center">
            <span className="bg-primary/10 p-1.5 rounded-lg mr-2">
              <HelpCircle className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </span>
            Quick Help Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {quickAccessCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Link href={card.link} className="h-full block">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-muted/30 flex flex-col overflow-hidden group rounded-xl">
                    <CardHeader className="pb-2 flex-shrink-0 bg-muted/5 group-hover:bg-muted/10 transition-colors">
                      <div className={`p-3 rounded-xl w-fit ${card.color} mb-3 group-hover:scale-110 transition-transform`}>
                        {card.icon}
                      </div>
                      <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pt-3">
                      <CardDescription className="text-xs md:text-sm text-muted-foreground">
                        {card.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto">
                      <div className="text-xs md:text-sm text-primary flex items-center group-hover:translate-x-1 transition-transform">
                        Learn more <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4 ml-1 group-hover:ml-2 transition-all" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - FAQs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <Card className="shadow-md hover:shadow-lg transition-all border-muted/40 overflow-hidden rounded-xl">
              <CardHeader className="pb-3 md:pb-4 bg-muted/5">
                <CardTitle className="text-lg md:text-xl flex items-center">
                  <HelpCircle className="h-5 w-5 md:h-6 md:w-6 mr-2 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Browse common questions organized by topic
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full rounded-none border-b">
                    <TabsTrigger value="general" className="text-xs md:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">General</TabsTrigger>
                    <TabsTrigger value="experiments" className="text-xs md:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Experiments</TabsTrigger>
                    <TabsTrigger value="protocols" className="text-xs md:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Protocols</TabsTrigger>
                    <TabsTrigger value="equipment" className="text-xs md:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Equipment</TabsTrigger>
                    <TabsTrigger value="account" className="text-xs md:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Account</TabsTrigger>
                    <TabsTrigger value="data" className="text-xs md:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Data & Reports</TabsTrigger>
                  </TabsList>
                  
                  {Object.keys(faqData).map((category) => (
                    <TabsContent key={category} value={category} className="pt-2 px-4 md:px-6">
                      <ScrollArea className="h-[350px] md:h-[450px] pr-4">
                        <Accordion type="single" collapsible className="w-full">
                          {faqData[category].map((faq, index) => (
                            <AccordionItem key={index} value={`faq-${category}-${index}`} className="border-b border-muted/40">
                              <AccordionTrigger className="text-left text-sm md:text-base py-4 hover:text-primary transition-colors">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="bg-muted/5 rounded-xl px-4 py-4 mb-2">
                                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                                  {faq.answer}
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Helpful Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 md:mt-10"
            >
              <h2 className="text-lg md:text-xl font-semibold mb-5 md:mb-6 flex items-center">
                <span className="bg-primary/10 p-1.5 rounded-lg mr-2">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </span>
                Helpful Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {helpfulLinks.map((link, index) => (
                  <Link href={link.link} key={index} className="h-full block">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-muted/30 group rounded-xl">
                      <CardHeader className="pb-2 pt-3 px-4 md:px-5 bg-muted/5 group-hover:bg-muted/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="bg-primary/10 p-2 md:p-2.5 rounded-full group-hover:scale-110 transition-transform">
                            {link.icon}
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 md:px-5 pb-4 md:pb-5 pt-2">
                        <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">{link.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1.5">
                          {link.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Support Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1 order-1 lg:order-2"
          >
            <div className="lg:sticky lg:top-6">
              <Card className="shadow-md hover:shadow-lg transition-all border-muted/40 overflow-hidden rounded-xl">
                <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="text-lg md:text-xl flex items-center">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 mr-2 text-primary" />
                    Submit a Support Request
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Need personalized help? Our team is ready to assist you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm font-medium">Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                {...field} 
                                className="text-sm focus:border-primary/50 transition-colors" 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Your work email" 
                                {...field} 
                                className="text-sm focus:border-primary/50 transition-colors" 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm font-medium">Subject</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brief description of your issue" 
                                {...field} 
                                className="text-sm focus:border-primary/50 transition-colors" 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm font-medium">Issue Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-sm focus:border-primary/50 transition-colors rounded-lg">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bug" className="text-sm">
                                  <div className="flex items-center">
                                    <Bug className="h-3.5 w-3.5 mr-2 text-red-500" />
                                    Bug or Error
                                  </div>
                                </SelectItem>
                                <SelectItem value="feature" className="text-sm">
                                  <div className="flex items-center">
                                    <Cog className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                    Feature Request
                                  </div>
                                </SelectItem>
                                <SelectItem value="account" className="text-sm">
                                  <div className="flex items-center">
                                    <UserCog className="h-3.5 w-3.5 mr-2 text-amber-500" />
                                    Account Issue
                                  </div>
                                </SelectItem>
                                <SelectItem value="lab" className="text-sm">
                                  <div className="flex items-center">
                                    <Beaker className="h-3.5 w-3.5 mr-2 text-green-500" />
                                    Lab Equipment/Protocol
                                  </div>
                                </SelectItem>
                                <SelectItem value="other" className="text-sm">
                                  <div className="flex items-center">
                                    <HelpCircle className="h-3.5 w-3.5 mr-2 text-purple-500" />
                                    Other
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm font-medium">Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your issue or question..." 
                                className="min-h-[120px] text-sm resize-none focus:border-primary/50 transition-colors rounded-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-xs mt-1.5">
                              Include steps to reproduce if reporting a bug.
                            </FormDescription>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="attachFile"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm font-medium">Attachments (Optional)</FormLabel>
                            <FormControl>
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="dropzone-file"
                                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/5 hover:bg-muted/10 transition-colors border-muted/60 hover:border-primary/30"
                                >
                                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                    <p className="mb-1.5 text-xs md:text-sm text-muted-foreground">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-[10px] md:text-xs text-muted-foreground">
                                      PNG, JPG, PDF or ZIP (MAX. 10MB)
                                    </p>
                                  </div>
                                  <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      onChange(file);
                                    }}
                                    {...fieldProps}
                                  />
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full text-sm mt-4 shadow-sm hover:shadow-md transition-all rounded-lg py-5"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="mr-2">Submitting</span>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Clock className="h-4 w-4" />
                            </motion.div>
                          </>
                        ) : (
                          "Submit Support Request"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-start border-t pt-4 pb-5 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground mb-2.5">
                    <Clock className="h-4 w-4 mr-2.5 flex-shrink-0 text-primary/70" />
                    <span>Typical response time: 1-2 business days</span>
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 mr-2.5 text-green-500 flex-shrink-0" />
                    <span>Support hours: Monday-Friday, 9am-5pm EST</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}