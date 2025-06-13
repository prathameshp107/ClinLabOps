import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowLeft, Search, RefreshCw, Home, Clock, Sparkles } from 'lucide-react';

const ModernBackButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
        >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
                <ArrowLeft
                    className={`h-5 w-5 transition-transform duration-300 ${isHovered ? '-translate-x-1' : ''}`}
                />
                <span>Go Back</span>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
        </button>
    );
};

const FloatingIcon = ({ icon: Icon, delay = 0, className = "" }) => {
    return (
        <div
            className={`absolute opacity-10 animate-pulse ${className}`}
            style={{
                animationDelay: `${delay}s`,
                animationDuration: '3s'
            }}
        >
            <Icon className="h-8 w-8 text-gray-400" />
        </div>
    );
};

const TaskNotFound = () => {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setShowSuggestions(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const suggestions = [
        "Check your recent tasks",
        "Browse all tasks",
        "Create a new task",
        "Contact support"
    ];

    const handleBackClick = () => {
        window.location.href = '/tasks';
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search for:', searchQuery);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <FloatingIcon icon={Search} delay={0} className="top-20 left-20" />
                <FloatingIcon icon={Clock} delay={1} className="top-40 right-32" />
                <FloatingIcon icon={Sparkles} delay={2} className="bottom-40 left-16" />
                <FloatingIcon icon={RefreshCw} delay={1.5} className="bottom-20 right-20" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                {/* Main Card */}
                <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 max-w-2xl w-full text-center">

                        {/* Animated Icon */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-6 inline-block">
                                <AlertTriangle className="h-16 w-16 text-white animate-bounce" />
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                            Task Not Found
                        </h1>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Oops! The task you're looking for seems to have vanished into the digital void.
                            Don't worry, we'll help you find your way back.
                        </p>



                        <div className="flex flex-wrap gap-4 justify-center mb-8">
                            <button className="flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </button>
                            <button className="flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                                <RefreshCw className="h-5 w-5" />
                                <span>Refresh</span>
                            </button>
                        </div>

                        {/* Back Button */}
                        <ModernBackButton onClick={handleBackClick} />
                    </div>
                </div>

            </div>


        </div>
    );
};

export { TaskNotFound };