"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Dynamically import Lottie to avoid SSR issues with document/window
import dynamic from "next/dynamic"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
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
  Loader2,
  Dna
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
import { login, socialLogin } from "@/services/authService";
import { useTheme } from "next-themes";
import { initiateGoogleLogin, initiateGithubLogin } from "@/services/authService";
import LoginSkeleton from "@/components/auth/login-skeleton";

// Import shared auth styles
import "@/app/auth-shared.css";

export default function ScientificLoginForm() {
  const router = useRouter();
  const { theme } = useTheme();
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
  useEffect(() => {
    import('@/assets/animations/Animation - 1743058762675.json')
      .then(animationModule => {
        setAnimationData(animationModule.default);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
        fetch('https://assets3.lottiefiles.com/packages/lf20_jvkgb2yg.json')
          .then(response => response.json())
          .then(data => setAnimationData(data))
          .catch(fallbackError => {
            console.error('Error loading fallback animation:', fallbackError);
            setAnimationData(null);
          });
      });
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

  // Handle OAuth redirect
  useEffect(() => {
    // Check if we have OAuth parameters in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      setError(decodeURIComponent(error));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      // Remove error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (token && user) {
      try {
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);

        // Remove params from URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('token');
        newUrl.searchParams.delete('user');
        window.history.replaceState({}, document.title, newUrl.toString());

        // Set login success and redirect to dashboard
        setLoginSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (err) {
        setError("Failed to process OAuth login: " + (err.message || "Unknown error"));
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email: formData.email, password: formData.password });
      setLoginSuccess(true);
      // It's good practice to wait for a moment for the user to see the success state
      // before redirecting.
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during login. Please try again.");
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
        router.push("/dashboard");
      }, 100);
    }, 100);
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  // Handle GitHub login
  const handleGithubLogin = () => {
    initiateGithubLogin();
  };

  // Render success animation if login is successful
  if (loginSuccess) {
    return (
      <div className="min-h-screen flex flex-col auth-gradient-bg overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />

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
                Welcome Back!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8 text-lg"
              >
                Redirecting you to your dashboard...
              </motion.p>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Main login form render
  return (
    <div className="min-h-screen auth-gradient-bg flex flex-col overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-float-delayed" />

      <div className="container mx-auto px-4 py-6 relative z-10 flex flex-col min-h-screen">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg backdrop-blur-sm border border-primary/20">
              <Beaker className="h-6 w-6 text-primary" />
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
            className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden glass-panel shadow-2xl"
          >
            {/* Left side - Decorative panel */}
            <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden bg-gradient-to-br from-primary/10 to-purple-500/10">
              <div className="relative z-10">
                <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
                  Secure Access
                </Badge>
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Accelerate Your <br />
                  <span className="text-primary">Research Workflow</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-sm">
                  Access your laboratory data, track experiments, and collaborate with your team in one secure platform.
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
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">Experiment #842</div>
                      <div className="text-[10px] text-muted-foreground">Completed successfully</div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -left-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 flex items-center gap-3"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <Dna className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">DNA Sequencing</div>
                      <div className="text-[10px] text-muted-foreground">Processing... 84%</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-4">
                <div className="glass-panel p-3 rounded-xl text-center">
                  <FlaskConical className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xs font-medium">Tracking</div>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center">
                  <Microscope className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-xs font-medium">Analysis</div>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-xs font-medium">Security</div>
                </div>
              </div>

              {/* Abstract shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
            </div>

            {/* Right side - Login form */}
            <div className="p-8 md:p-12 bg-card/50 backdrop-blur-sm flex flex-col justify-center h-full">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {loginStage === "2fa" ? "Two-Factor Authentication" : "Welcome Back"}
                </h2>
                <p className="text-muted-foreground">
                  {loginStage === "2fa"
                    ? "Please enter the 6-digit code from your authentication app"
                    : "Enter your credentials to access your account"}
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
                    <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {loginStage === "2fa" ? (
                isLoading ? (
                  <div className="space-y-6">
                    <LoginSkeleton />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={`space-y-6 ${shake ? 'shake-animation' : ''}`}>
                    <div className="space-y-2">
                      <Label htmlFor="twoFactorCode" className="text-sm font-medium">Authentication Code</Label>
                      <div className="relative">
                        <Input
                          id="twoFactorCode"
                          name="twoFactorCode"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          required
                          placeholder="123456"
                          value={formData.twoFactorCode}
                          onChange={handleInputChange}
                          ref={twoFactorInputRef}
                          className="auth-input pl-4 h-14 text-center text-2xl tracking-[0.5em] font-mono"
                          maxLength={6}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="auth-button w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        "Verify Code"
                      )}
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => setLoginStage("credentials")}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        Back to Login
                      </Button>
                    </div>
                  </form>
                )
              ) : (
                <>
                  <Tabs defaultValue="credentials" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-xl">
                      <TabsTrigger value="credentials" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Email</TabsTrigger>
                      <TabsTrigger value="social" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Social</TabsTrigger>
                    </TabsList>

                    <TabsContent value="credentials" className="mt-0">
                      {isLoading ? (
                        <div className="space-y-5">
                          <LoginSkeleton />
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className={`space-y-5 ${shake ? 'shake-animation' : ''}`}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
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
                                  className="auth-input pl-10 h-12"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Button
                                  variant="link"
                                  type="button"
                                  onClick={handleForgotPassword}
                                  className="text-xs p-0 h-auto text-primary font-medium"
                                >
                                  Forgot password?
                                </Button>
                              </div>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
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
                                  className="auth-input pl-10 h-12 pr-10"
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
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="rememberMe"
                              checked={formData.rememberMe}
                              onCheckedChange={handleCheckboxChange}
                              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <Label
                              htmlFor="rememberMe"
                              className="text-sm font-normal text-muted-foreground cursor-pointer"
                            >
                              Remember me for 30 days
                            </Label>
                          </div>

                          <Button
                            type="submit"
                            className="auth-button w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                              "Sign in"
                            )}
                          </Button>
                        </form>
                      )}
                    </TabsContent>

                    <TabsContent value="social" className="mt-0">
                      <div className="space-y-4 py-2">
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
                  </Tabs>

                  <div className="mt-8 text-center text-sm">
                    <p className="text-muted-foreground">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-primary hover:underline font-bold">
                        Create an account
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="text-center py-4 text-xs text-muted-foreground relative z-10">
          <p>&copy; {new Date().getFullYear()} LabTasker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}