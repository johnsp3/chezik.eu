/**
 * Intersection Observer Hook
 * 
 * Custom React hook for managing intersection observer functionality
 * to trigger animations when elements come into view.
 * 
 * @fileoverview Reusable hook for scroll-based animations using Intersection Observer API
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 * 
 * @example
 * ```tsx
 * import { useIntersectionObserver } from '@/lib/hooks/use-intersection-observer';
 * 
 * function MyComponent() {
 *   useIntersectionObserver('.section', 'animate-fade-in');
 *   return <div className="section">Content</div>;
 * }
 * ```
 */

import { useEffect } from 'react';

/**
 * Configuration options for the intersection observer
 */
export interface IntersectionObserverOptions {
  /** Minimum percentage of the target element that must be visible */
  readonly threshold?: number;
  /** Margin around the root element's bounding box */
  readonly rootMargin?: string;
  /** CSS class to add when element becomes visible */
  readonly animationClass?: string;
}

/**
 * Default options for intersection observer
 */
const DEFAULT_OPTIONS: Required<IntersectionObserverOptions> = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  animationClass: 'animate-fade-in',
} as const;

/**
 * Custom hook for intersection observer functionality
 * 
 * Sets up an intersection observer to add animation classes to elements
 * when they come into view. Automatically cleans up the observer on unmount.
 * 
 * @param selector - CSS selector for elements to observe
 * @param options - Configuration options for the observer
 * 
 * @example
 * ```tsx
 * function HomePage() {
 *   useIntersectionObserver('.section', {
 *     threshold: 0.2,
 *     animationClass: 'animate-slide-up'
 *   });
 *   
 *   return (
 *     <div>
 *       <section className="section">Content 1</section>
 *       <section className="section">Content 2</section>
 *     </div>
 *   );
 * }
 * ```
 */
export function useIntersectionObserver(
  selector: string,
  options: IntersectionObserverOptions = {}
): void {
  useEffect(() => {
    // Only run on client side to avoid hydration mismatches
    if (typeof window === 'undefined') return;
    
    // Wait for hydration to complete before setting up observer
    const timer = setTimeout(() => {
      // Merge options with defaults
      const config = { ...DEFAULT_OPTIONS, ...options };
      
      // Create intersection observer
      const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(config.animationClass);
            }
          });
        },
        {
          threshold: config.threshold,
          rootMargin: config.rootMargin,
        }
      );
      
      // Observe all matching elements
      const elements = document.querySelectorAll(selector);
      elements.forEach((element: Element) => {
        observer.observe(element);
      });
      
      // Store observer for cleanup
      (window as Window & { __intersectionObserver?: IntersectionObserver }).__intersectionObserver = observer;
    }, 100); // Small delay to ensure hydration is complete
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      const windowWithObserver = window as Window & { __intersectionObserver?: IntersectionObserver };
      if (windowWithObserver.__intersectionObserver) {
        windowWithObserver.__intersectionObserver.disconnect();
        delete windowWithObserver.__intersectionObserver;
      }
    };
  }, [selector, options]);
}
