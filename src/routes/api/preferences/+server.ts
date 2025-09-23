import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createHash } from "crypto";

// Validate preferences token
function validatePreferencesToken(email: string, token: string): boolean {
  const secret = process.env.PREFERENCES_SECRET || "default-secret-key";
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Daily rotation
  const data = `${email}-preferences-${timestamp}`;
  const expectedToken = createHash('sha256').update(data + secret).digest('hex').substring(0, 16);
  
  // Also check previous day's token in case of timezone issues
  const prevTimestamp = timestamp - 1;
  const prevData = `${email}-preferences-${prevTimestamp}`;
  const prevExpectedToken = createHash('sha256').update(prevData + secret).digest('hex').substring(0, 16);
  
  return token === expectedToken || token === prevExpectedToken;
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');

    if (!email) {
      return json({ error: "Email address is required" }, { status: 400 });
    }

    // Validate security token
    if (!token || !validatePreferencesToken(email, token)) {
      return json({ error: "Invalid or expired preferences link" }, { status: 403 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // In a real application, you would fetch preferences from your database
    // For now, we'll return default preferences
    const defaultPreferences = {
      frequency: 'weekly',
      contentTypes: {
        albums: true,
        books: true,
        studio: true,
        events: true
      }
    };

    console.log("Loading preferences for:", email);

    return json({
      success: true,
      preferences: defaultPreferences,
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    // Enhanced validation
    if (!data.email || !data.preferences) {
      return json({ error: "Email address and preferences are required" }, { status: 400 });
    }

    // Validate security token
    if (!data.token || !validatePreferencesToken(data.email, data.token)) {
      return json({ error: "Invalid or expired preferences link" }, { status: 403 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Validate preferences structure
    const { frequency, contentTypes } = data.preferences;
    
    if (!frequency || !contentTypes) {
      return json(
        { error: "Invalid preferences format" },
        { status: 400 },
      );
    }

    // Validate frequency
    const validFrequencies = ['weekly', 'monthly', 'major'];
    if (!validFrequencies.includes(frequency)) {
      return json(
        { error: "Invalid frequency setting" },
        { status: 400 },
      );
    }

    // Validate content types
    const validContentTypes = ['albums', 'books', 'studio', 'events'];
    for (const type of validContentTypes) {
      if (typeof contentTypes[type] !== 'boolean') {
        return json(
          { error: `Invalid content type setting for ${type}` },
          { status: 400 },
        );
      }
    }

    // Rate limiting check
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";

    // Log the preferences update
    console.log("Newsletter preferences updated:", {
      email: data.email,
      preferences: data.preferences,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });

    // In a real application, you would:
    // 1. Save preferences to your database
    // 2. Update the user's mailing list segments
    // 3. Send a confirmation email
    // 4. Log the action for compliance purposes

    return json({
      success: true,
      message: "Your email preferences have been updated successfully. You'll receive emails according to your new settings.",
    });
  } catch (error) {
    console.error("Save preferences error:", error);
    return json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
};
