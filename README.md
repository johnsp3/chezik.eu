# 🎵 **John Chezik Music Website**

> **Professional music website built with Next.js 15, featuring advanced audio streaming, responsive design, and modern web technologies.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

## 🌟 **Features**

### 🎵 **Audio Experience**
- **Advanced Audio Streaming** with HLS.js support
- **High-Quality MP3 Playback** with custom controls
- **Real-time Analytics** tracking for audio engagement
- **Offline Support** with service worker caching
- **Cross-browser Compatibility** for all modern browsers

### 📱 **Responsive Design**
- **Mobile-First Approach** with touch-friendly interfaces
- **Progressive Web App (PWA)** with install prompts
- **Adaptive Layouts** for all screen sizes (320px to 4K+)
- **Container Queries** for optimal content display
- **Safe Area Support** for iOS devices

### ⚡ **Performance**
- **Core Web Vitals Optimized** (LCP < 2.5s, CLS < 0.1)
- **Image Optimization** with WebP/AVIF formats
- **Code Splitting** for optimal bundle sizes
- **Edge Runtime** for global performance
- **CDN Caching** with Vercel's global network

### 🔒 **Security & Privacy**
- **Rate Limiting** on all API endpoints
- **Environment Variable Validation** with Zod schemas
- **Security Headers** (CSP, HSTS, X-Frame-Options)
- **Input Sanitization** and validation
- **GDPR Compliant** email handling

### 🎨 **Modern UI/UX**
- **Dark/Light Theme** with system preference detection
- **Smooth Animations** with Framer Motion
- **Accessibility First** (WCAG 2.2 AA compliant)
- **Keyboard Navigation** support
- **Screen Reader** optimized

## 🚀 **Quick Start**

### Prerequisites
- **Node.js** >= 20.18.0
- **npm** >= 10.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chezik-nextjs.git
cd chezik-nextjs

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## 🔧 **Environment Setup**

### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=hello@chezik.eu
RESEND_FROM_NAME="John Chezik"

# Website Configuration
NEXT_PUBLIC_BASE_URL=https://chezik.eu
NEXT_PUBLIC_SITE_NAME="John Chezik"

# Security Keys (Generate secure random strings)
EMAIL_SECRET=your_secure_random_string_32_chars_minimum
UNSUBSCRIBE_SECRET=your_secure_unsubscribe_secret_32_chars
PREFERENCES_SECRET=your_secure_preferences_secret_32_chars
```

### Optional Environment Variables

```env
# Vercel Services (Optional)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
KV_REST_API_URL=https://your-kv-store.kv.vercel-storage.com
KV_REST_API_TOKEN=your_kv_token_here

# Verification Codes (Optional)
GOOGLE_VERIFICATION_CODE=your_google_verification_code
YANDEX_VERIFICATION_CODE=your_yandex_verification_code
YAHOO_VERIFICATION_CODE=your_yahoo_verification_code

# Contact Information (Optional)
CONTACT_EMAIL=media@chezik.eu
CONTACT_PHONE=+1-XXX-XXX-XXXX
```

## 📁 **Project Structure**

```
chezik-nextjs/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # API routes
│   │   │   ├── audio/         # Audio streaming & analytics
│   │   │   ├── contact/       # Contact form handling
│   │   │   ├── email/         # Email management
│   │   │   ├── newsletter/    # Newsletter subscription
│   │   │   └── search/        # Site search functionality
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── AlbumsSection.tsx  # Music albums display
│   │   ├── BooksSection.tsx   # Books showcase
│   │   ├── BlogSection.tsx    # Blog posts
│   │   ├── ContactSection.tsx # Contact form
│   │   ├── Footer.tsx         # Site footer
│   │   ├── Hero.tsx           # Hero section
│   │   ├── Navigation.tsx     # Main navigation
│   │   ├── PhotoGallery.tsx   # Photo gallery
│   │   └── SimpleAudioPlayer.tsx # Audio player
│   ├── lib/                   # Utility libraries
│   │   ├── audio/             # Audio handling
│   │   ├── email/             # Email services
│   │   ├── env/               # Environment validation
│   │   ├── hooks/             # Custom React hooks
│   │   ├── monitoring/        # Analytics & monitoring
│   │   ├── security/          # Security utilities
│   │   └── storage/           # Storage services
│   ├── styles/                # CSS files
│   │   ├── audio.css          # Audio player styles
│   │   ├── components.css     # Component styles
│   │   ├── layout.css         # Layout styles
│   │   ├── responsive.css     # Responsive utilities
│   │   └── sections.css       # Section-specific styles
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
│   ├── audio/                 # Audio files
│   ├── images/                # Images
│   └── icons/                 # Icons & favicons
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vercel.json                # Vercel deployment config
└── package.json               # Dependencies & scripts
```

## 🛠 **Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run typecheck        # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing & Analysis
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run Playwright tests
npm run test:coverage    # Generate test coverage
npm run analyze          # Bundle size analysis
npm run perf             # Lighthouse performance audit

# Pre-commit
npm run pre-commit       # Run all quality checks
```

## 🎯 **Performance Metrics**

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID (First Input Delay)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅
- **FCP (First Contentful Paint)**: < 1.8s ✅
- **TTI (Time to Interactive)**: < 3.8s ✅

### Bundle Sizes
- **Main Bundle**: ~155KB (gzipped)
- **Vendor Chunks**: Optimized for caching
- **Audio Assets**: Lazy-loaded with streaming
- **Images**: WebP/AVIF with responsive sizing

## 🔒 **Security Features**

- **Rate Limiting**: API endpoints protected against abuse
- **Input Validation**: Zod schemas for all user inputs
- **Security Headers**: Comprehensive security policy
- **Environment Validation**: Runtime checks for required variables
- **CORS Protection**: Proper cross-origin resource sharing
- **XSS Prevention**: Content Security Policy implementation

## 📱 **Responsive Breakpoints**

```css
/* Mobile First Approach */
xs: 320px    /* Extra small devices (phones) */
sm: 640px    /* Small devices (large phones) */
md: 768px    /* Medium devices (tablets) */
lg: 1024px   /* Large devices (desktops) */
xl: 1280px   /* Extra large devices (large desktops) */
2xl: 1600px  /* 2X large devices (prevents stretching on 40"+ monitors) */
```

## 🌐 **Browser Support**

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Safari** 14+
- **Chrome Mobile** 90+

## 🚀 **Deployment**

### Vercel (Recommended)

1. **Connect Repository**
   - Import from GitHub
   - Select main branch
   - Framework: Next.js (auto-detected)

2. **Set Environment Variables**
   - Copy from `.env.example`
   - Set for Production, Preview, and Development

3. **Deploy**
   - Automatic deployment on push to main
   - Preview deployments for pull requests

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm run start
```

## 📊 **Analytics & Monitoring**

- **Vercel Analytics**: Real user monitoring
- **Custom Analytics**: Audio play tracking
- **Performance Monitoring**: Core Web Vitals
- **Error Tracking**: Client-side error boundaries
- **User Behavior**: Engagement metrics

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Ensure accessibility compliance
- Optimize for performance

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍🎤 **About John Chezik**

John Chezik is a platinum-selling songwriter, singer, and guitar player with decades of experience in the music industry. This website showcases his musical journey, albums, books, and provides a platform for fans to connect and enjoy his work.

## 📞 **Support**

For support, email [media@chezik.eu](mailto:media@chezik.eu) or create an issue in this repository.

---

**Built with ❤️ by John Chezik**

*Professional music website featuring modern web technologies and exceptional user experience.*