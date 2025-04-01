"use client";

import { motion } from "framer-motion";
import { FlaskConical, Users } from "lucide-react";
import { BackgroundBeamsClient } from "@/components/ui/background-beams-client";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with animation - Increased size and improved animation */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary-foreground/20">
        <motion.div
          key="left-panel-main"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12"
        >
          <motion.div
            key="left-panel-content"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight">
              Welcome to LabTasker
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline your laboratory workflows, manage experiments, and collaborate with your team in one powerful platform.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <motion.div
                key="feature-experiment"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl"
              >
                <div className="rounded-full bg-white/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <FlaskConical className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Experiment Tracking</h3>
                <p className="text-white/80">Track experiments from conception to completion with detailed logs and results.</p>
              </motion.div>
              
              <motion.div
                key="feature-collaboration"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl"
              >
                <div className="rounded-full bg-white/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
                <p className="text-white/80">Work seamlessly with your team members on projects and tasks.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        <div className="absolute inset-0 z-0">
          <BackgroundBeamsClient className="z-0" />
        </div>
      </div>
      
      {/* Right side with form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 p-8 sm:p-12 flex items-center justify-center">
        {/* ... existing form code ... */}
      </div>
    </div>
  );
}