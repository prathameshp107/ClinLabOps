"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen w-full bg-neutral-950 relative flex items-center justify-center antialiased overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 w-full h-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

            <div className="container mx-auto px-4 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Contact Info */}
                        <div className="p-10 bg-indigo-600/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 opacity-50" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
                                    <p className="text-indigo-100 mb-10">
                                        Have questions about LabTasker? We're here to help. Fill out the form or reach out to us directly.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4 text-indigo-100">
                                            <Mail className="w-6 h-6 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white">Email</h3>
                                                <p>support@labtasker.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4 text-indigo-100">
                                            <MapPin className="w-6 h-6 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white">Office</h3>
                                                <p>123 Innovation Drive<br />Tech City, TC 90210</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4 text-indigo-100">
                                            <Phone className="w-6 h-6 mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white">Phone</h3>
                                                <p>+1 (555) 123-4567</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <div className="flex space-x-4">
                                        {/* Social Icons could go here */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="p-10 bg-neutral-900/50">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium text-neutral-300">First Name</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium text-neutral-300">Last Name</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-neutral-300">Message</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transform hover:-translate-y-1 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <span>Send Message</span>
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
