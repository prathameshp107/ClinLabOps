'use client';

import { LayoutGrid, List } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ViewModeSelector({ viewMode, onViewModeChange }) {
    return (
        <TooltipProvider>
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle
                            pressed={viewMode === 'card'}
                            onPressedChange={() => onViewModeChange('card')}
                            aria-label="Card view"
                            className="data-[state=on]:bg-white dark:data-[state=on]:bg-gray-700 data-[state=on]:shadow-sm rounded-xl p-2 h-9 w-9 transition-all duration-200"
                        >
                            <LayoutGrid className="h-4 w-4 text-gray-600 dark:text-gray-300 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400" />
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-gray-100 border-gray-700">
                        <p>Card View</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle
                            pressed={viewMode === 'table'}
                            onPressedChange={() => onViewModeChange('table')}
                            aria-label="Table view"
                            className="data-[state=on]:bg-white dark:data-[state=on]:bg-gray-700 data-[state=on]:shadow-sm rounded-xl p-2 h-9 w-9 transition-all duration-200"
                        >
                            <List className="h-4 w-4 text-gray-600 dark:text-gray-300 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400" />
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-gray-100 border-gray-700">
                        <p>Table View</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}