# 🚀 **VERCEL DEPLOYMENT CONFIGURATION**

## **📋 Environment Variables for Vercel**

### **Required Environment Variables**

Set these in your Vercel dashboard under Project Settings → Environment Variables:

```bash
# =============================================================================
# EMAIL CONFIGURATION (Resend)
# =============================================================================
RESEND_API_KEY=re_your_actual_resend_api_key_here
RESEND_FROM_EMAIL=hello@chezik.eu
RESEND_FROM_NAME="John Chezik"

# =============================================================================
# VERCEL BLOB STORAGE (Optional - for file uploads)
# =============================================================================
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here

# =============================================================================
# VERCEL KV STORAGE (Optional - for caching)
# =============================================================================
KV_REST_API_URL=https://your-kv-store.kv.vercel-storage.com
KV_REST_API_TOKEN=your_kv_token_here

# =============================================================================
# WEBSITE CONFIGURATION
# =============================================================================
NEXT_PUBLIC_BASE_URL=https://chezik.eu
NEXT_PUBLIC_SITE_NAME="John Chezik"
FROM_EMAIL=noreply@chezik.eu
CONTACT_EMAIL=media@chezik.eu

# =============================================================================
# SECURITY KEYS (Generate secure random strings)
# =============================================================================
EMAIL_SECRET=your_secure_random_string_32_chars_minimum
UNSUBSCRIBE_SECRET=your_secure_unsubscribe_secret_32_chars
PREFERENCES_SECRET=your_secure_preferences_secret_32_chars

# =============================================================================
# VERIFICATION CODES (Optional)
# =============================================================================
GOOGLE_VERIFICATION_CODE=your_google_verification_code
YANDEX_VERIFICATION_CODE=your_yandex_verification_code
YAHOO_VERIFICATION_CODE=your_yahoo_verification_code

# =============================================================================
# CONTACT INFORMATION (Optional)
# =============================================================================
CONTACT_PHONE=+1-XXX-XXX-XXXX

# =============================================================================
# ANALYTICS (Automatically enabled on Vercel)
# =============================================================================
NEXT_TELEMETRY_DISABLED=1
```

## **🔧 Vercel Project Settings**

### **Build & Development Settings**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs"
}
```

### **Environment Configuration**

- **Production**: All environment variables set
- **Preview**: Same as production (for testing)
- **Development**: Only essential variables for local development

## **📊 Performance Optimizations**

### **Vercel Edge Functions**
- Audio streaming API uses Edge Runtime for global performance
- Analytics API optimized for edge deployment

### **Caching Strategy**
- Static assets: 1 year cache
- Audio files: 1 year cache with immutable flag
- API responses: 1 hour cache with CDN
- Images: Optimized with WebP/AVIF formats

### **Bundle Optimization**
- Code splitting for better caching
- Vendor chunks separated for optimal caching
- Audio-related dependencies in separate chunk

## **🔒 Security Configuration**

### **Headers Applied**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: Restricted camera, microphone, geolocation

### **Rate Limiting**
- Contact form: 5 requests per minute
- Newsletter: 3 requests per minute
- Analytics: 10 requests per minute

## **📱 Mobile & PWA Optimizations**

### **Responsive Design**
- Mobile-first approach
- Touch-friendly 44px minimum touch targets
- Safe area insets for iOS devices
- Container max-width constraints for large screens

### **PWA Features**
- Service worker for offline functionality
- Web app manifest for installability
- Optimized for Core Web Vitals

## **🎯 Core Web Vitals Targets**

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s

## **🚀 Deployment Steps**

1. **Connect Repository**
   - Import from GitHub
   - Select main branch
   - Framework: Next.js (auto-detected)

2. **Set Environment Variables**
   - Copy from the list above
   - Set for Production, Preview, and Development

3. **Deploy**
   - Automatic deployment on push to main
   - Preview deployments for pull requests

4. **Verify Deployment**
   - Check all pages load correctly
   - Test audio streaming functionality
   - Verify contact form works
   - Test newsletter subscription

## **📈 Monitoring & Analytics**

### **Vercel Analytics**
- Automatically enabled
- Real user monitoring
- Performance insights

### **Custom Analytics**
- Audio play tracking
- User behavior analytics
- Performance monitoring

## **🔧 Troubleshooting**

### **Common Issues**

1. **Build Failures**
   - Check environment variables are set
   - Verify Node.js version (>=20.18.0)
   - Check for TypeScript errors

2. **Runtime Errors**
   - Verify API keys are valid
   - Check rate limiting settings
   - Monitor Vercel function logs

3. **Performance Issues**
   - Check bundle size
   - Verify image optimization
   - Monitor Core Web Vitals

### **Debug Commands**

```bash
# Local development
npm run dev

# Production build test
npm run build
npm run start

# Performance analysis
npm run analyze

# Lighthouse audit
npm run perf
```

## **📞 Support**

For deployment issues:
1. Check Vercel dashboard logs
2. Verify environment variables
3. Test locally with production build
4. Check Vercel documentation

---

**Ready for deployment! 🎉**
