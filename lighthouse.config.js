module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/#albums',
        'http://localhost:3000/#books',
        'http://localhost:3000/#gallery',
        'http://localhost:3000/#about',
        'http://localhost:3000/#contact'
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      }
    },
    assert: {
      assertions: {
        // Performance Budgets - Core Web Vitals
        'categories:performance': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        
        // Accessibility - WCAG 2.2 AA
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'button-name': 'error',
        'form-field-multiple-labels': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'meta-viewport': 'error',
        'object-alt': 'error',
        'tabindex': 'error',
        'td-headers-attr': 'error',
        'th-has-data-cells': 'error',
        'valid-lang': 'error',
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'is-on-https': 'error',
        'uses-http2': 'warn',
        'no-vulnerable-libraries': 'error',
        'csp-xss': 'warn',
        'deprecations': 'warn',
        'errors-in-console': 'error',
        'no-document-write': 'error',
        'no-mixed-content': 'error',
        'notification-on-start': 'error',
        'password-inputs-can-be-pasted-into': 'error',
        'uses-passive-event-listeners': 'error',
        
        // SEO
        'categories:seo': ['error', { minScore: 0.9 }],
        'meta-description': 'error',
        'document-title': 'error',
        'hreflang': 'warn',
        'canonical': 'warn',
        'font-display': 'warn',
        'http-status-code': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'structured-data': 'warn',
        'tap-targets': 'error',
        'viewport': 'error',
        
        // Resource Budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 250000 }], // 250KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50000 }], // 50KB
        'resource-summary:image:size': ['error', { maxNumericValue: 1000000 }], // 1MB
        'resource-summary:font:size': ['error', { maxNumericValue: 100000 }], // 100KB
        'resource-summary:total:size': ['error', { maxNumericValue: 2000000 }], // 2MB
        
        // Network Budgets
        'resource-summary:script:count': ['error', { maxNumericValue: 20 }],
        'resource-summary:stylesheet:count': ['error', { maxNumericValue: 5 }],
        'resource-summary:image:count': ['error', { maxNumericValue: 30 }],
        'resource-summary:font:count': ['error', { maxNumericValue: 5 }],
        
        // PWA Requirements
        'installable-manifest': 'warn',
        'service-worker': 'warn',
        'splash-screen': 'warn',
        'themed-omnibox': 'warn',
        'content-width': 'error',
        'apple-touch-icon': 'warn',
        'maskable-icon': 'warn'
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
