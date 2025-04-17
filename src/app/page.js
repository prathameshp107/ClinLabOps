"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  ExternalLink,
  FileText,
  FlaskConical,
  Github,
  Globe,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Lock,
  MessageSquare,
  Microscope,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap
} from "lucide-react";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { HoverGlowCard, GlowingStarsBackgroundCard } from "@/components/ui/aceternity/cards";
import { ThreeDCard } from "@/components/ui/aceternity/three-d-card";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <Microscope className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              LabTasker
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Benefits
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                Log In
              </Link>
            </Button>
            <Button size="sm" className="shadow-md hover:shadow-lg transition-shadow" asChild>
              <Link href="/admin-dashboard">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
                Next-Generation Lab Management
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Streamline Your Laboratory Operations
                </span>
              </h1>
              <div className="mb-8 text-lg text-muted-foreground max-w-xl">
                <TextGenerateEffect words="LabTasker is the all-in-one platform for modern laboratories. Manage tasks, track experiments, ensure compliance, and boost productivity with our intuitive tools." />
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow group" asChild>
                  <Link href="/admin-dashboard">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow" asChild>
                  <Link href="#features">
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">500+</span> labs are already using LabTasker
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
              transition={{ duration: 0.8, delay: 0.4 }}
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
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
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
                    <p className="text-foreground italic mb-6 flex-1">"{testimonial.quote}"</p>
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
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <GlowingStarsBackgroundCard className="max-w-5xl mx-auto p-8 md:p-12 bg-background/60 backdrop-blur-md border border-border/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesCore
                  id="ctaSparkles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={40}
                  className="w-full h-full"
                  particleColor="#8B5CF6"
                />
              </div>
              <div className="relative z-10 text-center">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-4 text-sm">
                  Get Started Today
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Laboratory?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Join hundreds of laboratories already using LabTasker to streamline their operations, improve collaboration, and accelerate scientific discovery.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow" asChild>
                    <Link href="/admin-dashboard">
                      Get Started Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </GlowingStarsBackgroundCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-background/60 backdrop-blur-md relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  LabTasker
                </h2>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                The all-in-one laboratory management platform designed to streamline operations and accelerate scientific discovery.
              </p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  <Globe className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Data Processing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} LabTasker. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs text-muted-foreground">Made with</span>
                <span className="text-primary">♥</span>
                <span className="text-xs text-muted-foreground">for scientists</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
    </div>
  );
}