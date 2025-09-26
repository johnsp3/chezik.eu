import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Axe violation interface for type safety
// interface AxeViolation {
//   id: string;
//   impact?: string;
//   tags?: string[];
//   description?: string;
//   help?: string;
//   helpUrl?: string;
//   nodes?: unknown[];
// }

/**
 * Axe Accessibility Tests
 * 
 * Runtime accessibility testing using axe-core to ensure
 * WCAG 2.2 AA compliance across all pages and components.
 */

test.describe('Axe Accessibility Tests', () => {
  
  test('Homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Albums section has no accessibility violations', async ({ page }) => {
    await page.goto('/#albums');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#albums')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Books section has no accessibility violations', async ({ page }) => {
    await page.goto('/#books');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#books')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Gallery section has no accessibility violations', async ({ page }) => {
    await page.goto('/#gallery');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#gallery')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('About section has no accessibility violations', async ({ page }) => {
    await page.goto('/#about');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#about')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Contact section has no accessibility violations', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#contact')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Navigation has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('nav')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Search modal has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    // Open search modal
    const searchButton = page.locator('.search-button');
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.search-modal')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Close modal
      await page.keyboard.press('Escape');
    }
  });

  test('Audio player has no accessibility violations', async ({ page }) => {
    await page.goto('/#albums');
    await page.waitForLoadState('networkidle');
    
    // Try to open audio player
    const playButton = page.locator('.play-pause-btn').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      
      // Wait for audio player to appear
      await page.waitForSelector('.simple-audio-player', { timeout: 5000 });
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.simple-audio-player')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('Photo gallery modal has no accessibility violations', async ({ page }) => {
    await page.goto('/#gallery');
    await page.waitForLoadState('networkidle');
    
    // Open photo modal
    const photoCard = page.locator('.photo-card').first();
    if (await photoCard.isVisible()) {
      await photoCard.click();
      
      // Wait for modal to appear
      await page.waitForSelector('.photo-modal', { timeout: 5000 });
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.photo-modal')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Close modal
      const closeButton = page.locator('.modal-close, [aria-label*="close" i]');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });

  test('Mobile menu has no accessibility violations', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    const mobileMenuButton = page.locator('.mobile-menu-button');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.mobile-menu')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('Form elements have no accessibility violations', async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('form')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    // Filter out violations that are not color contrast related
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toEqual([]);
  });

  test('Keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Filter out violations that are not keyboard navigation related
    const keyboardViolations = accessibilityScanResults.violations.filter(
      (violation) => [
        'keyboard',
        'focus-order-semantics',
        'focusable-controls',
        'interactive-controls'
      ].includes(violation.id)
    );
    
    expect(keyboardViolations).toEqual([]);
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Filter out violations that affect screen readers
    const screenReaderViolations = accessibilityScanResults.violations.filter(
      (violation) => [
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-valid-attr-value',
        'aria-valid-attr',
        'aria-roles',
        'aria-required-children',
        'aria-required-parent',
        'aria-unsupported-elements',
        'landmark-one-main',
        'landmark-unique',
        'page-has-heading-one',
        'region'
      ].includes(violation.id)
    );
    
    expect(screenReaderViolations).toEqual([]);
  });

  test('No accessibility violations on reduced motion', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('No accessibility violations on high contrast', async ({ page }) => {
    // Set high contrast preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
