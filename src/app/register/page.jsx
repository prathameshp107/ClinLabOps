"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
// Dynamically import Lottie to avoid SSR issues with document/window
import dynamic from "next/dynamic"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
// If you encounter SSR errors with other components, use dynamic import with ssr: false as shown above.
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// UI Components
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Icons
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ChevronLeft,
  Github,
  Mail,
  Lock,
  User,
  FileCheck,
  Beaker,
  Microscope,
  FlaskConical,
  Atom,
  Info,
} from "lucide-react"

import { register } from "@/services/authService"

// Form schema with validation
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
  department: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Create a separate CSS file for these styles
// Let's create a new file at e:\Project\labtasker\src\app\register\register.css
// And import it here
import './register.css';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [formError, setFormError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { theme } = useTheme()
  const router = useRouter()

  // Animation data state
  const [animationData, setAnimationData] = useState(null)

  // Load local animation file
  useEffect(() => {
    // Import the local animation file
    import('@/assets/animations/Animation - 1743058762675.json')
      .then(animationModule => {
        setAnimationData(animationModule.default);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
        // Fallback to a different animation if local file fails
        fetch('https://assets3.lottiefiles.com/packages/lf20_jvkgb2yg.json')
          .then(response => response.json())
          .then(data => setAnimationData(data))
          .catch(fallbackError => {
            console.error('Error loading fallback animation:', fallbackError);
            setAnimationData(null);
          });
      });
  }, []);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      termsAccepted: false,
    },
  })

  // Watch password to calculate strength
  const watchPassword = form.watch("password")

  useEffect(() => {
    // Calculate password strength
    let strength = 0
    if (watchPassword.length > 0) strength += 20
    if (watchPassword.length >= 8) strength += 20
    if (/[A-Z]/.test(watchPassword)) strength += 20
    if (/[0-9]/.test(watchPassword)) strength += 20
    if (/[^A-Za-z0-9]/.test(watchPassword)) strength += 20

    setPasswordStrength(strength)
  }, [watchPassword])

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true)
    setFormError("")
    setSuccessMessage("")

    try {
      const response = await register({
        name: data.fullName,
        email: data.email,
        password: data.password,
      })

      // Check if response exists and has a message
      if (!response || !response.message) {
        setFormError("An unexpected error occurred. Please try again.")
        setIsLoading(false)
        return;
      }

      // Handle successful registration
      if (response.message === "User registered successfully") {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          setIsLoading(false);
          router.push("/login");
        }, 1500);
      } else {
        // Handle other responses
        setSuccessMessage(response.message);
        setTimeout(() => {
          setIsLoading(false);
          router.push("/login");
        }, 1500);
      }

    } catch (error) {
      console.error("Error submitting form:", error)
      setIsLoading(false)
      // Handle different types of errors
      if (error.response && error.response.data && error.response.data.message) {
        setFormError(error.response.data.message)
      } else if (error.message) {
        setFormError(error.message)
      } else {
        setFormError("An unexpected error occurred. Please try again.")
      }
    }
  }

  // Get password strength color
  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Get password strength text
  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 80) return "Medium"
    return "Strong"
  }

  // Success animation
  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col molecule-bg overflow-auto">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="inline-flex items-center text-sm hover:text-primary transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-5xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden glass-effect"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left side - Branding and info */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lab-gradient p-6 flex flex-col justify-between relative overflow-hidden max-h-[90vh] md:max-h-none"
                  >
                    {/* Content remains the same */}
                  </motion.div>

                  {/* Right side - Form */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="p-6 overflow-y-auto max-h-[90vh] md:max-h-none"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold">Create Your Lab Account</h2>
                      <p className="text-muted-foreground">Join LabTasker to optimize your preclinical testing workflow</p>
                    </div>

                    <AnimatePresence>
                      {formError && (
                        <motion.div key="form-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{formError}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                      {successMessage && (
                        <motion.div key="success-message" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                          <Alert variant="success" className="mb-4">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{successMessage}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Tabs defaultValue="email" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="social">Social Login</TabsTrigger>
                      </TabsList>

                      <AnimatePresence mode="wait">
                        <TabsContent key="email-tab" value="email" className="pt-4">
                          {/* Email form content */}
                        </TabsContent>
                        <TabsContent key="social-tab" value="social" className="pt-4">
                          {/* Social login content */}
                        </TabsContent>
                      </AnimatePresence>
                    </Tabs>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col molecule-bg">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="inline-flex items-center text-sm hover:text-primary transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-full max-w-5xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-xl shadow-lg overflow-hidden glass-effect"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left side - Branding and info */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lab-gradient p-8 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Atom className="h-8 w-8 text-primary" />
                      </motion.div>
                      <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-bold text-primary"
                      >
                        LabTasker
                      </motion.h1>
                    </div>

                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Badge variant="outline" className="mb-2 text-xs font-normal">
                        Preclinical Testing Platform
                      </Badge>
                    </motion.div>

                    <motion.p
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-muted-foreground mb-6"
                    >
                      Streamline your preclinical testing workflow with our comprehensive laboratory task management platform
                    </motion.p>

                    {/* Animation */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="h-48 mb-6"
                    >
                      {animationData ? (
                        <Lottie
                          animationData={animationData}
                          loop={true}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                      )}
                    </motion.div>

                    {/* Features */}
                    <div className="space-y-4">
                      {[
                        {
                          icon: <Beaker className="h-4 w-4 text-primary" />,
                          title: "Experiment Tracking",
                          description: "Monitor all preclinical tests in real-time",
                          delay: 0.6
                        },
                        {
                          icon: <FlaskConical className="h-4 w-4 text-primary" />,
                          title: "Sample Management",
                          description: "Track specimens throughout testing lifecycle",
                          delay: 0.7
                        },
                        {
                          icon: <Microscope className="h-4 w-4 text-primary" />,
                          title: "Data Analysis",
                          description: "Integrated tools for research insights",
                          delay: 0.8
                        }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: feature.delay }}
                          className="flex items-start gap-3"
                        >
                          <div className="bg-background rounded-full p-1 mt-0.5">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32"
                  />
                </motion.div>

                {/* Right side - Form */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="p-8"
                >
                  <div className="mb-6">
                    <motion.h2
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-2xl font-bold mb-1"
                    >
                      Create Your Lab Account
                    </motion.h2>
                    <motion.p
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-muted-foreground text-sm"
                    >
                      Join LabTasker to optimize your preclinical testing workflow
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Tabs defaultValue="email" className="mb-6">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="social">SSO Login</TabsTrigger>
                      </TabsList>

                      <AnimatePresence mode="wait">
                        <TabsContent value="email" className="pt-4">
                          <AnimatePresence>
                            {formError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Alert variant="destructive" className="mb-4">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>{formError}</AlertDescription>
                                </Alert>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <Form {...form}>
                            <motion.form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className={`space-y-4 ${formError ? 'shake-animation' : ''}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* Full Name */}
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="fullName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Full Name
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Dr. Jane Smith"
                                          {...field}
                                          className="transition-all focus:ring-2 focus:ring-primary/20"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {/* Email */}
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        Work Email
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="email"
                                          placeholder="jane.smith@research-lab.org"
                                          {...field}
                                          className="transition-all focus:ring-2 focus:ring-primary/20"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {/* Password */}
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                        Password
                                      </FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className="transition-all focus:ring-2 focus:ring-primary/20"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                          >
                                            <motion.div
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                              ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                              )}
                                            </motion.div>
                                          </Button>
                                        </div>
                                      </FormControl>

                                      {/* Password strength meter */}
                                      {watchPassword && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          transition={{ duration: 0.3 }}
                                          className="mt-2 space-y-1"
                                        >
                                          <div className="flex justify-between text-xs">
                                            <span>Password strength:</span>
                                            <span className={passwordStrength >= 80 ? "text-green-500" : passwordStrength >= 40 ? "text-yellow-500" : "text-red-500"}>
                                              {getStrengthText()}
                                            </span>
                                          </div>
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 0.5 }}
                                          >
                                            <Progress value={passwordStrength} className={`h-1 ${getStrengthColor()}`} />
                                          </motion.div>
                                        </motion.div>
                                      )}

                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {/* Confirm Password */}
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="confirmPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                        Confirm Password
                                      </FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className="transition-all focus:ring-2 focus:ring-primary/20"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                          >
                                            <motion.div
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                              ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                              )}
                                            </motion.div>
                                          </Button>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {/* Department Selection */}
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="department"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Microscope className="h-4 w-4 text-muted-foreground" />
                                        Department (Optional)
                                      </FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Select your department" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="toxicology">Toxicology</SelectItem>
                                          <SelectItem value="pathology">Pathology</SelectItem>
                                          <SelectItem value="bioanalysis">Bioanalysis</SelectItem>
                                          <SelectItem value="pharmacology">Pharmacology</SelectItem>
                                          <SelectItem value="molecular_biology">Molecular Biology</SelectItem>
                                          <SelectItem value="histology">Histology</SelectItem>
                                          <SelectItem value="clinical_pathology">Clinical Pathology</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {/* Terms and Conditions */}
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="termsAccepted"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          className="transition-all data-[state=checked]:animate-check"
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm font-normal">
                                          I agree to the{" "}
                                          <Link href="/terms" className="text-primary hover:underline">
                                            Terms of Service
                                          </Link>{" "}
                                          and{" "}
                                          <Link href="/privacy" className="text-primary hover:underline">
                                            Privacy Policy
                                          </Link>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                                                  <Info className="h-3 w-3 text-muted-foreground" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className="text-xs max-w-xs">
                                                  Your data will be handled according to laboratory compliance standards and regulations
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </FormLabel>
                                        <FormMessage />
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              {/* Submit Button */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="mt-6 flex justify-end">
                                  <Button
                                    type="submit"
                                    className="w-full md:w-auto"
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <ArrowRight className="mr-2 h-4 w-4" />
                                    )}
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                  </Button>
                                </div>
                              </motion.div>
                            </motion.form>
                          </Form>
                        </TabsContent>

                        <TabsContent value="social">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 py-2"
                          >
                            <Alert variant="outline" className="bg-muted/50 border-primary/20">
                              <AlertDescription className="text-sm text-muted-foreground">
                                Sign up quickly using your institutional or research organization accounts
                              </AlertDescription>
                            </Alert>

                            <div className="grid gap-3">
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button variant="outline" className="w-full justify-start" size="lg">
                                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                      d="M20.9 2H3.1C2.5 2 2 2.5 2 3.1V20.9C2 21.5 2.5 22 3.1 22H12.7V14.2H10.1V11.2H12.7V9.1C12.7 6.6 14.2 5.2 16.5 5.2C17.6 5.2 18.5 5.3 18.8 5.3V8H17.1C15.8 8 15.5 8.6 15.5 9.5V11.2H18.7L18.3 14.2H15.5V22H20.9C21.5 22 22 21.5 22 20.9V3.1C22 2.5 21.5 2 20.9 2Z"
                                      fill="#4285F4"
                                    />
                                    <path
                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                      fill="#34A853"
                                    />
                                    <path
                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                      fill="#FBBC05"
                                    />
                                    <path
                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                      fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                  </svg>
                                  Sign up with Institutional Email
                                </Button>
                              </motion.div>

                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button variant="outline" className="w-full justify-start" size="lg">
                                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.9 2H3.1C2.5 2 2 2.5 2 3.1V20.9C2 21.5 2.5 22 3.1 22H12.7V14.2H10.1V11.2H12.7V9.1C12.7 6.6 14.2 5.2 16.5 5.2C17.6 5.2 18.5 5.3 18.8 5.3V8H17.1C15.8 8 15.5 8.6 15.5 9.5V11.2H18.7L18.3 14.2H15.5V22H20.9C21.5 22 22 21.5 22 20.9V3.1C22 2.5 21.5 2 20.9 2Z" fill="#1877F2" />
                                  </svg>
                                  Sign up with ORCID
                                </Button>
                              </motion.div>

                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button variant="outline" className="w-full justify-start" size="lg">
                                  <Github className="mr-2 h-4 w-4" />
                                  Sign up with GitHub
                                </Button>
                              </motion.div>
                            </div>

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.4 }}
                              className="mt-4 text-center text-xs text-muted-foreground"
                            >
                              <p>
                                By using SSO, you still need to accept our{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                  Terms of Service
                                </Link>
                              </p>
                            </motion.div>
                          </motion.div>
                        </TabsContent>
                      </AnimatePresence>
                    </Tabs>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-6 text-center"
                  >
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      Already have a laboratory account?{" "}
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                      >
                        <Link href="/login" className="text-primary font-medium hover:underline">
                          Sign in
                        </Link>
                      </motion.span>
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}