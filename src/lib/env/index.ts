/**
 * Environment Variable Validation and Runtime Checks
 * 
 * Comprehensive environment variable validation system that prevents application
 * startup with missing required environment variables. This ensures deployment
 * safety and provides clear error messages for missing configuration.
 * 
 * @fileoverview Environment variable validation with runtime checks
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 * 
 * @example
 * ```tsx
 * import { validateEnvironment, getRequiredEnv } from '@/lib/env';
 * 
 * // Validate all environment variables at startup
 * validateEnvironment();
 * 
 * // Get required environment variable with type safety
 * const apiKey = getRequiredEnv('RESEND_API_KEY');
 * ```
 */

import { z } from 'zod';

/**
 * Environment variable validation schema
 */
const EnvironmentSchema = z.object({
  // Required environment variables (only in production)
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required for email functionality').optional(),
  VERCEL_BLOB_READ_WRITE_TOKEN: z.string().min(1, 'VERCEL_BLOB_READ_WRITE_TOKEN is required for file storage').optional(),
  VERCEL_KV_REST_API_URL: z.string().min(1, 'VERCEL_KV_REST_API_URL is required for caching').optional(),
  VERCEL_KV_REST_API_TOKEN: z.string().min(1, 'VERCEL_KV_REST_API_TOKEN is required for KV authentication').optional(),
  
  // Optional environment variables with defaults
  NEXT_PUBLIC_BASE_URL: z.string().url().default('https://chezik.eu'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('John Chezik'),
  FROM_EMAIL: z.string().email().default('noreply@chezik.eu'),
  CONTACT_EMAIL: z.string().email().default('media@chezik.eu'),
  EMAIL_SECRET: z.string().min(32).default('default-email-secret-key-32-chars-minimum'),
  UNSUBSCRIBE_SECRET: z.string().min(32).default('default-unsubscribe-secret-key-32-chars'),
  PREFERENCES_SECRET: z.string().min(32).default('default-preferences-secret-key-32-chars'),
  
  // Optional verification codes
  GOOGLE_VERIFICATION_CODE: z.string().optional(),
  YANDEX_VERIFICATION_CODE: z.string().optional(),
  YAHOO_VERIFICATION_CODE: z.string().optional(),
  
  // Optional contact information
  CONTACT_PHONE: z.string().optional(),
  
  // Optional analytics
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID: z.string().optional(),
  
  // Build configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_TELEMETRY_DISABLED: z.string().default('1'),
  ANALYZE: z.string().default('false'),
});

/**
 * Type for validated environment variables
 */
export type Environment = z.infer<typeof EnvironmentSchema>;

/**
 * Validated environment variables (populated after validation)
 */
let validatedEnv: Environment | null = null;

/**
 * Validates all environment variables and throws an error if any required variables are missing
 * 
 * This function should be called at application startup to ensure all required
 * environment variables are present before the application starts.
 * 
 * @throws {Error} If any required environment variables are missing or invalid
 * 
 * @example
 * ```tsx
 * // Call this at the top of your app initialization
 * validateEnvironment();
 * ```
 */
export function validateEnvironment(): void {
  try {
    validatedEnv = EnvironmentSchema.parse(process.env);
    
    // In production, check for required variables
    // Note: During build, NODE_ENV is 'production' but we're not actually deployed yet
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
      const requiredVars = [
        'RESEND_API_KEY',
        'VERCEL_BLOB_READ_WRITE_TOKEN', 
        'VERCEL_KV_REST_API_URL',
        'VERCEL_KV_REST_API_TOKEN'
      ];
      
      const missingVars = requiredVars.filter(varName => !validatedEnv![varName as keyof Environment]);
      
      if (missingVars.length > 0) {
        const errorMessage = `❌ Production environment validation failed:\n\nMissing required variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\nPlease ensure all required variables are set in your Vercel environment.\nSee env.example for reference.`;
        throw new Error(errorMessage);
      }
    }
    
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const invalidVars = error.issues
        .map(err => `${err.path.join('.')}: ${err.message}`);
      
      let errorMessage = '❌ Environment validation failed:\n';
      errorMessage += `\nInvalid variables:\n${invalidVars.map(v => `  - ${v}`).join('\n')}`;
      errorMessage += '\n\nPlease check your .env.local file and ensure all variables are valid.';
      errorMessage += '\nSee env.example for reference.';
      
      throw new Error(errorMessage);
    }
    throw error;
  }
}

/**
 * Gets a required environment variable with type safety
 * 
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws {Error} If the environment variable is not set
 * 
 * @example
 * ```tsx
 * const apiKey = getRequiredEnv('RESEND_API_KEY');
 * ```
 */
export function getRequiredEnv<K extends keyof Environment>(key: K): Environment[K] {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  
  const value = validatedEnv[key];
  if (value === undefined || value === '') {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
}

/**
 * Gets an optional environment variable with type safety
 * 
 * @param key - The environment variable key
 * @param defaultValue - Default value if the variable is not set
 * @returns The environment variable value or default
 * 
 * @example
 * ```tsx
 * const baseUrl = getOptionalEnv('NEXT_PUBLIC_BASE_URL', 'https://chezik.eu');
 * ```
 */
export function getOptionalEnv<K extends keyof Environment>(
  key: K,
  defaultValue?: Environment[K]
): Environment[K] | undefined {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  
  return validatedEnv[key] ?? defaultValue;
}

/**
 * Gets all validated environment variables
 * 
 * @returns The complete validated environment object
 * @throws {Error} If environment has not been validated
 * 
 * @example
 * ```tsx
 * const env = getEnvironment();
 * console.log(env.NEXT_PUBLIC_BASE_URL);
 * ```
 */
export function getEnvironment(): Environment {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  
  return validatedEnv;
}

/**
 * Checks if the application is running in production
 * 
 * @returns True if running in production
 * 
 * @example
 * ```tsx
 * if (isProduction()) {
 *   // Production-only code
 * }
 * ```
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Checks if the application is running in development
 * 
 * @returns True if running in development
 * 
 * @example
 * ```tsx
 * if (isDevelopment()) {
 *   // Development-only code
 * }
 * ```
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Gets the base URL for the application
 * 
 * @returns The base URL with proper protocol and domain
 * 
 * @example
 * ```tsx
 * const baseUrl = getBaseUrl();
 * // Returns: https://chezik.eu
 * ```
 */
export function getBaseUrl(): string {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  
  return validatedEnv.NEXT_PUBLIC_BASE_URL;
}

/**
 * Gets the site name
 * 
 * @returns The site name
 * 
 * @example
 * ```tsx
 * const siteName = getSiteName();
 * // Returns: John Chezik
 * ```
 */
export function getSiteName(): string {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  
  return validatedEnv.NEXT_PUBLIC_SITE_NAME;
}

/**
 * Gets email configuration
 * 
 * @returns Object containing email configuration
 * 
 * @example
 * ```tsx
 * const emailConfig = getEmailConfig();
 * console.log(emailConfig.fromEmail); // noreply@chezik.eu
 * ```
 */
export function getEmailConfig() {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  
  return {
    apiKey: validatedEnv.RESEND_API_KEY,
    fromEmail: validatedEnv.FROM_EMAIL,
    contactEmail: validatedEnv.CONTACT_EMAIL,
    emailSecret: validatedEnv.EMAIL_SECRET,
    unsubscribeSecret: validatedEnv.UNSUBSCRIBE_SECRET,
    preferencesSecret: validatedEnv.PREFERENCES_SECRET,
  };
}

/**
 * Gets Vercel configuration
 * 
 * @returns Object containing Vercel configuration
 * 
 * @example
 * ```tsx
 * const vercelConfig = getVercelConfig();
 * console.log(vercelConfig.blobToken); // Vercel blob token
 * ```
 */
export function getVercelConfig() {
  if (!validatedEnv) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  
  return {
    blobToken: validatedEnv.VERCEL_BLOB_READ_WRITE_TOKEN,
    kvUrl: validatedEnv.VERCEL_KV_REST_API_URL,
    kvToken: validatedEnv.VERCEL_KV_REST_API_TOKEN,
    analyticsId: validatedEnv.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    speedInsightsId: validatedEnv.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID,
  };
}
