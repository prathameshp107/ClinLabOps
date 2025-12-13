"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
// Dynamically import Lottie to avoid SSR issues with document/window
import dynamic from "next/dynamic"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
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
  Shield,
  Dna
} from "lucide-react"

// Auth Components
import RegistrationSuccessModal from "@/components/auth/RegistrationSuccessModal"

import { register } from "@/services/authService"
import { initiateGoogleLogin, initiateGithubLogin } from "@/services/authService";

// Import shared auth styles
import "@/app/auth-shared.css";

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

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [formError, setFormError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registeredUserEmail, setRegisteredUserEmail] = useState("")
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
        setRegisteredUserEmail(data.email)
        setShowSuccessModal(true)
        setSuccessMessage("Registration successful!")
      } else {
        // Handle other responses
        setSuccessMessage(response.message)
      }

      setIsLoading(false)

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

  // Close success modal handler
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  // Handle Google login
  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  // Handle GitHub login
  const handleGithubLogin = () => {
    initiateGithubLogin();
  };

  // Success animation
  if (signupSuccess) {
    return (
      <div className="min-h-screen auth-gradient-bg flex flex-col overflow-hidden relative">
        <div className="container mx-auto px-4 py-6 relative z-10 h-full flex flex-col">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors glass-panel px-4 py-2 rounded-full">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <div className="flex-grow flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-10 max-w-md w-full text-center rounded-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="mx-auto bg-green-500/20 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
              >
                Registration Successful!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8 text-lg"
              >
                Welcome to LabTasker.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen auth-gradient-bg flex flex-col overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-float-delayed" />

      {/* Registration Success Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSuccessModal ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <RegistrationSuccessModal
          isOpen={showSuccessModal}
          userEmail={registeredUserEmail}
          onClose={handleCloseSuccessModal}
        />
      </motion.div>

      <div className="container mx-auto px-4 py-6 relative z-10 flex flex-col min-h-screen">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg backdrop-blur-sm border border-primary/20">
              <Atom className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              LabTasker
            </span>
          </Link>

          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors glass-panel px-4 py-2 rounded-full">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <div className="flex-grow flex items-center justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden glass-panel shadow-2xl"
          >
            {/* Left side - Decorative panel */}
            <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden bg-gradient-to-br from-primary/10 to-purple-500/10">
              <div className="relative z-10">
                <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
                  Join the Platform
                </Badge>
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Start Your <br />
                  <span className="text-primary">Scientific Journey</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-sm">
                  Create an account to manage your experiments, collaborate with peers, and accelerate your research.
                </p>
              </div>

              <div className="relative z-10 flex-grow flex items-center justify-center my-8">
                <div className="relative w-full max-w-[300px] aspect-square">
                  {animationData ? (
                    <Lottie
                      animationData={animationData}
                      loop={true}
                      className="w-full h-full drop-shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                      <Atom className="h-32 w-32 text-primary animate-spin-slow" />
                    </div>
                  )}

                  {/* Floating cards */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 flex items-center gap-3"
                  >
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <Microscope className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">New Protocol</div>
                      <div className="text-[10px] text-muted-foreground">Created just now</div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -left-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 flex items-center gap-3"
                  >
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                      <FlaskConical className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">Sample Analysis</div>
                      <div className="text-[10px] text-muted-foreground">In progress</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-4">
                <div className="glass-panel p-3 rounded-xl text-center">
                  <Beaker className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xs font-medium">Experiments</div>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center">
                  <FileCheck className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-xs font-medium">Reports</div>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center">
                  <User className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-xs font-medium">Collaboration</div>
                </div>
              </div>

              {/* Abstract shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
            </div>

            {/* Right side - Form */}
            <div className="p-8 md:p-12 bg-card/50 backdrop-blur-sm flex flex-col h-full overflow-y-auto max-h-[85vh]">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-muted-foreground">
                  Join LabTasker to optimize your preclinical testing workflow
                </p>
              </div>

              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-xl">
                  <TabsTrigger value="email" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Email</TabsTrigger>
                  <TabsTrigger value="social" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Social Login</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent key="email-tab" value="email" className="mt-0">
                    <AnimatePresence>
                      {formError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{formError}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                      {successMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert variant="success" className="mb-6 border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{successMessage}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Form {...form}>
                      <motion.form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Full Name */}
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Dr. Jane Smith"
                                  {...field}
                                  className="auth-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                Work Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="jane.smith@research-lab.org"
                                  {...field}
                                  className="auth-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Password */}
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...field}
                                    className="auth-input pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
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

                        {/* Confirm Password */}
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...field}
                                    className="auth-input pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Department Selection */}
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <Microscope className="h-4 w-4 text-muted-foreground" />
                                Department (Optional)
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="auth-input">
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

                        {/* Terms and Conditions */}
                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal text-muted-foreground">
                                  I agree to the{" "}
                                  <Link href="/terms" className="text-primary hover:underline font-medium">
                                    Terms of Service
                                  </Link>{" "}
                                  and{" "}
                                  <Link href="/privacy" className="text-primary hover:underline font-medium">
                                    Privacy Policy
                                  </Link>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="auth-button w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 mt-4"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </motion.form>
                    </Form>
                  </TabsContent>

                  <TabsContent key="social-tab" value="social" className="mt-0">
                    <div className="space-y-4 py-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleGithubLogin}
                        className="auth-button w-full h-12 border-muted-foreground/20 hover:bg-muted/50"
                        disabled={isLoading}
                      >
                        <Github className="mr-2 h-5 w-5" />
                        Continue with GitHub
                      </Button>

                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleGoogleLogin}
                        className="auth-button w-full h-12 border-muted-foreground/20 hover:bg-muted/50"
                        disabled={isLoading}
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
                        </svg>
                        Continue with Google
                      </Button>
                    </div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>

              <div className="mt-auto pt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-bold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center py-4 text-xs text-muted-foreground relative z-10">
          <p>&copy; {new Date().getFullYear()} LabTasker. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}