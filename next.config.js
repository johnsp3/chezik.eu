/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),
  
  // Vercel optimizations
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', '@vercel/analytics', '@vercel/speed-insights'],
  },
  
  // Server external packages (moved from experimental)
  serverExternalPackages: ['hls.js', '@vercel/blob', '@vercel/kv'],
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Image optimization with Vercel enhancements
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chezik.eu',
        port: '',
        pathname: '/**',
      },
    ],
    // Vercel-specific optimizations
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Vercel-optimized headers
  async headers() {
    return [
      // Audio files - long-term caching
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'audio/mpeg',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // API routes - optimized caching
      {
        source: '/api/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Static assets - aggressive caching
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images - optimized caching
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Global security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Vercel-optimized webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Handle audio files
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|m4a)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/audio/',
          outputPath: 'static/audio/',
        },
      },
    });

    // Vercel optimizations
    if (!isServer && !dev) {
      // Optimize bundle splitting for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate audio-related chunks
          audio: {
            test: /[\\/]node_modules[\\/](hls\.js|@vercel\/blob)[\\/]/,
            name: 'audio-vendor',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    return config;
  },

  // Vercel-optimized environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    // Vercel-specific optimizations
    NEXT_TELEMETRY_DISABLED: '1', // Disable telemetry for better performance
  },

  // Vercel-specific optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable compression
  generateEtags: true, // Enable ETags for better caching
  
  // Output configuration for Vercel
  output: 'standalone', // Optimize for Vercel deployment

  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: async (config) => {
      const { BundleAnalyzerPlugin } = (await import('@next/bundle-analyzer')).default();
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
};

export default nextConfig;
