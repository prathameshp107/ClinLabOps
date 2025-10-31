import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home, Mail } from "lucide-react";

export default function RegistrationSuccessModal({ isOpen, userEmail, onClose }) {
    const router = useRouter();

    const handleGoToLogin = () => {
        onClose();
        router.push("/login");
    };

    const handleStayOnPage = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md overflow-hidden rounded-2xl shadow-2xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        duration: 0.6,
                        bounce: 0.4
                    }}
                >
                    <DialogHeader className="text-left pt-6 px-6">
                        <div className="mx-auto mb-4">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg">
                                <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-foreground">
                            Registration Complete!
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground mt-2">
                            Welcome to LabTasker
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-2">
                        <div className="bg-muted/50 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Check your email</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        We've sent a welcome email to <span className="font-medium text-foreground">{userEmail}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-muted-foreground text-sm">
                            Your account has been successfully created. You can now access all LabTasker features.
                        </p>
                    </div>

                    <DialogFooter className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:justify-center">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full"
                        >
                            <Button
                                onClick={handleGoToLogin}
                                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg"
                            >
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Go to Login
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full"
                        >
                            <Button
                                variant="outline"
                                onClick={handleStayOnPage}
                                className="w-full border-muted-foreground/20 shadow-sm"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Stay on Page
                            </Button>
                        </motion.div>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}