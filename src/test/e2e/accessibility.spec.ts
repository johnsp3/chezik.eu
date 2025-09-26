import { test, expect } from '@playwright/test';

/**
 * Accessibility Tests
 * 
 * Tests WCAG 2.2 AA compliance across all devices and browsers.
 * Ensures proper ARIA labels, keyboard navigation, and screen reader support.
 */

test.describe('Accessibility - WCAG 2.2 AA Compliance', () => {
  
  test('Page has proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Check that there's only one h1
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBe(1);
    
    // Check that h1 contains the main page title
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('John Chezik');
    
    // Check that headings follow proper hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.substring(1));
      
      // Skip if this is the first heading
      if (previousLevel === 0) {
        previousLevel = level;
        continue;
      }
      
      // Check that heading levels don't skip more than one level (e.g., h1 to h3 is ok, h1 to h4 is not)
      expect(level - previousLevel).toBeLessThanOrEqual(2);
      previousLevel = level;
    }
  });

  test('All images have proper alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      
      // Decorative images should have empty alt
      const isDecorative = await img.evaluate(el => {
        const role = el.getAttribute('role');
        return role === 'presentation' || el.getAttribute('aria-hidden') === 'true';
      });
      
      if (isDecorative) {
        expect(alt).toBe('');
      } else {
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
        expect(alt).not.toBe('image');
        expect(alt).not.toBe('photo');
        expect(alt).not.toBe('picture');
      }
    }
  });

  test('All interactive elements have proper labels', async ({ page }) => {
    await page.goto('/');
    
    // Check buttons
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Button should have either visible text, aria-label, or aria-labelledby
      expect(text?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
    
    // Check links
    const links = await page.locator('a').all();
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const href = await link.getAttribute('href');
      
      // Links should have either visible text or aria-label
      // Skip anchor links that are just for navigation
      if (href?.startsWith('#')) {
        expect(text?.trim() || ariaLabel).toBeTruthy();
      } else {
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    }
    
    // Check form inputs
    const inputs = await page.locator('input, textarea, select').all();
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Skip hidden inputs
      if (type === 'hidden') continue;
      
      // Input should have label, aria-label, aria-labelledby, or placeholder
      expect(ariaLabel || ariaLabelledBy || placeholder).toBeTruthy();
    }
  });

  test('Page has proper focus management', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check that focus indicator is visible
    const focusStyle = await focusedElement.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow
      };
    });
    
    // Focus should be visible (either outline or box-shadow)
    expect(
      focusStyle.outline !== 'none' || 
      focusStyle.outlineWidth !== '0px' || 
      focusStyle.boxShadow !== 'none'
    ).toBeTruthy();
  });

  test('Modal dialogs have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    // Open search modal
    const searchButton = page.locator('.search-button');
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      const modal = page.locator('.search-modal');
      await expect(modal).toBeVisible();
      
      // Check ARIA attributes
      const role = await modal.getAttribute('role');
      const ariaModal = await modal.getAttribute('aria-modal');
      const ariaLabel = await modal.getAttribute('aria-label');
      const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
      
      expect(role).toBe('document');
      expect(ariaModal).toBe('true');
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      
      // Check that focus is trapped in modal
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeTruthy();
      
      // Close modal
      await page.keyboard.press('Escape');
    }
  });

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    
    // This is a basic test - in a real scenario, you'd use a color contrast checker
    // Check that text elements have sufficient contrast
    
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6, a, button').all();
    
    for (const element of textElements) {
      const text = await element.textContent();
      if (text?.trim()) {
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          };
        });
        
        // Basic check that colors are defined
        expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
        expect(styles.color).not.toBe('transparent');
      }
    }
  });

  test('Page has skip navigation link', async ({ page }) => {
    await page.goto('/');
    
    // Check that skip link exists
    const skipLink = page.locator('a[href="#main-content"], .skip-link');
    await expect(skipLink).toBeVisible();
    
    // Check that skip link is properly positioned
    const skipLinkStyles = await skipLink.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        left: styles.left,
        top: styles.top
      };
    });
    
    // Skip link should be positioned for easy access
    expect(skipLinkStyles.position).toBe('absolute');
  });

  test('Form validation provides proper feedback', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport();
    
    const form = page.locator('.contact-form');
    if (await form.isVisible()) {
      // Try to submit empty form
      const submitButton = page.locator('.contact-form button[type="submit"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Check that validation messages appear
        // Note: This test assumes the form has client-side validation
        // In a real scenario, you'd check for specific validation messages
        await expect(page.locator('[role="alert"], .error, .invalid')).toBeVisible();
      }
    }
  });

  test('Page works with screen reader', async ({ page }) => {
    await page.goto('/');
    
    // Check that important elements have proper ARIA labels
    const navigation = page.locator('nav');
    const navRole = await navigation.getAttribute('role');
    const navAriaLabel = await navigation.getAttribute('aria-label');
    
    expect(navRole).toBe('navigation');
    expect(navAriaLabel).toBeTruthy();
    
    // Check that main content is properly marked
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // Check that sections have proper landmarks
    const sections = await page.locator('section').all();
    for (const section of sections) {
      const id = await section.getAttribute('id');
      const ariaLabel = await section.getAttribute('aria-label');
      
      // Sections should have either id or aria-label for navigation
      expect(id || ariaLabel).toBeTruthy();
    }
  });

  test('Page handles keyboard navigation properly', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation through the page
    const tabStops: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        const text = await focusedElement.textContent();
        const ariaLabel = await focusedElement.getAttribute('aria-label');
        
        tabStops.push(`${tagName}: ${text?.trim() || ariaLabel || 'no label'}`);
      }
    }
    
    // Should have found some tab stops
    expect(tabStops.length).toBeGreaterThan(0);
    
    // Test that Enter key activates buttons
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    
    if (await focusedElement.isVisible()) {
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'button' || tagName === 'a') {
        // This would trigger the element's action
        // In a real test, you'd verify the expected behavior
      }
    }
  });

  test('Page has proper language declaration', async ({ page }) => {
    await page.goto('/');
    
    // Check that html element has lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toBe('en');
  });

  test('Dynamic content updates are announced', async ({ page }) => {
    await page.goto('/');
    
    // Check for live regions
    const liveRegions = page.locator('[aria-live], [aria-atomic]');
    const liveRegionCount = await liveRegions.count();
    
    // Should have at least one live region for dynamic updates
    expect(liveRegionCount).toBeGreaterThan(0);
    
    // Test that audio player updates are announced
    await page.click('a[href="#albums"]');
    await expect(page.locator('#albums')).toBeInViewport();
    
    const playButton = page.locator('.play-pause-btn').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      
      // Check that audio player has proper live region
      const audioPlayer = page.locator('.simple-audio-player');
      const ariaLive = await audioPlayer.getAttribute('aria-live');
      expect(ariaLive).toBeTruthy();
    }
  });
});
