"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  AlertCircle,
  Github,
  ArrowRight,
  FlaskConical,
  Microscope,
  Atom
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const twoFactorInputRef = useRef(null);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

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
    // Implement forgot password functionality
    alert("Password reset link will be sent to your email.");
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5,
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    },
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
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
    hidden: { scale: 0.8, opacity: 0, rotateY: 90 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.3
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 15px rgba(66, 153, 225, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const successVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  // DNA Animation for loading state
  const DNALoader = () => (
    <div className="relative w-8 h-8">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0 w-full h-full"
          initial={{ rotate: 0 }}
          animate={{
            rotate: 360,
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2
            }
          }}
        >
          <motion.div
            className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-blue-400"
            animate={{
              y: [0, 8, 0],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror"
              }
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror"
              }
            }}
          />
        </motion.div>
      ))}
    </div>
  );

  // Success animation component
  const SuccessAnimation = () => (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/90 to-indigo-800/90 backdrop-blur-sm z-50 rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          transition: {
            duration: 0.8,
            type: "spring",
            damping: 15
          }
        }}
      >
        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4c1d95" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </motion.div>
        </div>
      </motion.div>
      <motion.h2
        className="text-white font-bold text-2xl mt-6"
        variants={successVariants}
        initial="hidden"
        animate="visible"
      >
        Login Successful!
      </motion.h2>
      <motion.p
        className="text-blue-100 mt-2"
        variants={successVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        Redirecting to your dashboard...
      </motion.p>
    </motion.div>
  );

  const particlesOptions = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"]
      },
      shape: {
        type: ["circle", "triangle", "polygon"],
        polygon: {
          sides: 6
        }
      },
      opacity: {
        value: 0.3,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#a5b4fc",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.5
          }
        },
        push: {
          particles_nb: 3
        }
      }
    },
    retina_detect: true
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 -z-10">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0"
        />
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-20 text-blue-500/20 dark:text-blue-400/10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Atom size={120} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-indigo-500/20 dark:text-indigo-400/10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <Microscope size={100} />
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-32 text-purple-500/20 dark:text-purple-400/10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <FlaskConical size={80} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={loginStage}
          className="w-full max-w-md relative"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {/* Glassmorphism Container */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 p-8 rounded-xl border border-blue-100 dark:border-blue-900 shadow-xl relative overflow-hidden">
            {/* Success overlay */}
            <AnimatePresence>
              {loginSuccess && <SuccessAnimation />}
            </AnimatePresence>

            {/* Logo and Header */}
            <motion.div className="flex flex-col items-center justify-center space-y-4 mb-6" variants={logoVariants}>
              <motion.div
                className="relative h-24 w-24 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center"
                whileHover={{
                  rotate: 5,
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(79, 70, 229, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #3b82f6, #6366f1)",
                      "linear-gradient(225deg, #4f46e5, #7c3aed)",
                      "linear-gradient(135deg, #7c3aed, #3b82f6)",
                      "linear-gradient(315deg, #6366f1, #4f46e5)",
                      "linear-gradient(45deg, #3b82f6, #6366f1)"
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="z-10 flex h-full w-full items-center justify-center text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{
                      delay: 0.8,
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                  >
                    <Atom className="h-12 w-12" />
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.h2
                className="mt-2 text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
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

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="border-red-500 bg-red-50/80 dark:bg-red-900/30 mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={containerVariants}
              animate={shake ? "shake" : "visible"}
            >
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
                          className="pl-10 bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-700 focus:ring-blue-400 dark:focus:ring-blue-700"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          ref={emailInputRef}
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
                          className="pl-10 bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-700 focus:ring-blue-400 dark:focus:ring-blue-700"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          ref={passwordInputRef}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
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
                          className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-600 dark:data-[state=checked]:border-blue-700"
                        />
                        <Label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-400">
                          Remember me for 30 days
                        </Label>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Login Button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      className="w-full flex items-center justify-center py-2.5 px-4 rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70 transition-all"
                      disabled={isLoading}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {isLoading ? (
                        <DNALoader />
                      ) : (
                        <>
                          Sign in
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>

                  {/* Social Login Options */}
                  <motion.div
                    className="mt-6"
                    variants={itemVariants}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white/70 dark:bg-gray-900/70 px-2 text-gray-500 dark:text-gray-400">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                      <motion.button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-white/90 dark:bg-gray-800/90 px-4 py-2.5 text-gray-500 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80"
                        onClick={() => handleSocialLogin('github')}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Github className="h-5 w-5 mr-2" />
                        <span>GitHub</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="twoFactorCode" className="block text-sm font-medium mb-1">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Please enter the 6-digit code from your authentication app.
                    </p>
                  </motion.div>

                  <motion.div
                    className="relative"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="twoFactorCode"
                      name="twoFactorCode"
                      type="text"
                      maxLength={6}
                      required
                      className="pl-10 text-center tracking-widest text-lg bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-700 focus:ring-blue-400 dark:focus:ring-blue-700"
                      placeholder="000000"
                      value={formData.twoFactorCode}
                      onChange={handleInputChange}
                      ref={twoFactorInputRef}
                    />
                  </motion.div>

                  <motion.p
                    className="text-xs text-gray-500 dark:text-gray-400 mt-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Use code 123456 for testing purposes
                  </motion.p>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      type="submit"
                      className="w-full flex items-center justify-center py-2.5 px-4 rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70 transition-all"
                      disabled={isLoading}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {isLoading ? (
                        <DNALoader />
                      ) : (
                        <>
                          Verify
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </motion.form>

            <motion.div
              className="mt-6 text-center"
              variants={itemVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-4">
                For security, this system is restricted to authorized personnel only.
                <br />All login attempts are monitored and logged.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
