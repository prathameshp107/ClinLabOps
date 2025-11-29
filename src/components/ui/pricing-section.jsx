"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pricingTiers = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for small labs and individual researchers.",
        features: [
            "Up to 3 team members",
            "Basic experiment tracking",
            "1GB storage",
            "Community support",
            "Standard analytics"
        ],
        notIncluded: [
            "Advanced inventory management",
            "Compliance reporting",
            "API access",
            "Dedicated support"
        ],
        buttonText: "Get Started",
        popular: false
    },
    {
        name: "Professional",
        price: "49",
        description: "Ideal for growing research teams and startups.",
        features: [
            "Up to 20 team members",
            "Advanced experiment tracking",
            "100GB storage",
            "Priority email support",
            "Advanced analytics",
            "Inventory management",
            "Compliance reporting"
        ],
        notIncluded: [
            "API access",
            "Dedicated support",
            "On-premise deployment"
        ],
        buttonText: "Start Free Trial",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large institutions requiring maximum control.",
        features: [
            "Unlimited team members",
            "Unlimited storage",
            "24/7 Phone & Email support",
            "Custom analytics",
            "Full API access",
            "On-premise deployment",
            "SSO & Advanced Security",
            "Dedicated account manager"
        ],
        notIncluded: [],
        buttonText: "Contact Sales",
        popular: false
    }
];

export function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
                    >
                        Simple, transparent pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-lg mb-8"
                    >
                        Choose the plan that best fits your laboratory's needs. No hidden fees.
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-white" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-14 h-7 rounded-full bg-white/10 border border-white/10 transition-colors hover:bg-white/20 focus:outline-none"
                        >
                            <motion.div
                                animate={{ x: isAnnual ? 28 : 2 }}
                                className="absolute top-1 left-0 w-5 h-5 rounded-full bg-primary shadow-lg"
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-white" : "text-muted-foreground")}>
                            Yearly <span className="text-primary text-xs ml-1 font-bold">(Save 20%)</span>
                        </span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {pricingTiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className={cn(
                                "relative flex flex-col p-8 rounded-2xl border transition-all duration-300",
                                tier.popular
                                    ? "bg-white/10 border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10"
                                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <p className="text-muted-foreground text-sm h-10">{tier.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">
                                        {tier.price === "Custom" ? "Custom" : `$${isAnnual ? tier.price : Math.round(parseInt(tier.price) * 1.2)}`}
                                    </span>
                                    {tier.price !== "Custom" && (
                                        <span className="text-muted-foreground">/month</span>
                                    )}
                                </div>
                                {tier.price !== "Custom" && isAnnual && (
                                    <p className="text-xs text-primary mt-2">Billed annually</p>
                                )}
                            </div>

                            <div className="flex-1 mb-8 space-y-4">
                                {tier.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 p-0.5 rounded-full bg-primary/20 text-primary">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </div>
                                ))}
                                {tier.notIncluded.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3 opacity-50">
                                        <div className="mt-1 p-0.5 rounded-full bg-white/10 text-muted-foreground">
                                            <X className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={tier.popular ? "default" : "outline"}
                                className={cn(
                                    "w-full py-6 text-base font-semibold transition-all",
                                    tier.popular ? "shadow-lg shadow-primary/25 hover:shadow-primary/40" : "hover:bg-white/10"
                                )}
                            >
                                {tier.buttonText}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
