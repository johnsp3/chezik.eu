/**
 * Environment Variable Validation and Typing
 * 
 * Provides type-safe access to environment variables with proper validation
 * and fallback values for the John Chezik website.
 * 
 * @fileoverview Environment variable utilities with Zod validation and type safety
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 * 
 * @example
 * ```tsx
 * import { getVerificationCodes } from '@/lib/env/verification';
 * 
 * const codes = getVerificationCodes();
 * console.log(codes.google); // string | undefined
 * ```
 */

import { z } from 'zod';

/**
 * Schema for verification codes from environment variables
 */
const VerificationCodesSchema = z.object({
  /** Google Search Console verification code */
  google: z.string().optional(),
  /** Yandex Webmaster verification code */
  yandex: z.string().optional(),
  /** Yahoo Site Explorer verification code */
  yahoo: z.string().optional(),
});

/**
 * Schema for contact information from environment variables
 */
const ContactInfoSchema = z.object({
  /** Contact phone number for business inquiries */
  phone: z.string().optional(),
});

/**
 * Type for verification codes
 */
export type VerificationCodes = z.infer<typeof VerificationCodesSchema>;

/**
 * Type for contact information
 */
export type ContactInfo = z.infer<typeof ContactInfoSchema>;

/**
 * Gets verification codes from environment variables with type safety
 * 
 * @returns Object containing verification codes or undefined values
 * 
 * @example
 * ```tsx
 * const codes = getVerificationCodes();
 * if (codes.google) {
 *   // Use Google verification code
 * }
 * ```
 */
export function getVerificationCodes(): VerificationCodes {
  return VerificationCodesSchema.parse({
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  });
}

/**
 * Gets contact information from environment variables with type safety
 * 
 * @returns Object containing contact information or undefined values
 * 
 * @example
 * ```tsx
 * const contact = getContactInfo();
 * const phone = contact.phone ?? '+1-XXX-XXX-XXXX';
 * ```
 */
export function getContactInfo(): ContactInfo {
  return ContactInfoSchema.parse({
    phone: process.env.CONTACT_PHONE,
  });
}
