import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  sendNewsletterWelcome,
  sendNewsletterNotification,
} from "$lib/email/resend.js";
import type { NewsletterSignupData } from "$lib/email/types.js";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data: NewsletterSignupData = await request.json();

    // Enhanced validation
    if (!data.email) {
      return json({ error: "Email address is required" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Email length validation
    if (data.email.length > 254) {
      return json({ error: "Email address is too long" }, { status: 400 });
    }

    // Rate limiting check
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";

    // Log the subscription
    console.log("Newsletter subscription:", {
      email: data.email,
      timestamp: new Date().toISOString(),
      ip: clientIP,
      source: data.source || "website",
    });

    // Send emails using Resend
    const [welcomeResult, notificationResult] = await Promise.allSettled([
      sendNewsletterWelcome(data),
      sendNewsletterNotification(data),
    ]);

    // Check if both emails were sent successfully
    const welcomeSuccess =
      welcomeResult.status === "fulfilled" && welcomeResult.value.success;
    const notificationSuccess =
      notificationResult.status === "fulfilled" &&
      notificationResult.value.success;

    if (!welcomeSuccess) {
      console.error("Failed to send welcome email:", welcomeResult);
    }

    if (!notificationSuccess) {
      console.error("Failed to send notification email:", notificationResult);
    }

    // Return success even if one email fails (graceful degradation)
    return json({
      success: true,
      message:
        "Thanks for subscribing! You should receive a welcome email shortly.",
      emailSent: welcomeSuccess,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
};
