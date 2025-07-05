import { Toaster } from "@/components/ui/use-toast"
import { Inter } from 'next/font/google'
import "./globals.css"

// Configure the Inter font with variable font features
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'LabTasker - Laboratory Task Management',
  description: 'Efficient laboratory task management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="h-full bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}