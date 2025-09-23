# John Chezik Website - Deployment Guide

## 🚀 Production Deployment

This website is optimized for deployment on **Vercel** with the `@sveltejs/adapter-vercel` adapter already configured.

### Quick Deploy to Vercel

1. **Connect your repository to Vercel:**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from your project directory
   vercel
   ```

2. **Environment Variables (Optional):**
   Add these to your Vercel dashboard if you integrate real services:
   ```
   MAILCHIMP_API_KEY=your_mailchimp_key
   SENDGRID_API_KEY=your_sendgrid_key
   CONTACT_EMAIL=media@johnchezik.com
   ```

### Build and Preview Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build
npm run preview
```

## 🛠 Development

```bash
# Start development server
npm run dev

# Run type checking
npm run check

# Format code
npm run format

# Lint code
npm run lint
```

## 📊 Analytics Setup

The site includes Vercel Analytics and Speed Insights. These will automatically work when deployed to Vercel.

For other providers:

- Replace `@vercel/analytics` imports in `src/routes/+layout.svelte`
- Add your analytics tracking code

## 📧 Email Integration

The contact form and newsletter are set up with API endpoints but need real email service integration:

### Option 1: SendGrid

```typescript
// In src/routes/api/contact/+server.ts
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
```

### Option 2: Resend

```typescript
// Install: npm install resend
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
```

### Option 3: Nodemailer

```typescript
// Install: npm install nodemailer
import nodemailer from "nodemailer";
```

## 🎵 Audio Files

Audio files are protected from direct download but can be streamed. For production:

1. Consider using a CDN for audio files
2. Implement proper audio streaming with range requests
3. Add audio compression for better performance

## 🔒 Security Considerations

1. **Rate Limiting:** Implement proper rate limiting for forms
2. **CORS:** Configure CORS headers for API routes
3. **Validation:** Add server-side validation for all inputs
4. **Spam Protection:** Consider adding reCAPTCHA or similar

## 🎨 Customization

### Theme Colors

Update CSS variables in `src/app.css`:

```css
:root {
  --color-accent-primary: #007aff; /* Your brand color */
  --color-accent-hover: #0056cc;
}
```

### Content Updates

- **Albums:** Update `src/components/AlbumsSection.svelte`
- **Books:** Update `src/components/BooksSection.svelte`
- **Blog:** Update `src/components/BlogSection.svelte`
- **About:** Update `src/components/AboutSection.svelte`

## 📱 PWA Features

The site includes:

- Service Worker for offline functionality
- Web App Manifest for installation
- Caching strategies for performance

## ♿ Accessibility

The site includes:

- ARIA labels and landmarks
- Keyboard navigation
- Screen reader support
- High contrast mode support
- Reduced motion support

## 🔍 SEO Features

- Structured data (JSON-LD)
- Open Graph tags
- Twitter Card tags
- XML Sitemap
- Robots.txt
- Canonical URLs

## 📈 Performance Optimizations

- Image lazy loading
- Resource preloading
- Code splitting
- Service Worker caching
- Optimized fonts and assets

## 🎯 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear SvelteKit cache
rm -rf .svelte-kit
```

### Audio Playback Issues

- Ensure audio files are in the `static/` directory
- Check MIME types are configured correctly
- Verify HTTPS is used in production (required for many audio features)

### PWA Issues

- Verify manifest.json is accessible
- Check service worker registration in browser dev tools
- Ensure HTTPS is used (required for service workers)

## 📞 Support

For technical issues or customization help, refer to:

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Built with ❤️ using SvelteKit, TypeScript, and modern web technologies.**
