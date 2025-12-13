'use client';

import { useState, useEffect } from 'react';
import { AnimalManagement } from '@/components/animal-management/AnimalManagement';
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";
import { Home, PawPrint, Users, FlaskConical, Heart, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnimalsPage() {
    return (
        <DashboardLayout>
            <div className="relative min-h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
                    <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-emerald-500/5 rounded-full blur-[80px] animate-pulse delay-700" />
                </div>

                <div className="relative z-10 px-6 py-8 max-w-[1600px] mx-auto">
                    {/* Breadcrumb Navigation */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
                            <Home className="h-3.5 w-3.5" />
                            <span className="text-gray-300">/</span>
                            <PawPrint className="h-3.5 w-3.5" />
                            <span className="font-medium text-foreground">Animal Management</span>
                        </div>
                    </motion.nav>

                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                                        <PawPrint className="h-6 w-6 text-white" />
                                    </div>
                                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Animal Management
                                    </h1>
                                </div>
                                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                    Streamline your laboratory animal research with comprehensive tracking, health monitoring, and breeding management tools.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-sm font-semibold">Live System Active</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Total Animals', value: '24', icon: Users, color: 'blue', trend: '+12% this month' },
                                { label: 'Active Experiments', value: '8', icon: FlaskConical, color: 'emerald', trend: '2 new started' },
                                { label: 'Health Checks Due', value: '3', icon: Heart, color: 'rose', trend: 'Action required' },
                                { label: 'Active Breeding', value: '5', icon: MapPin, color: 'violet', trend: 'On schedule' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 * index }}
                                    className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 p-5 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                                >
                                    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity duration-300 text-${stat.color}-500`}>
                                        <stat.icon className="w-24 h-24 -mr-4 -mt-4 transform rotate-12" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className={`inline-flex p-2.5 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                                                <span className="text-xs font-medium text-muted-foreground/80">{stat.trend}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative rounded-3xl overflow-hidden bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl shadow-gray-200/50 dark:shadow-black/50"
                    >
                        <div className="p-6 sm:p-8">
                            <AnimalManagement />
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}