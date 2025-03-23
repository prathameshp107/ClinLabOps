"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock logic to check credentials
      if (formData.email && formData.password) {
        if (loginStage === "credentials") {
          // Check if user has 2FA enabled (mock check)
          const has2FA = formData.email.includes("admin");
          if (has2FA) {
            setLoginStage("2fa");
          } else {
            // Redirect to dashboard based on role
            window.location.href = "/";
          }
        } else if (loginStage === "2fa") {
          if (formData.twoFactorCode === "123456") {
            // Redirect to dashboard
            window.location.href = "/";
          } else {
            setError("Invalid two-factor authentication code. Please try again.");
          }
        }
      } else {
        setError("Please enter both email and password.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    alert("Password reset link will be sent to your email.");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        delay: 0.2 
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 px-4">
      <motion.div 
        className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="flex flex-col items-center justify-center space-y-3" variants={logoVariants}>
          <motion.div 
            className="relative h-24 w-24 overflow-hidden rounded-xl bg-blue-600 flex items-center justify-center"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="absolute inset-0 bg-blue-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.4
              }}
            />
            <motion.div
              className="z-10 flex h-full w-full items-center justify-center text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div 
                className="relative flex h-14 w-14 items-center justify-center"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ 
                  delay: 0.8, 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 10
                }}
              >
                <Shield className="h-12 w-12" />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.h2 
            className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
            variants={itemVariants}
          >
            LabTasker
          </motion.h2>
          <motion.p 
            className="text-center text-sm text-gray-500 dark:text-gray-400"
            variants={itemVariants}
          >
            Preclinical Testing Laboratory Management
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} className="mt-8 space-y-6" variants={containerVariants}>
          {loginStage === "credentials" ? (
            <>
              <motion.div className="space-y-4" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                  <Label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email or Username
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password
                    </Label>
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="pl-10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </motion.div>
                
                <motion.div className="flex items-center" variants={itemVariants}>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={formData.rememberMe}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-400">
                      Remember me for 30 days
                    </Label>
                  </div>
                </motion.div>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label htmlFor="twoFactorCode" className="block text-sm font-medium">
                Two-Factor Authentication Code
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Please enter the 6-digit code from your authentication app.
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="twoFactorCode"
                  name="twoFactorCode"
                  type="text"
                  maxLength={6}
                  required
                  className="pl-10 text-center tracking-widest text-lg"
                  placeholder="000000"
                  value={formData.twoFactorCode}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Use code 123456 for testing purposes
              </p>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : loginStage === "credentials" ? (
                "Sign in"
              ) : (
                "Verify"
              )}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div className="mt-4 text-center" variants={itemVariants}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For security, this system is restricted to authorized personnel only
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
