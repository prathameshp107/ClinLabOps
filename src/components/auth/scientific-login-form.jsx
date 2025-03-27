"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Lottie from "lottie-react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  AlertCircle,
  Github,
  ArrowRight,
  ChevronLeft,
  FlaskConical,
  Microscope,
  Atom,
  Beaker,
  CheckCircle2,
  Loader2
} from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ScientificLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginStage, setLoginStage] = useState("credentials"); // 'credentials', '2fa', 'error'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    twoFactorCode: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const twoFactorInputRef = useRef(null);

  // Load animation
  // Fix the animation import
  useEffect(() => {
    // Import the animation file with a proper path
    import('@/assets/animations/Animation - 1743058762675.json')
      .then(animationModule => {
        setAnimationData(animationModule.default);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
        // Fallback to a remote animation if local file fails
        fetch('https://assets3.lottiefiles.com/packages/lf20_jvkgb2yg.json')
          .then(response => response.json())
          .then(data => setAnimationData(data))
          .catch(fallbackError => {
            console.error('Error loading fallback animation:', fallbackError);
            setAnimationData(null);
          });
      });
  }, []);

  // Add CSS styles to document
  useEffect(() => {
    const globalStyles = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake-animation {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes check {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    .animate-check {
      animation: check 0.3s ease-in-out;
    }
    
    .lab-gradient {
      background: linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(9,9,121,0.1) 100%);
    }
    
    .glass-effect {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .molecule-bg {
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    // Auto-focus on email input when component mounts
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Auto-focus on 2FA input when stage changes
    if (loginStage === "2fa" && twoFactorInputRef.current) {
      twoFactorInputRef.current.focus();
    }
  }, [loginStage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setError("");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock logic to check credentials
      if (formData.email && formData.password) {
        if (loginStage === "credentials") {
          // Check if user has 2FA enabled (mock check)
          const has2FA = formData.email.includes("admin");
          if (has2FA) {
            setLoginStage("2fa");
          } else {
            // Simulate successful login
            setLoginSuccess(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Redirect to dashboard based on role
            router.push("/");
          }
        } else if (loginStage === "2fa") {
          if (formData.twoFactorCode === "123456") {
            // Simulate successful login
            setLoginSuccess(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Redirect to dashboard
            router.push("/");
          } else {
            setError("Invalid two-factor authentication code. Please try again.");
            setShake(true);
            setTimeout(() => setShake(false), 500);
          }
        }
      } else {
        setError("Please enter both email and password.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    // Simulate social login
    setTimeout(() => {
      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 1500);
  };

  // Success animation
  if (loginSuccess) {
    return (
      <div className="min-h-screen flex flex-col molecule-bg overflow-auto">
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

          <div className="flex flex-col items-center justify-center py-4 min-h-[80vh]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-xl shadow-lg p-8 max-w-md w-full glass-effect text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="mx-auto bg-primary/10 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                Login Successful!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6"
              >
                Redirecting you to your dashboard...
              </motion.p>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Remove the animation import and related code
  useEffect(() => {
    // No need to load animation for this login page
  }, []);

  // Rest of the component remains the same...

  // For the credentials view, let's enhance the styling
  return (
    <>
      {loginStage === "2fa" && (
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

            <div className="flex flex-col items-center justify-center py-4 min-h-[80vh]">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden glass-effect max-w-md w-full"
              >
                <div className="p-6">
                  <div className="mb-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4"
                    >
                      <Shield className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
                    <p className="text-muted-foreground mt-1">
                      Please enter the 6-digit code from your authentication app
                    </p>
                  </div>

                  {/* Rest of 2FA content remains the same */}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {loginStage === "credentials" && (
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

            <div className="flex flex-col items-center justify-center py-4 min-h-[80vh]">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden glass-effect max-w-md w-full border border-border/30"
              >
                <div className="p-8">
                  <div className="mb-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4"
                    >
                      <FlaskConical className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h2 className="text-2xl font-bold">Welcome to LabTasker</h2>
                    <p className="text-muted-foreground mt-2">
                      Sign in to your account to continue
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                      >
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Tabs defaultValue="credentials" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="credentials">Email</TabsTrigger>
                      <TabsTrigger value="social">Social</TabsTrigger>
                    </TabsList>

                    <TabsContent value="credentials">
                      <motion.form
                        onSubmit={handleSubmit}
                        className={`space-y-5 ${shake ? 'shake-animation' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                ref={emailInputRef}
                                className="pl-10 h-12 bg-background/50"
                              />
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                              <Button
                                variant="link"
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs p-0 h-auto"
                              >
                                Forgot password?
                              </Button>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                ref={passwordInputRef}
                                className="pl-10 h-12 bg-background/50"
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
                                <span className="sr-only">
                                  {showPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id="rememberMe"
                            checked={formData.rememberMe}
                            onCheckedChange={handleCheckboxChange}
                          />
                          <Label
                            htmlFor="rememberMe"
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Remember me for 30 days
                          </Label>
                        </motion.div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          className="pt-2"
                        >
                          <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                              <>
                                Sign in
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </motion.form>
                    </TabsContent>

                    <TabsContent value="social">
                      <motion.div
                        className="space-y-4 py-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleSocialLogin('github')}
                          className="w-full h-12 bg-background/50"
                        >
                          <Github className="mr-2 h-5 w-5" />
                          Continue with GitHub
                        </Button>

                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleSocialLogin('google')}
                          className="w-full h-12 bg-background/50"
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
                      </motion.div>
                    </TabsContent>
                  </Tabs>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="mt-8 text-center text-sm"
                  >
                    <p className="text-muted-foreground">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-primary hover:underline font-medium">
                        Create an account
                      </Link>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
