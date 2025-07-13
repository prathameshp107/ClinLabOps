"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/services/authService"

export default function ProtectedLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [redirecting, setRedirecting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("Checking authentication...");
    const [showCheck, setShowCheck] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const isAuthRoute = pathname === "/login" || pathname === "/register";

    useEffect(() => {
        setFadeIn(false);
        if (!isAuthRoute && !isAuthenticated()) {
            setRedirecting(true);
            setMessage("Checking authentication...");
            setProgress(0);
            setShowCheck(false);
            setTimeout(() => setFadeIn(true), 10); // trigger fade-in
            // Animate progress bar
            let interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 80) return prev + 4;
                    return prev;
                });
            }, 80);
            // After 1.5s, show 'Redirecting...' and finish progress
            setTimeout(() => {
                setMessage("Redirecting to login...");
                setProgress(100);
                clearInterval(interval);
                // Show checkmark after a short delay
                setTimeout(() => {
                    setShowCheck(true);
                    // Redirect after checkmark
                    setTimeout(() => {
                        router.replace("/login");
                    }, 500);
                }, 400);
            }, 1500);
            return () => clearInterval(interval);
        } else {
            setRedirecting(false);
        }
    }, [pathname, router, isAuthRoute]);

    if (isAuthRoute) {
        return children;
    }

    if (redirecting) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.4s',
                opacity: fadeIn ? 1 : 0,
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: '1.25rem',
                    boxShadow: '0 8px 32px rgba(80,80,180,0.10)',
                    padding: '2.5rem 2.5rem 2rem 2.5rem',
                    minWidth: 340,
                    textAlign: 'center',
                    position: 'relative',
                    animation: fadeIn ? 'fadeInCard 0.5s' : undefined,
                }}>

                    {/* Spinner or Checkmark */}
                    {!showCheck ? (
                        <div className="animate-spin mb-4 mx-auto" style={{ height: 44, width: 44, border: '5px solid #e5e7eb', borderTop: '5px solid #6366f1', borderRadius: '50%' }}></div>
                    ) : (
                        <div className="mb-4 mx-auto flex items-center justify-center" style={{ height: 44, width: 44 }}>
                            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="22" cy="22" r="22" fill="#4ade80" />
                                <path d="M14 23.5L20 29L30 17" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                    <h2 style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: 8 }}>{message}</h2>
                    <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 18 }}>You must be logged in to access this page.</p>
                    {/* Progress Bar */}
                    <div style={{ height: 6, width: '100%', background: '#e5e7eb', borderRadius: 6, overflow: 'hidden', marginBottom: 12 }}>
                        <div style={{ height: 6, width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1 0%, #4ade80 100%)', borderRadius: 6, transition: 'width 0.3s' }}></div>
                    </div>
                    <button
                        onClick={() => router.replace("/login")}
                        style={{
                            marginTop: 8,
                            background: 'linear-gradient(90deg, #6366f1 0%, #4ade80 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '0.5rem 1.5rem',
                            fontWeight: 500,
                            fontSize: 16,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(80,80,180,0.08)',
                            transition: 'background 0.2s',
                        }}
                    >Go to Login Now</button>
                    <style>{`
                        @keyframes fadeInCard {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return children;
} 