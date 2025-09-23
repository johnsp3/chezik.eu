export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface NewsletterSignupData {
  email: string;
  source?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface ResendResponse {
  success: boolean;
  message: string;
  error?: string;
}
