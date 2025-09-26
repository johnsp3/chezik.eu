# 🚀 **DEPLOYMENT GUIDE - John Chezik Website**

## **📋 PRE-DEPLOYMENT CHECKLIST**

### ✅ **Security Checklist**
- [ ] All environment variables are properly configured
- [ ] No sensitive data in source code
- [ ] Placeholder data replaced with environment variables
- [ ] Error boundaries implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled

### ✅ **Code Quality Checklist**
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatting applied (`npm run format`)
- [ ] Bundle analysis completed (`npm run analyze`)
- [ ] All tests pass (if applicable)

---

## **🔧 ENVIRONMENT VARIABLES SETUP**

### **Required Environment Variables**

Create a `.env.local` file (copy from `env.example`):

```bash
# Copy the example file
cp env.example .env.local
```

### **Essential Variables for Production:**

```env
# Website Configuration
NEXT_PUBLIC_SITE_URL=https://chezik.eu
NEXT_PUBLIC_SITE_NAME="John Chezik"

# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_resend_api_key
FROM_EMAIL=noreply@chezik.eu
CONTACT_EMAIL=media@chezik.eu

# Verification Codes (Get from respective services)
GOOGLE_VERIFICATION_CODE=your_actual_google_code
YANDEX_VERIFICATION_CODE=your_actual_yandex_code
YAHOO_VERIFICATION_CODE=your_actual_yahoo_code

# Contact Information
CONTACT_PHONE=+1-XXX-XXX-XXXX

# Security
EMAIL_SECRET=your_secure_random_string
JWT_SECRET=your_secure_jwt_secret
RATE_LIMIT_SECRET=your_rate_limit_secret
```

---

## **🌐 VERCEL DEPLOYMENT**

### **Step 1: Prepare Repository**

```bash
# Ensure all changes are committed
git add .
git commit -m "feat: implement security fixes and optimizations"

# Push to GitHub
git push origin main
```

### **Step 2: Vercel Setup**

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the project

2. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables from the list above
   - Set them for Production, Preview, and Development

3. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

### **Step 3: Domain Configuration**

1. **Add Custom Domain:**
   - Go to Project Settings → Domains
   - Add `chezik.eu` and `www.chezik.eu`
   - Configure DNS records as instructed by Vercel

2. **SSL Certificate:**
   - Vercel automatically provides SSL certificates
   - Ensure HTTPS redirect is enabled

---

## **🔒 SECURITY CONFIGURATION**

### **Vercel Security Headers**

The application includes comprehensive security headers:

```javascript
// Already configured in next.config.js
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'..."
}
```

### **Rate Limiting**

- Contact form: 3 requests per 5 minutes
- API endpoints: 10-100 requests per minute
- Audio streaming: 200 requests per minute

---

## **📊 MONITORING & ANALYTICS**

### **Vercel Analytics**
- Automatically enabled on Vercel
- No additional configuration needed
- Provides Core Web Vitals and performance metrics

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run analyze

# Server-side analysis
npm run analyze:server

# Browser-side analysis
npm run analyze:browser
```

---

## **🚀 DEPLOYMENT COMMANDS**

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### **Production Build**
```bash
# Build for production
npm run build

# Start production server
npm run start

# Pre-commit checks
npm run pre-commit
```

---

## **🔍 POST-DEPLOYMENT VERIFICATION**

### **Functionality Tests**
- [ ] Homepage loads correctly
- [ ] Navigation works on all devices
- [ ] Audio player functions properly
- [ ] Contact form submits successfully
- [ ] Email notifications work
- [ ] Gallery loads and displays images
- [ ] Mobile responsiveness verified

### **Performance Tests**
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Bundle size optimized
- [ ] Images load quickly
- [ ] Audio streaming works

### **Security Tests**
- [ ] HTTPS redirect works
- [ ] Security headers present
- [ ] Rate limiting active
- [ ] No sensitive data exposed
- [ ] Error boundaries catch errors

---

## **🛠️ TROUBLESHOOTING**

### **Common Issues**

1. **Build Failures:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Environment Variables:**
   - Ensure all required variables are set in Vercel
   - Check variable names match exactly
   - Verify no typos in values

3. **Email Issues:**
   - Verify Resend API key is correct
   - Check FROM_EMAIL domain is verified
   - Test with a simple email first

4. **Audio Streaming:**
   - Ensure audio files are in `/public` directory
   - Check file permissions
   - Verify MIME types are correct

### **Performance Issues**

1. **Large Bundle Size:**
   ```bash
   # Analyze bundle
   npm run analyze
   
   # Check for unused dependencies
   npm run lint
   ```

2. **Slow Loading:**
   - Enable Vercel's Edge Network
   - Optimize images with Next.js Image component
   - Use proper caching headers

---

## **📞 SUPPORT**

### **Resources**
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)

### **Contact**
- Technical Issues: Check Vercel dashboard logs
- Email Issues: Verify Resend configuration
- Performance Issues: Use Vercel Analytics

---

## **🎯 SUCCESS CRITERIA**

Your deployment is successful when:

✅ **All functionality works correctly**  
✅ **Performance scores are excellent**  
✅ **Security measures are active**  
✅ **Mobile experience is optimized**  
✅ **Email system is functional**  
✅ **Analytics are tracking properly**  

**🎉 Congratulations! Your John Chezik website is now live and optimized!**
