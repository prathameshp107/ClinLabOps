import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Safely access browser-only APIs
 * Prevents hydration errors by ensuring consistent rendering between server and client
 * @param {Function} fn - Function to execute on the client side only
 * @param {*} fallback - Fallback value to use during server-side rendering
 * @returns {*} Result of fn() on client, fallback on server
 */
export function clientOnly(fn, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }
  return fn();
}

/**
 * Creates a stable ID that remains consistent between server and client rendering
 * @param {string} prefix - Prefix for the ID
 * @returns {string} A stable ID
 */
export function createStableId(prefix = 'id') {
  return `${prefix}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Adds suppressHydrationWarning to a component's props
 * @param {Object} props - Component props
 * @returns {Object} Props with suppressHydrationWarning added
 */
export function withSuppressHydration(props = {}) {
  return {
    ...props,
    suppressHydrationWarning: true,
  };
}
