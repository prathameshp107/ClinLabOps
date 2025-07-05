import React from "react";
import { cn } from "@/lib/utils";

export function Timeline({ children }) {
    const timelineItems = React.Children.toArray(children);
    return (
        <div className="flex flex-col">
            {timelineItems.map((child, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <div className="flex">
                            <div className="w-12 flex justify-center">
                                <div className="h-16 w-0.5 bg-gray-300" />
                            </div>
                            <div className="flex-1" />
                        </div>
                    )}
                    {child}
                </React.Fragment>
            ))}
        </div>
    );
}

export function TimelineItem({ children, className }) {
    // This component renders a single item in the timeline, including a dot and the content.
    return (
        <div className={cn("flex", className)}>
            {/* The dot on the timeline */}
            <div className="w-12 flex flex-col items-center">
                <div className="h-5 w-5 bg-primary rounded-full border-2 border-white shadow mt-2" />
            </div>
            {/* The content of the timeline item */}
            <div className="flex-1 flex items-center min-h-[48px]">{children}</div>
        </div>
    );
} 