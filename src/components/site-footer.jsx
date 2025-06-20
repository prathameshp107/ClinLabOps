import Link from 'next/link';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export function SiteFooter({ className }) { 
  return ( 
    <footer className={cn('py-6 border-t', className)}> 
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row"> 
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0"> 
          <Icons.logo className="h-6 w-6" /> 
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left"> 
            &copy; {new Date().getFullYear()} LabTasker. All rights reserved. 
          </p> 
        </div> 
        <div className="flex items-center space-x-4"> 
          <Link 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors" 
          > 
            Terms 
          </Link> 
          <Link 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors" 
          > 
            Privacy 
          </Link> 
          <Link 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors" 
          > 
            Contact 
          </Link> 
        </div> 
      </div> 
    </footer> 
  ) 
}