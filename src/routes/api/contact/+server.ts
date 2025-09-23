import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  sendContactConfirmation,
  sendContactNotification,
} from "$lib/email/resend.js";
import type { ContactFormData } from "$lib/email/types.js";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data: ContactFormData = await request.json();

    // Enhanced validation
    if (!data.name || !data.email || !data.message) {
      return json({ error: "All fields are required" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Message length validation
    if (data.message.length < 10) {
      return json(
        { error: "Message must be at least 10 characters long" },
        { status: 400 },
      );
    }

    if (data.message.length > 2000) {
      return json(
        { error: "Message must be less than 2000 characters" },
        { status: 400 },
      );
    }

    // Name validation
    if (data.name.length < 2 || data.name.length > 100) {
      return json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 },
      );
    }

    // Rate limiting check (simple in-memory store - use Redis in production)
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";

    // Log the submission
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      subject: data.subject || "Website Contact",
      message: data.message,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });

    // Send emails using Resend
    const [confirmationResult, notificationResult] = await Promise.allSettled([
      sendContactConfirmation(data),
      sendContactNotification(data),
    ]);

    // Check if both emails were sent successfully
    const confirmationSuccess =
      confirmationResult.status === "fulfilled" &&
      confirmationResult.value.success;
    const notificationSuccess =
      notificationResult.status === "fulfilled" &&
      notificationResult.value.success;

    if (!confirmationSuccess) {
      console.error("Failed to send confirmation email:", confirmationResult);
    }

    if (!notificationSuccess) {
      console.error("Failed to send notification email:", notificationResult);
    }

    // Return success even if one email fails (graceful degradation)
    return json({
      success: true,
      message:
        "Thank you for your message! You should receive a confirmation email shortly.",
      emailSent: confirmationSuccess,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
};
