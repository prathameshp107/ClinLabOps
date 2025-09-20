import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    avatarColors,
    userStatusColors,
    avatarSizeClasses,
    avatarVariantClasses
} from "@/constants";

const UserAvatar = ({
    user,
    size = 'md',
    showStatus = false,
    status = 'online',
    variant = 'default',
    className = '',
    onClick,
    ...props
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    const getInitials = (name) => {
        if (!name) return "U";
        const words = name.trim().split(' ').filter(word => word.length > 0);
        if (words.length === 0) return "U";
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    const getAvatarColor = (name) => {
        if (!name) return avatarColors[0];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return avatarColors[hash % avatarColors.length];
    };

    const initials = getInitials(user?.name);
    const avatarUrl = user?.avatar && !showFallback ? user.avatar : null;
    const avatarColor = getAvatarColor(user?.name);

    const AvatarContent = () => {
        if (avatarUrl) {
            return (
                <img
                    src={avatarUrl}
                    alt={user?.name || "User"}
                    className={cn("object-cover w-full h-full rounded-full", avatarSizeClasses[size] || avatarSizeClasses.md)}
                    onError={() => setShowFallback(true)}
                />
            );
        }
        return (
            <span className={cn("flex items-center justify-center w-full h-full font-semibold text-white rounded-full", avatarSizeClasses[size] || avatarSizeClasses.md, avatarColor)}>
                {initials}
            </span>
        );
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'relative inline-flex items-center justify-center',
                            onClick && 'cursor-pointer',
                            className
                        )}
                        onClick={onClick}
                        role={onClick ? 'button' : undefined}
                        tabIndex={onClick ? 0 : undefined}
                        onKeyDown={onClick ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onClick(e);
                            }
                        } : undefined}
                        {...props}
                    >
                        <AvatarContent />

                        {/* Status indicator */}
                        {showStatus && (
                            <div
                                className={cn(
                                    'absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-background',
                                    userStatusColors[status] || userStatusColors.offline,
                                    size === 'xs' && 'h-2 w-2',
                                    size === 'sm' && 'h-2.5 w-2.5',
                                    size === 'md' && 'h-3 w-3',
                                    size === 'lg' && 'h-3.5 w-3.5',
                                    size === 'xl' && 'h-4 w-4',
                                    size === '2xl' && 'h-5 w-5'
                                )}
                                aria-label={`Status: ${status}`}
                            />
                        )}
                    </div>
                </TooltipTrigger>

                <TooltipContent side="top" className="font-medium">
                    <div className="text-center">
                        <p className="font-semibold">{user?.name || 'Unknown User'}</p>
                        {user?.title && (
                            <p className="text-xs text-muted-foreground mt-0.5">{user.title}</p>
                        )}
                        {showStatus && (
                            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                                {status}
                            </p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default UserAvatar;