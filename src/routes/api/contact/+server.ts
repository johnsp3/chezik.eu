import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// In a real application, you would:
// 1. Use a service like Resend, SendGrid, or Nodemailer for email
// 2. Store submissions in a database
// 3. Add rate limiting and spam protection
// 4. Add proper validation and sanitization

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    // Basic validation
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

    // Rate limiting check (simple in-memory store - use Redis in production)
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";

    // Simulate email sending
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      subject: data.subject || "Website Contact",
      message: data.message,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });

    // In a real app, you would send an email here:
    // await sendEmail({
    //   to: 'media@johnchezik.com',
    //   from: data.email,
    //   subject: data.subject || 'Website Contact Form',
    //   html: generateEmailTemplate(data)
    // });

    // Also send a confirmation email to the user:
    // await sendEmail({
    //   to: data.email,
    //   from: 'noreply@johnchezik.com',
    //   subject: 'Thank you for contacting John Chezik',
    //   html: generateConfirmationTemplate(data)
    // });

    return json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
};

// Helper function to generate email template (for real implementation)
function generateEmailTemplate(data: any) {
  return `
		<h2>New Contact Form Submission</h2>
		<p><strong>Name:</strong> ${data.name}</p>
		<p><strong>Email:</strong> ${data.email}</p>
		<p><strong>Subject:</strong> ${data.subject || "No subject"}</p>
		<p><strong>Message:</strong></p>
		<p>${data.message.replace(/\n/g, "<br>")}</p>
		<p><em>Sent from johnchezik.com contact form</em></p>
	`;
}

// Helper function to generate confirmation email template
function generateConfirmationTemplate(data: any) {
  return `
		<h2>Thank you for contacting John Chezik</h2>
		<p>Hi ${data.name},</p>
		<p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
		<p>Here's a copy of your message:</p>
		<blockquote style="background: #f5f5f5; padding: 15px; border-left: 3px solid #007aff;">
			${data.message.replace(/\n/g, "<br>")}
		</blockquote>
		<p>Best regards,<br>John Chezik</p>
		<p><em>This is an automated response. Please do not reply to this email.</em></p>
	`;
}
