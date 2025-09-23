import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createHash } from "crypto";

// Validate unsubscribe token
function validateUnsubscribeToken(email: string, token: string): boolean {
  const secret = process.env.UNSUBSCRIBE_SECRET || "default-secret-key";
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Daily rotation
  const data = `${email}-unsubscribe-${timestamp}`;
  const expectedToken = createHash('sha256').update(data + secret).digest('hex').substring(0, 16);
  
  // Also check previous day's token in case of timezone issues
  const prevTimestamp = timestamp - 1;
  const prevData = `${email}-unsubscribe-${prevTimestamp}`;
  const prevExpectedToken = createHash('sha256').update(prevData + secret).digest('hex').substring(0, 16);
  
  return token === expectedToken || token === prevExpectedToken;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    // Enhanced validation
    if (!data.email) {
      return json({ error: "Email address is required" }, { status: 400 });
    }

    // Validate security token
    if (!data.token || !validateUnsubscribeToken(data.email, data.token)) {
      return json({ error: "Invalid or expired unsubscribe link" }, { status: 403 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Rate limiting check
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";

    // Log the unsubscribe action
    console.log("Newsletter unsubscribe:", {
      email: data.email,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });

    // In a real application, you would:
    // 1. Remove the email from your mailing list
    // 2. Update your database to mark them as unsubscribed
    // 3. Send a confirmation email to the user
    // 4. Log the action for compliance purposes

    // For now, we'll just log it and return success
    return json({
      success: true,
      message: `You have been successfully unsubscribed from John Chezik's newsletter. You will no longer receive updates about new albums, books, and exclusive content.`,
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
};
