"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { HoverGlowCard, GlowingStarsBackgroundCard } from "@/components/ui/aceternity/cards";
import { ThreeDCard } from "@/components/ui/aceternity/three-d-card";

// Icons
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Code,
  Cpu,
  Database,
  FlaskConical,
  Github,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Mail,
  MessageSquare,
  Microscope,
  PlayCircle,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Twitter,
  Users,
  Youtube,
  Linkedin,
  Zap,
  FileText,
  Globe,
  UserPlus,
  FolderKanban,
  HelpCircle,
  CheckSquare,
  Badge,
  Cloud,
  MoveRight,
  BarChart3,
  MapPin,
  Phone,
  X,
  ArrowUp 
} from "lucide-react";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState("dashboard");
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <LayoutDashboard className="h-5 w-5 text-primary" />,
      title: "Intuitive Dashboard",
      description: "Comprehensive overview of all laboratory operations in one place"
    },
    {
      icon: <Layers className="h-5 w-5 text-primary" />,
      title: "Task Management",
      description: "Organize, assign and track laboratory tasks with ease"
    },
    {
      icon: <FlaskConical className="h-5 w-5 text-primary" />,
      title: "Experiment Tracking",
      description: "Monitor experiments from planning to completion with detailed logs"
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Team Collaboration",
      description: "Seamless communication and task sharing between lab members"
    },
    {
      icon: <Database className="h-5 w-5 text-primary" />,
      title: "Data Management",
      description: "Secure storage and organization of research data and results"
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Compliance Tools",
      description: "Ensure adherence to laboratory standards and regulations"
    },
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "Documentation",
      description: "Generate and manage reports, protocols, and SOPs"
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: "Automation",
      description: "Streamline repetitive tasks and workflows with smart automation"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-primary" />,
      title: "Smart Insights",
      description: "AI-powered analytics to optimize laboratory performance"
    }
  ];

  const testimonials = [
    {
      quote: "LabTasker has transformed how we manage our research projects. The efficiency gains are remarkable.",
      author: "Dr. Sarah Chen",
      role: "Research Director, BioTech Innovations"
    },
    {
      quote: "The compliance tools alone saved us countless hours during our last audit. Absolutely worth the investment.",
      author: "James Wilson",
      role: "Lab Manager, PharmaSolutions"
    },
    {
      quote: "Our team collaboration has improved dramatically since implementing LabTasker across our facilities.",
      author: "Dr. Michael Rodriguez",
      role: "Principal Investigator, University Research Center"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <BackgroundBeams className="opacity-20" />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300 hover:bg-background/90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-primary/10 p-2.5 rounded-lg group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              <Microscope className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/70 group-hover:scale-105 transition-transform duration-300">
              LabTasker
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#features", label: "Features", icon: <Layers className="h-4 w-4" /> },
              { href: "#benefits", label: "Benefits", icon: <Star className="h-4 w-4" /> },
              { href: "#testimonials", label: "Testimonials", icon: <MessageSquare className="h-4 w-4" /> },
              { href: "#pricing", label: "Pricing", icon: <Database className="h-4 w-4" /> }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-background/60 backdrop-blur-sm border border-border/20 rounded-full px-3 py-1.5 shadow-sm">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-full h-8 px-4">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">EN</span>
              </Button>

              <div className="h-4 w-px bg-border/40"></div>

              <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-full h-8 px-4">
                <Link href="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Help</span>
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-background/60 backdrop-blur-sm border border-border/20 rounded-full px-3 py-1.5 shadow-sm">
                <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full h-8 px-4">
                  <Link href="/login" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Log In</span>
                  </Link>
                </Button>

                <div className="h-4 w-px bg-border/40"></div>

                <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full h-8 px-4 ">
                  <Link href="/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Register</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-background/60 backdrop-blur-sm border border-border/20 rounded-full px-2 py-1.5 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 px-4 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                asChild
              >
                <Link href="/projects" className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4" />
                  <span className="font-medium text-xs">Projects</span>
                  <div className="px-1.5 py-0.5 bg-primary/10 rounded-full text-[10px] font-medium text-primary">
                    3
                  </div>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 px-4 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                asChild
              >
                <Link href="/tasks" className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  <span className="font-medium text-xs">Tasks</span>
                  <div className="px-1.5 py-0.5 bg-primary/10 rounded-full text-[10px] font-medium text-primary">
                    5
                  </div>
                </Link>
              </Button>
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full h-8 px-4"
              asChild
            >
              <Link href="/admin-dashboard" className="flex items-center gap-2">
                <span className="font-medium text-xs">Dashboard</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/30" />
          <BackgroundBeams className="opacity-30" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
              >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                <span>Now with AI-powered insights</span>
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto max-w-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Modern Laboratory Management
                <span className="relative whitespace-nowrap text-primary">
                  <span className="relative">
                    Made Simple
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 418 42"
                      className="absolute -bottom-2 left-0 h-[0.58em] w-full text-primary/20"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.014 1.055 26.322 0 28.147 0 30.51v.08c0 3.114 3.584 5.1 7.271 6.066 7.121 1.85 17.889 4.45 29.201 7.203 6.938 1.692 13.9 3.444 20.403 5.217 7.27 1.99 10.272 3.167 12.25 3.75 2.25.68 4.01.17 5.95-.94 1.37-.79 32.81-19.23 88.6-57.9 2.21-1.54 5.25-1.6 7.5-.23 2.3 1.4 56.3 38.2 89.85 57.33 1.9 1.1 3.7 1.63 5.5 1.63 1.1 0 2.2-.17 3.3-.5 1.5-.5 4.2-1.56 11.5-3.5 12.4-3.28 40.6-10.7 75.2-16.7 23.1-4 43.9-7.2 63.9-7.3 1.5 0 3.2.1 4.8.3 1.6.2 4.4.7 7.4 1.4 3 .8 5.2 3.4 5.2 6.5 0 1.4-.5 2.8-1.4 3.8-1.9 2.5-8.7 7.4-23.4 13.2-42.1 16.7-89.5 25.9-130.3 25.9-28.7 0-56.5-4.6-77.4-8.9-14.4-3-25.9-5.7-30.6-7.1-1.7-.5-3.2-1-4.5-1.4-1.7-.6-3.1-.9-4.2-1-1.1-.1-2.5-.2-4.4-.2-2.6 0-6.7.9-14.8 3.4-13.2 4.1-37.5 11.6-64.5 19.8-30.3 9.2-48.3 10.4-57.7 10.4-7.1 0-11.1-1.4-13.5-2.7-2.3-1.3-4.1-3.5-5-6.1-.9-2.6-.7-5.8.6-9.5 1.3-3.7 3.9-8.1 7.9-13.2 7.9-10.1 19.2-24.2 31.9-39.9 25.1-31.3 59.6-74.2 88.8-110.7 2.4-3 6-4.7 9.8-4.7 3.8 0 7.4 1.7 9.8 4.7 29.2 36.5 63.7 79.4 88.8 110.7 12.7 15.7 24 29.8 31.9 39.9 4 5.1 6.6 9.5 7.9 13.2 1.3 3.7 1.5 6.9.6 9.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70 sm:text-xl"
              >
                Streamline your laboratory workflow with our all-in-one platform. Manage experiments, track samples, and
                collaborate with your team in real-time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">Get Started Free</span>
                  <span className="absolute inset-0 -z-0 h-full w-full bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
                </Button>
                <Button variant="outline" size="lg" className="group">
                  <span>View Demo</span>
                  <PlayCircle className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 flex items-center justify-center gap-6 text-sm text-foreground/60"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-r from-primary/80 to-primary/60"
                      style={{ zIndex: 5 - i }}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center">
                    <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400/50 text-yellow-400/50" />
                  </div>
                  <span>Trusted by 5000+ researchers worldwide</span>
                </div>
              </motion.div>
            </div>

            <div className="relative mt-16">
              <div className="mx-auto max-w-6xl px-4">
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-1 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm font-medium text-foreground/70">app.labtasker.com/demo</div>
                    <div className="w-12"></div>
                  </div>
                  <div className="relative h-[500px] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <FlaskConical className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">LabTasker Dashboard</h3>
                        <p className="mt-1 text-foreground/70">Interactive demo coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-4 -top-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg md:flex">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/30"></div>
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600">
                    <Rocket className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Run Your Lab
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              LabTasker combines powerful tools in one integrated platform to streamline your laboratory operations from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ThreeDCard className="h-full bg-background/60 backdrop-blur-md border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </ThreeDCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
                Why Choose LabTasker
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Laboratory Operations
              </h2>
              <p className="text-muted-foreground mb-8">
                LabTasker helps research facilities of all sizes improve efficiency, ensure compliance, and accelerate scientific discovery.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Clock />, title: "Save Time", desc: "Reduce administrative overhead by up to 40%" },
                  { icon: <Shield />, title: "Ensure Compliance", desc: "Meet regulatory requirements with built-in tools" },
                  { icon: <Users />, title: "Improve Collaboration", desc: "Connect your entire team on one platform" },
                  { icon: <Zap />, title: "Boost Productivity", desc: "Complete more experiments with fewer resources" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md text-primary mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-[400px] lg:h-[500px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <SparklesCore
                    id="heroSparkles"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={70}
                    className="w-full h-full"
                    particleColor="#8B5CF6"
                  />
                </div>
                <GlowingStarsBackgroundCard className="w-full h-full bg-background/60 backdrop-blur-md border border-border/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                  <div className="relative w-full h-full p-4">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-background/80 backdrop-blur-sm border-b border-border/30 rounded-t-xl flex items-center px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto text-xs font-medium text-muted-foreground">
                        LabTasker Dashboard
                      </div>
                    </div>
                    <div className="pt-12 h-full">
                      {/* Top Stats Row */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[
                          { icon: <Layers className="h-3 w-3" />, label: "Tasks", value: "24", color: "text-blue-500" },
                          { icon: <FlaskConical className="h-3 w-3" />, label: "Experiments", value: "8", color: "text-green-500" },
                          { icon: <Users className="h-3 w-3" />, label: "Team", value: "12", color: "text-amber-500" },
                          { icon: <Clock className="h-3 w-3" />, label: "Hours", value: "128", color: "text-purple-500" }
                        ].map((stat, i) => (
                          <div key={i} className="bg-background/70 rounded-md border border-border/20 p-2 flex flex-col items-center justify-center">
                            <div className={`${stat.color} bg-${stat.color.split('-')[1]}-500/10 p-1 rounded-full mb-1`}>
                              {stat.icon}
                            </div>
                            <div className="text-[10px] font-medium">{stat.value}</div>
                            <div className="text-[8px] text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 h-[calc(100%-40px)]">
                        {/* Task Overview Panel - Enhanced */}
                        <div className="bg-background/40 backdrop-blur-sm rounded-lg border border-border/30 p-3 flex flex-col">
                          <div className="text-xs font-medium mb-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <Layers className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                              Task Overview
                            </div>
                            <Badge variant="outline" className="text-[8px] py-0 px-1.5 h-4 bg-primary/5 text-primary border-primary/20">
                              Today
                            </Badge>
                          </div>

                          <div className="flex-1 space-y-2 overflow-hidden">
                            {[
                              { title: "PCR Analysis", status: "In Progress", progress: 65, priority: "high" },
                              { title: "Sample Preparation", status: "Completed", progress: 100, priority: "medium" },
                              { title: "Data Analysis", status: "Pending", progress: 0, priority: "low" },
                              { title: "Report Writing", status: "In Progress", progress: 30, priority: "high" }
                            ].map((task, i) => (
                              <motion.div
                                key={i}
                                className="bg-background/70 rounded-md border border-border/20 p-2 flex flex-col"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-[10px] font-medium">{task.title}</div>
                                  <div className={`text-[8px] px-1.5 py-0.5 rounded-full ${task.status === "Completed" ? "bg-green-500/10 text-green-500" :
                                    task.status === "In Progress" ? "bg-amber-500/10 text-amber-500" :
                                      "bg-blue-500/10 text-blue-500"
                                    }`}>
                                    {task.status}
                                  </div>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${task.priority === "high" ? "bg-red-500" :
                                      task.priority === "medium" ? "bg-amber-500" :
                                        "bg-green-500"
                                      }`}
                                    style={{ width: `${task.progress}%` }}
                                  ></div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Experiments Panel - Enhanced */}
                        <div className="bg-background/40 backdrop-blur-sm rounded-lg border border-border/30 p-3 flex flex-col">
                          <div className="text-xs font-medium mb-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <FlaskConical className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                              Active Experiments
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-[8px] text-muted-foreground">Live Data</span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-2 overflow-hidden">
                            {[
                              { title: "Protein Expression", time: "2h 15m", status: "active", data: [30, 50, 60, 40, 70, 60, 75] },
                              { title: "Cell Culture", time: "18h 30m", status: "active", data: [20, 30, 40, 50, 40, 30, 35] },
                              { title: "Antibody Testing", time: "4h 45m", status: "active", data: [60, 50, 40, 45, 55, 70, 65] }
                            ].map((exp, i) => (
                              <motion.div
                                key={i}
                                className="bg-background/70 rounded-md border border-border/20 p-2 flex items-center justify-between"
                                initial={{ opacity: 0, x: 5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <div>
                                  <div className="text-[10px] font-medium mb-1">{exp.title}</div>
                                  <div className="flex items-center">
                                    <Clock className="h-2 w-2 mr-1 text-muted-foreground" />
                                    <span className="text-[8px] text-muted-foreground">{exp.time}</span>
                                  </div>
                                </div>
                                <div className="h-8 flex items-end gap-0.5">
                                  {exp.data.map((value, j) => (
                                    <div
                                      key={j}
                                      className="w-1 bg-primary/60 rounded-sm"
                                      style={{ height: `${value}%` }}
                                    ></div>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Run Your Lab
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              LabTasker combines powerful tools in one integrated platform to streamline your laboratory operations from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ThreeDCard className="h-full bg-background/60 backdrop-blur-md border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </ThreeDCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
                Why Choose LabTasker
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Laboratory Operations
              </h2>
              <p className="text-muted-foreground mb-8">
                LabTasker helps research facilities of all sizes improve efficiency, ensure compliance, and accelerate scientific discovery.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Clock />, title: "Save Time", desc: "Reduce administrative overhead by up to 40%" },
                  { icon: <Shield />, title: "Ensure Compliance", desc: "Meet regulatory requirements with built-in tools" },
                  { icon: <Users />, title: "Improve Collaboration", desc: "Connect your entire team on one platform" },
                  { icon: <Zap />, title: "Boost Productivity", desc: "Complete more experiments with fewer resources" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md text-primary mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow" asChild>
                <Link href="/admin-dashboard">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur-xl opacity-30"></div>
                <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
                  <div className="p-1">
                    <div className="bg-muted/50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Rocket className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Performance Metrics</h3>
                            <p className="text-xs text-muted-foreground">Before vs After LabTasker</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          <Star className="h-3 w-3 mr-1" />
                          ROI Analysis
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        {[
                          { label: "Task Completion Time", before: "30%", after: "70%" },
                          { label: "Documentation Accuracy", before: "45%", after: "95%" },
                          { label: "Team Collaboration", before: "40%", after: "85%" },
                          { label: "Compliance Success Rate", before: "60%", after: "98%" },
                          { label: "Resource Utilization", before: "50%", after: "90%" }
                        ].map((metric, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{metric.label}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">{metric.before}</span>
                                <ArrowRight className="h-3 w-3 text-primary" />
                                <span className="font-medium text-primary">{metric.after}</span>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                                style={{ width: metric.after }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-border/30 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Average Improvement:</span>
                          <span className="font-medium text-primary ml-2">+120%</span>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified Results
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Leading Laboratories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about how LabTasker has transformed their laboratory operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <HoverGlowCard className="h-full bg-background/60 backdrop-blur-md border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-primary">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 inline-block mr-0.5 fill-primary" />
                      ))}
                    </div>
                    <p className="text-foreground italic mb-6 flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </HoverGlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
              Pricing Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose the Right Plan for Your Lab
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing options to fit laboratories of all sizes, from academic research to enterprise facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$49",
                description: "Perfect for small research teams",
                features: [
                  "Up to 5 team members",
                  "Basic task management",
                  "Experiment tracking",
                  "Email support",
                  "1GB storage"
                ],
                popular: false,
                buttonText: "Get Started"
              },
              {
                name: "Professional",
                price: "$99",
                description: "Ideal for growing laboratories",
                features: [
                  "Up to 20 team members",
                  "Advanced task management",
                  "Experiment tracking & analytics",
                  "Compliance tools",
                  "Priority support",
                  "10GB storage",
                  "API access"
                ],
                popular: true,
                buttonText: "Try Free for 14 Days"
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large research facilities",
                features: [
                  "Unlimited team members",
                  "Complete feature access",
                  "Advanced analytics & reporting",
                  "Custom integrations",
                  "Dedicated support manager",
                  "Unlimited storage",
                  "On-premise deployment option"
                ],
                popular: false,
                buttonText: "Contact Sales"
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative",
                  plan.popular && "mt-[-20px] mb-[-20px]"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-primary text-primary-foreground border-primary py-1 px-3">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <ThreeDCard className={cn(
                  "h-full bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden",
                  plan.popular && "border-primary/50 shadow-lg shadow-primary/10"
                )}>
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline mb-2">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.price !== "Custom" && <span className="text-muted-foreground ml-1">/month</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <div className="flex-1 mb-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className={cn(
                        "w-full shadow-md hover:shadow-lg transition-shadow",
                        plan.popular ? "" : "bg-background text-foreground border border-border hover:bg-muted"
                      )}
                      asChild
                    >
                      <Link href="/admin-dashboard">
                        {plan.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 opacity-80" />

        <div className="container mx-auto px-4 relative z-10">
          <GlowingStarsBackgroundCard className="max-w-5xl mx-auto p-8 md:p-14 bg-background/70 backdrop-blur-lg border border-border/50 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.15)]">
            <div className="relative flex flex-col items-center justify-center">
              <div className="absolute inset-0">
                <SparklesCore
                  id="ctaSparkles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.6}
                  particleDensity={50}
                  className="w-full h-full"
                  particleColor="#8B5CF6"
                />
              </div>

              <div className="relative z-10 text-center w-full p-6 md:p-8">
                <Badge className="inline-flex mb-8 bg-primary/15 text-primary border-primary/25 py-2 px-6 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                  Limited Time Offer
                </Badge>

                <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
                  Ready to Transform Your Laboratory?
                </h2>

                <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                  Join over 500+ laboratories already using LabTasker to streamline operations,
                  improve collaboration, and accelerate scientific discovery.
                </p>

                {/* Testimonial carousel */}
                <div className="mb-10 bg-white/50 backdrop-blur-sm p-6 rounded-lg max-w-3xl mx-auto">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold">
                        RC
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Dr. Rachel Chen</p>
                        <p className="text-sm text-muted-foreground">Research Director, BioTech Labs</p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array(5).fill(null).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm italic text-left">
                    &ldquo;LabTasker has revolutionized how our team collaborates. We&apos;ve seen a 40% increase in
                    experiment throughput and significant reduction in documentation errors.&rdquo;
                  </p>
                </div>

                {/* Stats section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    { value: "95%", label: "Reduction in manual data entry" },
                    { value: "3.5x", label: "Faster experiment documentation" },
                    { value: "30+", label: "Integrations with lab equipment" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/40 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center">
                      <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground text-center whitespace-nowrap">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" asChild>
                    <Link href="/admin-dashboard" className="flex items-center justify-center">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 shadow-md" asChild>
                    <Link href="/demo" className="flex items-center justify-center">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Watch Demo
                    </Link>
                  </Button>
                </div>

              </div>
            </div>
          </GlowingStarsBackgroundCard>

          {/* Quick feature highlight */}
          <div className="max-w-5xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "HIPAA Compliant" },
              { icon: Cloud, label: "Cloud-Based" },
              { icon: MoveRight, label: "Seamless Integration" },
              { icon: BarChart3, label: "Advanced Analytics" }
            ].map((feature, i) => (
              <div key={i} className="p-6 text-center flex flex-col items-center">
                <feature.icon className="h-8 w-8 text-primary mb-3" />
                <h4 className="text-sm font-medium">{feature.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Navigation Menu (Hidden by default) */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden"
          >
            <div className="bg-background/80 backdrop-blur-md border border-border/40 rounded-full shadow-lg p-1.5 flex items-center">
              <Link href="#features" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <Layers className="h-5 w-5" />
              </Link>
              <Link href="#benefits" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <Zap className="h-5 w-5" />
              </Link>
              <Link href="/admin-dashboard" className="p-3 bg-primary text-primary-foreground rounded-full mx-1 shadow-md">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <Link href="#testimonials" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link href="#pricing" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <Database className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all bg-background/80 backdrop-blur-md border-border/50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUp className="h-5 w-5" />
              <span className="sr-only">Back to top</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <FlaskConical className="h-8 w-8 text-white mr-2" />
                <span className="text-2xl font-bold text-white">LabTasker</span>
              </div>
              <p className="text-gray-400">
                Modern laboratory management software designed to streamline your research workflow and enhance productivity.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, url: "#" },
                  { icon: Linkedin, url: "#" },
                  { icon: Github, url: "#" },
                  { icon: Youtube, url: "#" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{social.icon.name}</span>
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Features", href: "#features" },
                  { name: "Benefits", href: "#benefits" },
                  { name: "Testimonials", href: "#testimonials" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "Contact Us", href: "#contact" }
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                {[
                  { name: "Documentation", href: "/docs" },
                  { name: "API Reference", href: "/api" },
                  { name: "Help Center", href: "/help" },
                  { name: "Blog", href: "/blog" },
                  { name: "Webinars", href: "/webinars" }
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">123 Research Park, San Francisco, CA 94107</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="mailto:hello@labtasker.com" className="text-gray-400 hover:text-white transition-colors">
                    hello@labtasker.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <a href="tel:+14155550123" className="text-gray-400 hover:text-white transition-colors">
                    +1 (415) 555-0123
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} LabTasker. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="/cookie" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Feature Comparison Table */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How LabTasker Compares
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how LabTasker stacks up against traditional lab management methods and other solutions.
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-1/4 py-4 px-6 text-left font-medium">Features</TableHead>
                  <TableHead className="w-1/4 py-4 px-6 text-center font-medium">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 p-2 rounded-full mb-2">
                        <Microscope className="h-5 w-5 text-primary" />
                      </div>
                      <span>LabTasker</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-1/4 py-4 px-6 text-center font-medium">
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-2 rounded-full mb-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span>Traditional Methods</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-1/4 py-4 px-6 text-center font-medium">
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-2 rounded-full mb-2">
                        <Database className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span>Other LIMS</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { feature: "User-friendly Interface", labtasker: true, traditional: false, others: "Limited" },
                  { feature: "Real-time Collaboration", labtasker: true, traditional: false, others: "Limited" },
                  { feature: "Experiment Tracking", labtasker: true, traditional: "Manual", others: true },
                  { feature: "Compliance Tools", labtasker: true, traditional: "Manual", others: "Limited" },
                  { feature: "Data Security", labtasker: "Advanced", traditional: "Basic", others: "Standard" },
                  { feature: "Mobile Access", labtasker: true, traditional: false, others: "Limited" },
                  { feature: "AI-powered Insights", labtasker: true, traditional: false, others: false },
                  { feature: "Implementation Time", labtasker: "Days", traditional: "Immediate", others: "Months" },
                  { feature: "Cost Efficiency", labtasker: "High", traditional: "Low", others: "Medium" },
                ].map((row, i) => (
                  <TableRow key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <TableCell className="py-4 px-6 font-medium">{row.feature}</TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      {row.labtasker === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : row.labtasker === false ? (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-primary font-medium">{row.labtasker}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      {row.traditional === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : row.traditional === false ? (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.traditional}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      {row.others === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : row.others === false ? (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{row.others}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
              Common Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to the most common questions about LabTasker and how it can help your laboratory.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "How long does it take to implement LabTasker?",
                  answer: "Most laboratories are up and running with LabTasker in just a few days. Our onboarding team will guide you through the setup process, help import your existing data, and train your team on using the platform effectively."
                },
                {
                  question: "Is LabTasker compliant with laboratory regulations?",
                  answer: "Yes, LabTasker is designed to meet various regulatory requirements including GLP, GMP, ISO 17025, and 21 CFR Part 11. Our compliance tools help you maintain proper documentation, audit trails, and data integrity."
                },
                {
                  question: "Can LabTasker integrate with our existing laboratory equipment?",
                  answer: "LabTasker offers integration capabilities with many common laboratory instruments and systems through our API. We support both direct integrations and file-based data exchange with various analytical instruments, LIMS, and ELN systems."
                },
                {
                  question: "How secure is our data with LabTasker?",
                  answer: "We take data security very seriously. LabTasker employs industry-standard encryption, regular security audits, and robust access controls. All data is backed up regularly, and we offer both cloud and on-premise deployment options to meet your security requirements."
                },
                {
                  question: "Can we customize LabTasker for our specific workflows?",
                  answer: "Absolutely! LabTasker is highly customizable to accommodate your laboratory's unique processes. You can create custom forms, workflows, report templates, and more. Our Professional and Enterprise plans also include custom field options and workflow automation."
                },
                {
                  question: "What kind of support does LabTasker provide?",
                  answer: "All LabTasker plans include email support with quick response times. Our Professional plan adds priority support with faster response times, while Enterprise customers receive dedicated support with a named account manager and 24/7 emergency assistance."
                },
                {
                  question: "Can we try LabTasker before purchasing?",
                  answer: "Yes! We offer a 14-day free trial of our Professional plan with no credit card required. You'll get full access to all features so you can thoroughly evaluate how LabTasker works for your laboratory before making a decision."
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-background/60 backdrop-blur-md border border-border/50 rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-3 text-left">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground">
                    <div className="pl-8">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions? Our team is here to help.
              </p>
              <Button variant="outline" className="shadow-md hover:shadow-lg transition-shadow" asChild>
                <Link href="#contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Add before the footer */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-10 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
            <div className="text-center mb-8">
              <Badge className="inline-flex mb-8 bg-primary/15 text-primary border-primary/25 py-2 px-6 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                Join Our Community
              </Badge>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 leading-tight">
                  Streamline Your <span className="relative">
                    <span className="relative z-10">Lab Workflow</span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -rotate-1 -z-0"></span>
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                  Automate repetitive tasks, track experiments, and collaborate with your team in real-time with our all-in-one laboratory management platform.
                </p>
              </motion.div>
            </div>

            {!isSubscribed ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  className="flex-1 h-12 text-base placeholder:text-muted-foreground/70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
                  onClick={() => {
                    if (email) setIsSubscribed(true);
                  }}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Subscribe Now
                </Button>
              </div>
            ) : (
              <div className="bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl p-6 flex items-center justify-center gap-3">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-lg font-medium">Success! Please check your inbox to confirm your subscription.</span>
              </div>
            )}

            <div className="mt-6 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Your data is secure. We respect your privacy and never share your information.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Widget */}
      <AnimatePresence>
        {showChatWidget ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-background border border-border/50 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">LabTasker Support</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setShowChatWidget(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-64 p-4 bg-muted/20 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Microscope className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm max-w-[80%]">
                    <p>Hello! 👋 How can we help you with LabTasker today?</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-primary/10 rounded-lg p-3 text-sm max-w-[80%]">
                    <p>I&apos;d like to learn more about your pricing plans.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Microscope className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm max-w-[80%]">
                    <p>I&apos;d be happy to explain our pricing plans! We offer three tiers: Starter, Professional, and Enterprise. Would you like me to go through the details of each?</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-border/30 bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  className="text-sm"
                />
                <Button size="sm" className="shrink-0">
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowChatWidget(true)}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu (Hidden by default) */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden"
          >
            <div className="bg-background/80 backdrop-blur-md border border-border/40 rounded-full shadow-lg p-1.5 flex items-center">
              <Link href="#features" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <Layers className="h-5 w-5" />
              </Link>
              <Link href="#benefits" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <Zap className="h-5 w-5" />
              </Link>
              <Link href="/admin-dashboard" className="p-3 bg-primary text-primary-foreground rounded-full mx-1 shadow-md">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <Link href="#testimonials" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link href="#pricing" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                <Database className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border/40 shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-16 border-t border-border/40 bg-gradient-to-b from-background/60 to-background/80 backdrop-blur-xl relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="bg-primary/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Microscope className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/70">
                  LabTasker
                </h2>
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                The all-in-one laboratory management platform designed to streamline operations and accelerate scientific discovery.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 hover:scale-110 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 hover:scale-110 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  <Globe className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 hover:scale-110 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Product</h3>
              <ul className="space-y-3 text-sm">
                {["Features", "Pricing", "Integrations", "Changelog", "Documentation"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Company</h3>
              <ul className="space-y-3 text-sm">
                {["About Us", "Careers", "Blog", "Press", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Legal</h3>
              <ul className="space-y-3 text-sm">
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Data Processing", "Compliance"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2 transition-all duration-300"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} LabTasker. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-6 px-6 border-r border-l border-border/30">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Cookies
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Made with</span>
                  <span className="text-primary animate-pulse">♥</span>
                  <span className="text-sm text-muted-foreground">for scientists</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}