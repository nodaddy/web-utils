import { NextResponse } from "next/server";
import { verifyEmailConfig, sendEmail } from "../auth/register/nodemailer";

export async function GET() {
  try {
    // Check email configuration
    const isConfigValid = await verifyEmailConfig();

    // Log environment variables (without sensitive values)
    const envVars = {
      EMAIL_HOST: process.env.EMAIL_HOST || "not set",
      EMAIL_PORT: process.env.EMAIL_PORT || "not set",
      EMAIL_SECURE: process.env.EMAIL_SECURE || "not set",
      EMAIL_USER: process.env.EMAIL_USER ? "set (value hidden)" : "not set",
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
        ? "set (value hidden)"
        : "not set",
      EMAIL_FROM: process.env.EMAIL_FROM || "not set",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "not set",
    };

    console.log("Email configuration environment variables:", envVars);

    if (!isConfigValid) {
      return NextResponse.json({
        success: false,
        message:
          "Email configuration is invalid. Check server logs for details.",
        envVars,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Email configuration is valid.",
      envVars,
    });
  } catch (error) {
    console.error("Error testing email configuration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email address is required",
        },
        { status: 400 }
      );
    }

    // Check email configuration
    const isConfigValid = await verifyEmailConfig();
    if (!isConfigValid) {
      return NextResponse.json({
        success: false,
        message:
          "Email configuration is invalid. Check server logs for details.",
      });
    }

    // Send a test email
    const subject = "Test Email from Nexonware";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Test Email</h2>
        <p>This is a test email from Nexonware to verify that email sending is working correctly.</p>
        <p>If you received this email, it means the email configuration is working properly.</p>
      </div>
    `;
    const text = `
      Test Email
      
      This is a test email from Nexonware to verify that email sending is working correctly.
      
      If you received this email, it means the email configuration is working properly.
    `;

    const emailSent = await sendEmail(email, subject, html, text);

    if (!emailSent) {
      return NextResponse.json({
        success: false,
        message: "Failed to send test email. Check server logs for details.",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}. Please check your inbox (and spam folder).`,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
