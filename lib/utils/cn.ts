import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 * 用于条件合并 className
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

