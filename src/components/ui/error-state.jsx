"use client"

import { motion } from "framer-motion"
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Button } from "./button"

export function ErrorState({
    title = "Something went wrong",
    message = "We encountered an issue. Please try again later.",
    error,
    onRetry,
    onContinue,
    variant = "default", // "default", "network", "offline"
    className = ""
}) {
    const getIcon = () => {
        switch (variant) {
            case "network":
                return <Wifi className="h-12 w-12 text-blue-500" />
            case "offline":
                return <WifiOff className="h-12 w-12 text-gray-500" />
            default:
                return <AlertCircle className="h-12 w-12 text-red-500" />
        }
    }

    const getGradientColors = () => {
        switch (variant) {
            case "network":
                return "from-blue-50 to-indigo-50"
            case "offline":
                return "from-gray-50 to-slate-50"
            default:
                return "from-red-50 to-orange-50"
        }
    }

    const getIconColor = () => {
        switch (variant) {
            case "network":
                return "text-blue-500"
            case "offline":
                return "text-gray-500"
            default:
                return "text-red-500"
        }
    }

    const getBorderColor = () => {
        switch (variant) {
            case "network":
                return "border-blue-100"
            case "offline":
                return "border-gray-100"
            default:
                return "border-red-100"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}
        >
            <div className="relative">
                {/* Background gradient circle */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors()} rounded-full w-24 h-24 blur-xl opacity-60`}></div>

                {/* Error icon */}
                <div className={`relative bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg border ${getBorderColor()}`}>
                    {getIcon()}
                </div>
            </div>

            <div className="text-center mt-8 max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${variant === "network"
                                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                                    : variant === "offline"
                                        ? "bg-gray-500 hover:bg-gray-600 text-white"
                                        : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>
                    )}

                    {onContinue && (
                        <Button
                            variant="outline"
                            onClick={onContinue}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg"
                        >
                            Continue Offline
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="mt-6 text-xs text-gray-500">
                        <p>Error details: {error}</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
} 