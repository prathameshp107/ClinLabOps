"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { motion } from "framer-motion";
import { FlaskConical, ClipboardList, Users, FileText, CheckCircle2, BarChart3, Settings } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
            {/* Hero Section */}
            <div className="h-[40rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
                <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
                    LabTasker
                </h1>
                <div className="w-[40rem] h-40 relative">
                    {/* Gradients */}
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

                    {/* Core component */}
                    <SparklesCore
                        background="transparent"
                        minSize={0.4}
                        maxSize={1}
                        particleDensity={1200}
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />

                    {/* Radial Gradient to prevent sharp edges */}
                    <div className="absolute inset-0 w-full h-full bg-black/[0.96] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                </div>
                <p className="text-neutral-300 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
                    The ultimate platform for managing laboratory experiments, projects, and tasks with precision and ease.
                </p>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">
                    Key Features
                </h2>
                <BentoGrid className="max-w-4xl mx-auto">
                    {features.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>

            {/* Usage Section */}
            <div className="max-w-4xl mx-auto px-4 py-20">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">
                    How It Works
                </h2>
                <TracingBeam className="px-6">
                    <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                        {usageSteps.map((item, index) => (
                            <div key={`content-${index}`} className="mb-10">
                                <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4 border border-white/20">
                                    {item.badge}
                                </h2>
                                <p className="text-xl font-bold text-white mb-4">
                                    {item.title}
                                </p>
                                <div className="text-sm  prose prose-sm dark:prose-invert text-neutral-300">
                                    {item.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </TracingBeam>
            </div>
        </div>
    );
}

const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10"></div>
);

const features = [
    {
        title: "Experiment Management",
        description: "Track and manage complex laboratory experiments with detailed protocols.",
        header: <Skeleton />,
        icon: <FlaskConical className="h-4 w-4 text-neutral-300" />,
    },
    {
        title: "Project Tracking",
        description: "Keep all your research projects organized in one central dashboard.",
        header: <Skeleton />,
        icon: <ClipboardList className="h-4 w-4 text-neutral-300" />,
    },
    {
        title: "Team Collaboration",
        description: "Assign tasks to team members and monitor progress in real-time.",
        header: <Skeleton />,
        icon: <Users className="h-4 w-4 text-neutral-300" />,
    },
    {
        title: "Detailed Reporting",
        description: "Generate comprehensive reports for your findings and project status.",
        header: <Skeleton />,
        icon: <FileText className="h-4 w-4 text-neutral-300" />,
    },
    {
        title: "Task Scheduling",
        description: "Efficiently schedule tasks and manage deadlines.",
        header: <Skeleton />,
        icon: <CheckCircle2 className="h-4 w-4 text-neutral-300" />,
    },
];

const usageSteps = [
    {
        title: "Create a Project",
        description: (
            <>
                <p>
                    Start by creating a new project in the dashboard. Define the scope, objectives, and team members involved.
                    This acts as the container for all your experiments and tasks.
                </p>
            </>
        ),
        badge: "Step 1",
    },
    {
        title: "Define Experiments",
        description: (
            <>
                <p>
                    Within your project, set up individual experiments. Document protocols, required materials, and expected outcomes.
                    Use our templates to get started quickly.
                </p>
            </>
        ),
        badge: "Step 2",
    },
    {
        title: "Assign Tasks",
        description: (
            <>
                <p>
                    Break down experiments into actionable tasks. Assign these to specific team members with due dates and priorities.
                    Track the status of each task from 'To Do' to 'Completed'.
                </p>
            </>
        ),
        badge: "Step 3",
    },
    {
        title: "Monitor & Report",
        description: (
            <>
                <p>
                    Use the dashboard to get a high-level view of project progress. Generate reports to share findings with stakeholders
                    or for compliance purposes.
                </p>
            </>
        ),
        badge: "Step 4",
    },
];
