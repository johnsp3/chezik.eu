# John Chezik Music Website - Next.js 15

A modern, high-performance music website built with Next.js 15, featuring advanced audio streaming, HLS support, and enterprise-grade analytics.

## 🚀 Features

### Audio System
- **HLS Streaming**: HTTP Live Streaming for instant audio previews
- **Adaptive Bitrate**: Automatic quality adjustment based on network conditions
- **Advanced Analytics**: Comprehensive tracking of user listening behavior
- **Performance Monitoring**: Real-time metrics for audio playback
- **Mobile Optimization**: Touch-optimized controls with Web Audio API

### Technical Stack
- **Next.js 15**: Latest version with App Router and Edge Runtime
- **TypeScript**: Full type safety across the entire application
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **HLS.js**: Professional-grade streaming library
- **Resend**: Email service integration
- **Vercel**: Optimized deployment with edge functions

### Performance
- **Edge Functions**: Global audio streaming endpoints
- **Vercel Blob**: CDN-optimized audio file storage
- **Streaming SSR**: Progressive page loading
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Built-in performance monitoring

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── audio/         # Audio streaming endpoints
│   │   └── contact/       # Contact form handling
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AlbumsSection.tsx  # Music albums display
│   ├── AudioPlayer.tsx    # Advanced audio player
│   └── ...                # Other components
├── lib/                   # Utility libraries
│   ├── audio/             # Audio service and utilities
│   └── email/             # Email service integration
└── types/                 # TypeScript type definitions
    └── audio.ts           # Audio system types
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chezik-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_BASE_URL=https://chezik.eu
   RESEND_API_KEY=your_resend_api_key
   EMAIL_SECRET=your_email_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎵 Audio System

### HLS Streaming
The audio system supports HTTP Live Streaming for optimal performance:

```typescript
// Audio track with HLS support
const track: AudioTrack = {
  id: 1,
  title: "Don't Say It's Over",
  audioFile: "/audio/track.mp3",
  hlsUrl: "/api/audio/stream/1", // HLS endpoint
  format: 'hls'
};
```

### Analytics Integration
Comprehensive analytics tracking:

```typescript
// Analytics events are automatically tracked
audioService.onEvent((event) => {
  console.log('Audio event:', event);
  // Events include: play, pause, seek, volume_change, complete, error
});
```

### Performance Monitoring
Real-time performance metrics:

```typescript
const metrics = audioService.getPerformanceMetrics();
console.log('Buffer health:', metrics.bufferHealth);
console.log('Load time:', metrics.loadTime);
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Configure environment variables**
   - `RESEND_API_KEY`: Your Resend API key
   - `EMAIL_SECRET`: Secret for email validation
   - `NEXT_PUBLIC_BASE_URL`: Your domain URL

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Audio File Setup

1. **Upload audio files to Vercel Blob**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Upload files
   vercel blob upload audio/track1.mp3
   ```

2. **Configure HLS streaming**
   - Audio files are automatically served with proper headers
   - HLS segments are generated on-demand
   - CDN caching is optimized for audio content

## 📊 Analytics

### Built-in Analytics
- **Vercel Analytics**: Page views and performance metrics
- **Speed Insights**: Core Web Vitals monitoring
- **Custom Audio Analytics**: Detailed listening behavior tracking

### Analytics Endpoints
- `POST /api/audio/analytics`: Submit audio events
- `GET /api/audio/analytics`: Get analytics summary

## 🎨 Customization

### Styling
The project uses Tailwind CSS with a custom design system:

```css
/* Custom CSS variables */
:root {
  --color-accent-primary: #007aff;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

### Audio Player
Customize the audio player behavior:

```typescript
const config: AudioPlayerConfig = {
  streaming: {
    useHLS: true,
    adaptiveBitrate: true,
    bufferSize: 30,
    maxBufferLength: 60
  },
  analytics: {
    enabled: true,
    batchSize: 10,
    flushInterval: 5000
  }
};
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run analyze      # Analyze bundle size
```

### Code Quality
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks for quality assurance

## 📱 Mobile Optimization

### Touch Controls
- Optimized touch targets (44px minimum)
- Gesture support for audio controls
- Responsive design for all screen sizes

### Performance
- Lazy loading for audio files
- Progressive enhancement
- Offline support with service workers

## 🔒 Security

### API Security
- Rate limiting on contact forms
- Input validation and sanitization
- CORS configuration for audio endpoints

### Content Security
- Content Security Policy headers
- XSS protection
- CSRF protection for forms

## 📈 Performance Metrics

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Audio Performance
- **Load Time**: < 1s for audio metadata
- **Seek Time**: < 100ms for seeking
- **Buffer Health**: > 80% optimal

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: john@chezik.eu
- Website: https://chezik.eu

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Vercel**: For the deployment platform
- **HLS.js**: For the streaming library
- **Tailwind CSS**: For the utility-first CSS framework
