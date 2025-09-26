import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Next.js image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props);
  },
}));

// Mock environment variables
// Note: NODE_ENV is read-only in build, so we don't set it
process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID = 'test-analytics-id';
process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID = 'test-speed-insights-id';
