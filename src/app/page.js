"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { ThreeDCard } from "@/components/ui/aceternity/three-d-card";
import { HeroTypewriter } from "@/components/ui/hero-typewriter";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { PricingSection } from "@/components/ui/pricing-section";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  FlaskConical,
  LayoutDashboard,
  Shield,
  Zap,
  Users,
  Database,
  FileText,
  Lightbulb,
  PlayCircle,
  Rocket,
  Globe,
  Lock,
  UserPlus,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6 text-blue-400" />,
      title: "Intuitive Dashboard",
      description: "Get a bird's-eye view of your entire lab's operations with real-time data visualization."
    },
    {
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      title: "Task Management",
      description: "Assign, track, and complete laboratory tasks efficiently with our Kanban-style boards."
    },
    {
      icon: <FlaskConical className="h-6 w-6 text-emerald-400" />,
      title: "Experiment Tracking",
      description: "Document every step of your research with detailed logs and automated version control."
    },
    {
      icon: <Users className="h-6 w-6 text-pink-400" />,
      title: "Team Collaboration",
      description: "Foster innovation with seamless communication tools built directly into your workflow."
    },
    {
      icon: <Database className="h-6 w-6 text-amber-400" />,
      title: "Secure Data",
      description: "Keep your sensitive research data safe with enterprise-grade encryption and backups."
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-400" />,
      title: "Compliance Ready",
      description: "Stay audit-ready with automated compliance checks and report generation."
    }
  ];

  const testimonials = [
    {
      text: "LabTasker has completely transformed how we manage our research projects. The intuitive interface and powerful features have saved us countless hours every week.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      name: "Dr. Sarah Chen",
      role: "Principal Investigator",
    },
    {
      text: "The experiment tracking feature is a game-changer. We can now easily reproduce results and maintain perfect documentation for regulatory compliance.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      name: "Michael Rodriguez",
      role: "Lab Manager",
    },
    {
      text: "As a team of 15 researchers, coordination was our biggest challenge. LabTasker's collaboration tools have made us 3x more productive.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      name: "Dr. Emily Watson",
      role: "Research Director",
    },
    {
      text: "The inventory management system alone has paid for itself. No more lost samples or expired reagents. Everything is tracked automatically.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      name: "James Park",
      role: "Operations Manager",
    },
    {
      text: "We switched from three different tools to just LabTasker. The integration and automation features have streamlined our entire workflow.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      name: "Dr. Lisa Thompson",
      role: "Senior Scientist",
    },
    {
      text: "The compliance features are outstanding. We passed our last audit with flying colors thanks to LabTasker's automated documentation.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      name: "Robert Kim",
      role: "Quality Assurance Lead",
    },
    {
      text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction with the platform.",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
      name: "Dr. Amanda Foster",
      role: "Customer Support Lead",
    },
    {
      text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient in our daily operations.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      name: "David Martinez",
      role: "Project Manager",
    },
    {
      text: "Using LabTasker, our lab's productivity and research output significantly improved, boosting our overall performance metrics.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      name: "Dr. Jennifer Lee",
      role: "Research Coordinator",
    },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40 py-3" : "bg-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
              <FlaskConical className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              LabTasker
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105">
              Get Started
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-4 md:hidden">
          <nav className="flex flex-col gap-6 text-lg">
            {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-primary"
              >
                {item}
              </Link>
            ))}
            <div className="h-px bg-border/50 my-2" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-foreground/80">
              Log in
            </Link>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Get Started</Button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <BackgroundBeams className="opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            v2.0 is now live
            <ChevronRight className="h-3 w-3" />
          </motion.div>

          <HeroTypewriter />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
          >
            The modern operating system for laboratories. Manage experiments, inventory, and teams in one unified, intelligent platform designed for breakthrough discoveries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 text-base transition-all hover:scale-105">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-primary/20 hover:bg-primary/10 text-base backdrop-blur-sm transition-all hover:scale-105">
              <PlayCircle className="mr-2 h-4 w-4" /> Watch Demo
            </Button>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-6xl"
          >
            <div className="relative rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm shadow-2xl shadow-primary/10">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
              <div className="rounded-lg overflow-hidden bg-background/50 border border-white/5 aspect-[16/9] relative">
                {/* Abstract UI Representation */}
                <div className="absolute inset-0 flex items-center justify-center bg-grid-white/[0.02]">
                  <div className="w-full h-full p-8 grid grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-2 hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                      <div className="h-8 w-24 bg-white/10 rounded-md animate-pulse" />
                      <div className="space-y-2 mt-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-8 w-full bg-white/5 rounded-md" />
                        ))}
                      </div>
                    </div>
                    {/* Main Content */}
                    <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-48 bg-white/10 rounded-md" />
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-white/10 rounded-full" />
                          <div className="h-8 w-8 bg-white/10 rounded-full" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="h-4 w-12 bg-white/10 rounded mb-2" />
                            <div className="h-8 w-24 bg-white/10 rounded mb-4" />
                            <div className="h-2 w-full bg-white/5 rounded" />
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-6">
                        <div className="h-full w-full flex items-end justify-between gap-2">
                          {[40, 60, 45, 70, 50, 80, 65, 90, 75, 60, 85, 95].map((h, i) => (
                            <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                              <div className="absolute inset-x-0 bottom-0 bg-primary/50 h-full rounded-t-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -left-12 top-1/4 p-4 bg-background/80 backdrop-blur-md rounded-xl border border-white/10 shadow-xl hidden lg:block animate-bounceIn" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Experiment Completed</div>
                  <div className="text-xs text-muted-foreground">PCR Analysis #402</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-1/3 p-4 bg-background/80 backdrop-blur-md rounded-xl border border-white/10 shadow-xl hidden lg:block animate-bounceIn" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-zinc-800" />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-medium">Team Active</div>
                  <div className="text-xs text-muted-foreground">5 researchers online</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Everything you need to run a modern lab
            </h2>
            <p className="text-muted-foreground text-lg">
              Replace fragmented tools with a single, powerful operating system designed for scientific productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <ThreeDCard key={index} className="h-full">
                <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-background my-20 relative">
        <div className="container z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border py-1 px-4 rounded-lg">Testimonials</div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
              What our users say
            </h2>
            <p className="text-center mt-5 opacity-75">
              See what our customers have to say about us.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Ready to transform your laboratory?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join leading research institutions and biotech companies using LabTasker to accelerate their discoveries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black hover:bg-white/90 font-semibold text-lg transition-all hover:scale-105">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-white/20 hover:bg-white/10 text-white text-lg transition-all hover:scale-105">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">LabTasker</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering scientists to focus on what matters most: discovery.
              </p>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "Changelog"] },
              { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookie Policy", "Acceptable Use"] }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 LabTasker Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
