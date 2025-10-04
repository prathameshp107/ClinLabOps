'use client';

import { useState, useEffect } from 'react';
import { AnimalManagement } from '@/components/animal-management/AnimalManagement';
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";
import { Home, PawPrint, Users, FlaskConical, Heart, MapPin } from 'lucide-react';

export default function AnimalsPage() {
    return (
        <DashboardLayout>
            <div className="w-full px-4 py-6">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                    <Home className="h-4 w-4" />
                    <span>/</span>
                    <PawPrint className="h-4 w-4" />
                    <span>Animal Management</span>
                </nav>

                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Animal Management
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage laboratory animals with comprehensive CRUD operations, health tracking, and breeding management
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                Live System
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Animals</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <FlaskConical className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Experiments</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">8</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Health Checks Due</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">3</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Breeding</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 w-full">
                    <AnimalManagement />
                </div>
            </div>
        </DashboardLayout>
    );
}