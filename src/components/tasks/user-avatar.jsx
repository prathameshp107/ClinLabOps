import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const UserAvatar = ({
    user,
    size = 'md',
    showStatus = false,
    status = 'offline',
    variant = 'default',
    className = '',
    onClick,
    ...props
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Size variants
    const sizeClasses = {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20'
    };

    // Status indicator styles
    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
        offline: 'bg-gray-400'
    };

    // Variant styles
    const variantClasses = {
        default: 'ring-2 ring-background hover:ring-primary/20 transition-all duration-200',
        gradient: 'ring-2 ring-transparent bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300',
        minimal: 'hover:opacity-80 transition-opacity duration-200',
        bordered: 'ring-2 ring-border hover:ring-primary/50 transition-colors duration-200'
    };

    // Generate initials with better logic
    const getInitials = (name) => {
        if (!name) return '?';

        const words = name.trim().split(' ').filter(word => word.length > 0);
        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }
        return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
    };

    // Generate consistent color based on name
    const getAvatarColor = (name) => {
        if (!name) return 'bg-gray-500';

        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
            'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
            'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
            'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500'
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    const AvatarContent = () => {
        if (variant === 'gradient') {
            return (
                <div className={cn(
                    'rounded-full overflow-hidden',
                    sizeClasses[size],
                    variantClasses[variant]
                )}>
                    <div className="h-full w-full bg-background rounded-full flex items-center justify-center">
                        <Avatar className="h-full w-full border-0">
                            <AvatarImage
                                src={user?.avatar}
                                alt={user?.name}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                                className="object-cover"
                            />
                            <AvatarFallback
                                className={cn(
                                    "text-white font-semibold border-0",
                                    getAvatarColor(user?.name),
                                    size === 'xs' && 'text-xs',
                                    size === 'sm' && 'text-xs',
                                    size === 'md' && 'text-sm',
                                    size === 'lg' && 'text-base',
                                    size === 'xl' && 'text-lg',
                                    size === '2xl' && 'text-xl'
                                )}
                            >
                                {getInitials(user?.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            );
        }

        return (
            <Avatar className={cn(
                sizeClasses[size],
                variantClasses[variant],
                'overflow-hidden'
            )}>
                <AvatarImage
                    src={user?.avatar}
                    alt={user?.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    className="object-cover transition-transform duration-300 hover:scale-110"
                />
                <AvatarFallback
                    className={cn(
                        "text-white font-semibold transition-colors duration-200",
                        getAvatarColor(user?.name),
                        size === 'xs' && 'text-xs',
                        size === 'sm' && 'text-xs',
                        size === 'md' && 'text-sm',
                        size === 'lg' && 'text-base',
                        size === 'xl' && 'text-lg',
                        size === '2xl' && 'text-xl'
                    )}
                >
                    {getInitials(user?.name)}
                </AvatarFallback>
            </Avatar>
        );
    };

    return (
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
                                statusColors[status],
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
    );
};

export default UserAvatar;