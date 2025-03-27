"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Icons
import {
  Check,
  X,
  Zap,
  Sparkles,
  Building,
  Users,
  FileText,
  BarChart,
  Clock,
  Database,
  Shield,
  Headphones,
  Rocket,
  Star,
  ArrowRight,
  HelpCircle,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  CheckCircle2,
  Info,
} from "lucide-react"

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  
  // Ensure theme component only renders client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pricing data
  const pricingPlans = [
    {
      name: "Basic",
      description: "Essential features for small labs and startups",
      monthlyPrice: 49,
      yearlyPrice: 470,
      features: [
        { name: "Up to 5 team members", included: true, icon: <Users className="h-4 w-4" /> },
        { name: "Basic sample management", included: true, icon: <Database className="h-4 w-4" /> },
        { name: "Standard reports", included: true, icon: <FileText className="h-4 w-4" /> },
        { name: "Email support", included: true, icon: <Headphones className="h-4 w-4" /> },
        { name: "Basic analytics", included: true, icon: <BarChart className="h-4 w-4" /> },
        { name: "Advanced security", included: false, icon: <Shield className="h-4 w-4" /> },
        { name: "Custom workflows", included: false, icon: <Rocket className="h-4 w-4" /> },
        { name: "Priority support", included: false, icon: <Zap className="h-4 w-4" /> },
      ],
      cta: "Get Started",
      popular: false,
      icon: <FileText className="h-6 w-6" />,
      color: "blue",
      badge: null,
    },
    {
      name: "Pro",
      description: "Perfect for growing labs and research teams",
      monthlyPrice: 99,
      yearlyPrice: 950,
      features: [
        { name: "Up to 20 team members", included: true, icon: <Users className="h-4 w-4" /> },
        { name: "Advanced sample management", included: true, icon: <Database className="h-4 w-4" /> },
        { name: "Custom reports", included: true, icon: <FileText className="h-4 w-4" /> },
        { name: "Priority email support", included: true, icon: <Headphones className="h-4 w-4" /> },
        { name: "Advanced analytics", included: true, icon: <BarChart className="h-4 w-4" /> },
        { name: "Enhanced security", included: true, icon: <Shield className="h-4 w-4" /> },
        { name: "Custom workflows", included: true, icon: <Rocket className="h-4 w-4" /> },
        { name: "24/7 phone support", included: false, icon: <Zap className="h-4 w-4" /> },
      ],
      cta: "Get Started",
      popular: true,
      icon: <Sparkles className="h-6 w-6" />,
      color: "purple",
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      description: "Advanced features for large organizations",
      monthlyPrice: 249,
      yearlyPrice: 2390,
      features: [
        { name: "Unlimited team members", included: true, icon: <Users className="h-4 w-4" /> },
        { name: "Enterprise sample management", included: true, icon: <Database className="h-4 w-4" /> },
        { name: "Advanced custom reports", included: true, icon: <FileText className="h-4 w-4" /> },
        { name: "24/7 dedicated support", included: true, icon: <Headphones className="h-4 w-4" /> },
        { name: "Enterprise analytics", included: true, icon: <BarChart className="h-4 w-4" /> },
        { name: "Advanced security & compliance", included: true, icon: <Shield className="h-4 w-4" /> },
        { name: "Custom integrations", included: true, icon: <Rocket className="h-4 w-4" /> },
        { name: "Dedicated account manager", included: true, icon: <Zap className="h-4 w-4" /> },
      ],
      cta: "Contact Sales",
      popular: false,
      icon: <Building className="h-6 w-6" />,
      color: "green",
      badge: "Enterprise",
    },
  ]

  // Calculate savings percentage
  const calculateSavings = (monthly, yearly) => {
    const monthlyCost = monthly * 12
    const yearlyCost = yearly
    const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100
    return Math.round(savings)
  }

  // FAQ data
  const faqItems = [
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will be prorated, so you'll only pay for the time you've used each plan."
    },
    {
      question: "What happens after my trial ends?",
      answer: "After your 14-day trial, you'll be automatically subscribed to the plan you selected. You can cancel anytime before the trial ends without being charged."
    },
    {
      question: "Do you offer discounts for academic institutions?",
      answer: "Yes, we offer special pricing for academic and research institutions. Please contact our sales team for more information about our academic licensing program."
    },
    {
      question: "How secure is my data?",
      answer: "We take data security seriously. All plans include basic security features, with advanced security and compliance options available in higher-tier plans. We use industry-standard encryption and follow best practices for data protection."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee for all our plans. If you're not completely satisfied with our service, you can request a full refund within the first 30 days of your subscription."
    }
  ]

  // Theme toggle component
  const ThemeToggle = () => {
    if (!mounted) return null
    
    return (
      <div className="fixed top-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
                className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border-muted/40"
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle theme: {theme === 'dark' ? 'Light' : theme === 'light' ? 'System' : 'Dark'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  return (
    <div className="relative">
      <ThemeToggle />
      
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        
        <div className="container max-w-7xl mx-auto px-4 py-24 relative">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20 text-primary">
              Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your lab's needs. All plans include a 14-day free trial with no credit card required.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center justify-center gap-4 mb-8 p-1 rounded-full bg-muted/50 backdrop-blur-sm">
              <Label 
                htmlFor="billing-toggle" 
                className={cn(
                  "px-4 py-2 rounded-full cursor-pointer transition-all duration-200",
                  billingCycle === "monthly" ? "bg-background shadow-sm text-foreground font-medium" : "text-muted-foreground"
                )}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </Label>
              <div className="relative">
                <Switch
                  id="billing-toggle"
                  checked={billingCycle === "yearly"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                  className="data-[state=checked]:bg-primary"
                />
                {billingCycle === "yearly" && (
                  <Badge className="absolute -top-8 -right-12 bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Save up to 20%
                  </Badge>
                )}
              </div>
              <Label 
                htmlFor="billing-toggle" 
                className={cn(
                  "px-4 py-2 rounded-full cursor-pointer transition-all duration-200",
                  billingCycle === "yearly" ? "bg-background shadow-sm text-foreground font-medium" : "text-muted-foreground"
                )}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
              </Label>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex"
              >
                <Card className={cn(
                  "flex flex-col w-full border border-muted/60 bg-background/60 backdrop-blur-lg hover:shadow-xl transition-all duration-300",
                  plan.popular && "border-primary/50 shadow-md relative scale-105 z-10"
                )}>
                  {plan.badge && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <Badge className={cn(
                        "px-4 py-1",
                        plan.popular 
                          ? "bg-primary hover:bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Star className="mr-1 h-3.5 w-3.5" />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={cn(
                    "pb-8 pt-6",
                    plan.popular && "pt-8"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "p-2 rounded-full",
                        plan.color === "blue" && "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                        plan.color === "purple" && "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                        plan.color === "green" && "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                      )}>
                        {plan.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-8">
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold">
                          ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}% with annual billing
                        </p>
                      )}
                    </div>
                    
                    <Separator className="mb-6" />
                    
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={cn(
                            "mt-0.5 rounded-full p-1",
                            feature.included 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {feature.included ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {feature.icon}
                            <span className={cn(
                              "text-sm",
                              !feature.included && "text-muted-foreground"
                            )}>
                              {feature.name}
                            </span>
                            {feature.info && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs max-w-xs">{feature.info}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={cn(
                        "w-full gap-2 py-6",
                        plan.popular 
                          ? "bg-primary hover:bg-primary/90" 
                          : plan.name === "Enterprise" 
                            ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800" 
                            : "bg-primary/90 hover:bg-primary"
                      )}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison Section */}
      <div className="py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Compare Plan Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See which plan is right for your lab with our detailed feature comparison
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-medium">Feature</th>
                  {pricingPlans.map(plan => (
                    <th key={plan.name} className="text-center py-4 px-6 font-medium">
                      <div className="flex flex-col items-center">
                        <span>{plan.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}/{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Team Members</td>
                  <td className="text-center py-4 px-6">Up to 5</td>
                  <td className="text-center py-4 px-6">Up to 20</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Sample Management</td>
                  <td className="text-center py-4 px-6">Basic</td>
                  <td className="text-center py-4 px-6">Advanced</td>
                  <td className="text-center py-4 px-6">Enterprise</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Reports</td>
                  <td className="text-center py-4 px-6">Standard</td>
                  <td className="text-center py-4 px-6">Custom</td>
                  <td className="text-center py-4 px-6">Advanced Custom</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Support</td>
                  <td className="text-center py-4 px-6">Email</td>
                  <td className="text-center py-4 px-6">Priority Email</td>
                  <td className="text-center py-4 px-6">24/7 Dedicated</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Analytics</td>
                  <td className="text-center py-4 px-6">Basic</td>
                  <td className="text-center py-4 px-6">Advanced</td>
                  <td className="text-center py-4 px-6">Enterprise</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Security</td>
                  <td className="text-center py-4 px-6">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="h-5 w-5 mx-auto text-green-600 dark:text-green-400" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="h-5 w-5 mx-auto text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Custom Workflows</td>
                  <td className="text-center py-4 px-6">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="h-5 w-5 mx-auto text-green-600 dark:text-green-400" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="h-5 w-5 mx-auto text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Dedicated Account Manager</td>
                  <td className="text-center py-4 px-6">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  </td>
                  <td className="text-center py-4 px-6">
                    <Check className="h-5 w-5 mx-auto text-green-600 dark:text-green-400" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20 text-primary">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Trusted by Labs Worldwide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about LabTasker
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "LabTasker has transformed how we manage our research projects. The interface is intuitive and the support team is exceptional.",
                author: "Dr. Sarah Johnson",
                role: "Research Director, BioTech Labs",
                avatar: "SJ"
              },
              {
                quote: "We've increased our lab efficiency by 40% since implementing LabTasker. The custom workflows are a game-changer for our team.",
                author: "Michael Rodriguez",
                role: "Lab Manager, Clinical Research Institute",
                avatar: "MR"
              },
              {
                quote: "The enterprise features have allowed us to scale our operations while maintaining compliance with industry regulations.",
                author: "Dr. Emily Chen",
                role: "CEO, Pharmaceutical Research Co.",
                avatar: "EC"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border border-muted/60 bg-background/60 backdrop-blur-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col h-full">
                      <div className="mb-4 text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="inline-block h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-lg mb-6 flex-grow">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center font-medium mr-3">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20 text-primary">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our pricing and features
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
            <CardContent className="pt-12 pb-10 px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20 text-primary">
                  Get Started Today
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Ready to transform your lab operations?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Our team is here to help you find the perfect plan for your lab's needs. 
                  Start your 14-day free trial today, no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="default" className="gap-2">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Headphones className="mr-2 h-5 w-5" />
                    Talk to Sales
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  No credit card required. Cancel anytime.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PricingPage