import { Resend } from "resend";
import { RESEND_API_KEY, FROM_EMAIL, CONTACT_EMAIL } from "$env/static/private";
import type {
  ContactFormData,
  NewsletterSignupData,
  ResendResponse,
} from "./types.js";
import {
  generateContactConfirmationEmail,
  generateContactNotificationEmail,
  generateNewsletterWelcomeEmail,
} from "./templates.js";

// Initialize Resend with API key
const resend = new Resend(RESEND_API_KEY);

export async function sendContactConfirmation(
  data: ContactFormData,
): Promise<ResendResponse> {
  try {
    const emailTemplate = generateContactConfirmationEmail(data);

    const result = await resend.emails.send({
      from: `John Chezik <${FROM_EMAIL}>`,
      to: [data.email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      headers: {
        'X-Mailer': 'John Chezik Website',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
    });

    if (result.error) {
      console.error("Resend contact confirmation error:", result.error);
      return {
        success: false,
        message: "Failed to send confirmation email",
        error: result.error.message,
      };
    }

    console.log("Contact confirmation email sent:", result.data?.id);
    return {
      success: true,
      message: "Confirmation email sent successfully",
    };
  } catch (error) {
    console.error("Contact confirmation email error:", error);
    return {
      success: false,
      message: "Failed to send confirmation email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendContactNotification(
  data: ContactFormData,
): Promise<ResendResponse> {
  try {
    const emailTemplate = generateContactNotificationEmail(data);
    
    // Ensure CONTACT_EMAIL is properly formatted
    const contactEmail = CONTACT_EMAIL || 'media@chezik.eu';
    console.log('Sending contact notification to:', contactEmail);

    const result = await resend.emails.send({
      from: `John Chezik <${FROM_EMAIL}>`,
      to: [contactEmail],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      replyTo: data.email,
      headers: {
        'X-Mailer': 'John Chezik Website',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
    });

    if (result.error) {
      console.error("Resend contact notification error:", result.error);
      return {
        success: false,
        message: "Failed to send notification email",
        error: result.error.message,
      };
    }

    console.log("Contact notification email sent:", result.data?.id);
    return {
      success: true,
      message: "Notification email sent successfully",
    };
  } catch (error) {
    console.error("Contact notification email error:", error);
    return {
      success: false,
      message: "Failed to send notification email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendNewsletterWelcome(
  data: NewsletterSignupData,
): Promise<ResendResponse> {
  try {
    const emailTemplate = generateNewsletterWelcomeEmail(data);

    const result = await resend.emails.send({
      from: `John Chezik <${FROM_EMAIL}>`,
      to: [data.email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      headers: {
        'X-Mailer': 'John Chezik Website',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
    });

    if (result.error) {
      console.error("Resend newsletter welcome error:", result.error);
      return {
        success: false,
        message: "Failed to send welcome email",
        error: result.error.message,
      };
    }

    console.log("Newsletter welcome email sent:", result.data?.id);
    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  } catch (error) {
    console.error("Newsletter welcome email error:", error);
    return {
      success: false,
      message: "Failed to send welcome email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendNewsletterNotification(
  data: NewsletterSignupData,
): Promise<ResendResponse> {
  try {
    const subject = `New Newsletter Subscription: ${data.email}`;
    const html = `
			<h2>New Newsletter Subscription</h2>
			<p><strong>Email:</strong> ${data.email}</p>
			<p><strong>Source:</strong> ${data.source || "Website"}</p>
			<p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
		`;
    const text = `New Newsletter Subscription\nEmail: ${data.email}\nSource: ${data.source || "Website"}\nTimestamp: ${new Date().toLocaleString()}`;

    // Ensure CONTACT_EMAIL is properly formatted
    const contactEmail = CONTACT_EMAIL || 'media@chezik.eu';
    console.log('Sending newsletter notification to:', contactEmail);

    const result = await resend.emails.send({
      from: `John Chezik <${FROM_EMAIL}>`,
      to: [contactEmail],
      subject,
      html,
      text,
      headers: {
        'X-Mailer': 'John Chezik Website',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
    });

    if (result.error) {
      console.error("Resend newsletter notification error:", result.error);
      return {
        success: false,
        message: "Failed to send newsletter notification",
        error: result.error.message,
      };
    }

    console.log("Newsletter notification email sent:", result.data?.id);
    return {
      success: true,
      message: "Newsletter notification sent successfully",
    };
  } catch (error) {
    console.error("Newsletter notification email error:", error);
    return {
      success: false,
      message: "Failed to send newsletter notification",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
