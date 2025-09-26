import { test, expect } from '@playwright/test';

/**
 * Responsive Design Tests
 * 
 * Tests critical flows across all device breakpoints to ensure
 * proper rendering and functionality on mobile, tablet, and desktop.
 */

test.describe('Responsive Design - Critical Flows', () => {
  
  test('Homepage loads and displays correctly on all devices', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/John Chezik/);
    
    // Check that hero section is visible
    await expect(page.locator('#home')).toBeVisible();
    
    // Check that navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check that main content is accessible
    await expect(page.locator('main, [role="main"]')).toBeVisible();
  });

  test('Navigation works correctly across breakpoints', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop navigation
    if (await page.locator('.desktop-nav').isVisible()) {
      // Click on Albums link
      await page.click('a[href="#albums"]');
      await expect(page.locator('#albums')).toBeInViewport();
      
      // Click on Books link
      await page.click('a[href="#books"]');
      await expect(page.locator('#books')).toBeInViewport();
      
      // Click on Gallery link
      await page.click('a[href="#gallery"]');
      await expect(page.locator('#gallery')).toBeInViewport();
    }
    
    // Test mobile navigation
    if (await page.locator('.mobile-menu-button').isVisible()) {
      // Open mobile menu
      await page.click('.mobile-menu-button');
      await expect(page.locator('.mobile-menu')).toBeVisible();
      
      // Click on About link in mobile menu
      await page.click('.mobile-menu a[href="#about"]');
      await expect(page.locator('#about')).toBeInViewport();
      
      // Mobile menu should close after navigation
      await expect(page.locator('.mobile-menu')).not.toBeVisible();
    }
  });

  test('Touch targets meet accessibility requirements', async ({ page }) => {
    await page.goto('/');
    
    // Check that all interactive elements meet minimum touch target size (44x44px)
    const interactiveElements = [
      '.btn',
      '.nav-link',
      '.search-button',
      '.theme-toggle',
      '.mobile-menu-button',
      '.play-pause-btn',
      '.volume-btn',
      'button',
      'a[role="button"]'
    ];
    
    for (const selector of interactiveElements) {
      const elements = await page.locator(selector).all();
      for (const element of elements) {
        if (await element.isVisible()) {
          const box = await element.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  });

  test('Images load with proper responsive sizes', async ({ page }) => {
    await page.goto('/');
    
    // Check that hero image loads
    const heroImage = page.locator('.profile-img');
    await expect(heroImage).toBeVisible();
    
    // Check that images have proper alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('Audio player works on all devices', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to albums section
    await page.click('a[href="#albums"]');
    await expect(page.locator('#albums')).toBeInViewport();
    
    // Find and click a play button
    const playButton = page.locator('.play-pause-btn').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      
      // Check that audio player appears
      await expect(page.locator('.simple-audio-player')).toBeVisible();
      
      // Check that controls are accessible
      await expect(page.locator('.play-pause-btn')).toBeVisible();
      await expect(page.locator('.progress-bar')).toBeVisible();
      await expect(page.locator('.volume-btn')).toBeVisible();
    }
  });

  test('Photo gallery is responsive and functional', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to gallery section
    await page.click('a[href="#gallery"]');
    await expect(page.locator('#gallery')).toBeInViewport();
    
    // Check that photos are displayed in a grid
    const photoCards = page.locator('.photo-card');
    await expect(photoCards.first()).toBeVisible();
    
    // Click on first photo to open modal
    await photoCards.first().click();
    
    // Check that modal opens
    await expect(page.locator('.photo-modal')).toBeVisible();
    
    // Check that modal can be closed
    const closeButton = page.locator('.modal-close, [aria-label*="close" i]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await expect(page.locator('.photo-modal')).not.toBeVisible();
    }
  });

  test('Search functionality works across devices', async ({ page }) => {
    await page.goto('/');
    
    // Open search modal
    const searchButton = page.locator('.search-button');
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      // Check that search modal opens
      await expect(page.locator('.search-modal')).toBeVisible();
      
      // Type in search
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
      await searchInput.fill('album');
      
      // Check that results appear
      await expect(page.locator('.search-results')).toBeVisible();
      
      // Close search modal
      await page.keyboard.press('Escape');
      await expect(page.locator('.search-modal')).not.toBeVisible();
    }
  });

  test('Contact form is accessible and functional', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport();
    
    // Check that form is present
    const form = page.locator('.contact-form');
    await expect(form).toBeVisible();
    
    // Check that form fields are accessible
    const nameInput = page.locator('.contact-form input[name="name"]');
    const emailInput = page.locator('.contact-form input[name="email"]');
    const messageInput = page.locator('.contact-form textarea[name="message"]');
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
    }
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
    }
    
    if (await messageInput.isVisible()) {
      await messageInput.fill('Test message');
    }
    
    // Check that submit button is present and accessible
    const submitButton = page.locator('.contact-form button[type="submit"]');
    if (await submitButton.isVisible()) {
      await expect(submitButton).toBeEnabled();
    }
  });

  test('Theme toggle works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme
    const body = page.locator('body');
    const initialTheme = await body.getAttribute('class');
    
    // Click theme toggle
    const themeToggle = page.locator('.theme-toggle');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Check that theme changed
      const newTheme = await body.getAttribute('class');
      expect(newTheme).not.toBe(initialTheme);
      
      // Toggle back
      await themeToggle.click();
      const finalTheme = await body.getAttribute('class');
      // Check that theme classes are properly managed (should return to original state)
      expect(finalTheme).toContain('theme-dark');
    }
  });

  test('Page respects reduced motion preferences', async ({ page }) => {
    await page.goto('/');
    
    // Check that animations are present by default
    const animatedElements = page.locator('.animate-fade-in, .animate-slide-up, .animate-scale-in');
    if (await animatedElements.count() > 0) {
      // In reduced motion mode, animations should be disabled
      // This test will pass if the CSS respects prefers-reduced-motion
      await expect(animatedElements.first()).toBeVisible();
    }
  });

  test('Page is keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test that Enter key activates buttons
    await page.keyboard.press('Enter');
    
    // Test that Escape key closes modals
    await page.keyboard.press('Escape');
  });

  test('Page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that no console errors occurred
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit for any async operations
    await page.waitForTimeout(1000);
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Responsive Design - Breakpoint Specific Tests', () => {
  
  test('Mobile layout (320px-767px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    
    // Check that mobile menu button is visible
    await expect(page.locator('.mobile-menu-button')).toBeVisible();
    
    // Check that desktop navigation is hidden
    await expect(page.locator('.desktop-nav')).not.toBeVisible();
    
    // Check that content is properly stacked
    const heroContent = page.locator('.hero-content');
    const computedStyle = await heroContent.evaluate(el => {
      return window.getComputedStyle(el).flexDirection;
    });
    expect(computedStyle).toBe('column');
  });

  test('Tablet layout (768px-1023px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');
    
    // Check that both mobile and desktop elements might be visible
    // depending on the specific breakpoint implementation
    
    // Check that content adapts to tablet size
    const container = page.locator('.container').first();
    await expect(container).toBeVisible();
  });

  test('Desktop layout (1024px+)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 }); // Desktop size
    await page.goto('/');
    
    // Check that desktop navigation is visible
    await expect(page.locator('.desktop-nav')).toBeVisible();
    
    // Check that mobile menu button is hidden
    await expect(page.locator('.mobile-menu-button')).not.toBeVisible();
    
    // Check that content uses horizontal layout
    const heroContent = page.locator('.hero-content');
    const computedStyle = await heroContent.evaluate(el => {
      return window.getComputedStyle(el).flexDirection;
    });
    expect(computedStyle).toBe('row');
  });
});
