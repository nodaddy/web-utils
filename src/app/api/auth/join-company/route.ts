import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";
import crypto from "crypto";
import { sendEmail, verifyEmailConfig } from "../register/nodemailer";

// Helper function to send employee invitation email
async function sendEmployeeInvitationEmail(
  to: string,
  setupPasswordLink: string,
  companyName: string
): Promise<boolean> {
  console.log(`Attempting to send invitation email to: ${to}`);
  console.log(`Setup password link: ${setupPasswordLink}`);

  const subject = `Invitation to Join ${companyName} on Nexonware`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Nexonware!</h2>
      <p>Hi there,</p>
      <p>Join <strong>${companyName}</strong> on Nexonware. To finalize your registration and create your password, please click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${setupPasswordLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Create Your Account</a>
      </div>
      <p>Please note that this link will expire in 24 hours for your security.</p>
      <p>If you were not expecting this invitation, feel free to disregard this email.</p>
      <p>Best wishes,<br>The Nexonware Team</p>
    </div>
  `;
  const text = `
    You've Been Invited!
    
    Hello,
    
    You have been invited to join ${companyName} on Nexonware. To complete your registration and set up your password, please visit the following link:
    
    ${setupPasswordLink}
    
    This link will expire in 24 hours for security reasons.
    
    If you did not expect this invitation, please ignore this email.
    
    Best regards,
    The Nexonware Team
  `;

  return sendEmail(to, subject, html, text);
}

export async function POST(request: Request) {
  try {
    console.log("Starting join-company process");

    // Verify email configuration first
    const isEmailConfigValid = await verifyEmailConfig();
    if (!isEmailConfigValid) {
      console.error(
        "Email configuration is invalid. Check your environment variables."
      );
      return NextResponse.json(
        { error: "Email service is not properly configured" },
        { status: 500 }
      );
    }

    const { email, companyId } = await request.json();
    console.log(
      `Processing invitation for email: ${email}, company: ${companyId}`
    );

    if (!email || !companyId) {
      console.log("Missing required fields: email or companyId");
      return NextResponse.json(
        { error: "Email and company ID are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`Invalid email format: ${email}`);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if the company exists
    console.log(`Checking if company exists: ${companyId}`);
    const companyDoc = await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .get();

    if (!companyDoc.exists) {
      console.log(`Company not found: ${companyId}`);
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    console.log(`Company found: ${companyId}`);

    const companyData = companyDoc.data();
    console.log(`Company name: ${companyData?.companyName || "Unknown"}`);

    // Check if a user with this email already exists and has a company
    let userHasCompany = false;

    try {
      console.log(`Checking if user exists: ${email}`);
      const existingUser = await admin.auth().getUserByEmail(email);
      console.log(`User exists with UID: ${existingUser.uid}`);

      const userCustomClaims = existingUser.customClaims || {};

      if (userCustomClaims.companyId) {
        // User already belongs to a company
        console.log(
          `User already belongs to company: ${userCustomClaims.companyId}`
        );
        userHasCompany = true;
        return NextResponse.json(
          { error: "This email is already registered with a company" },
          { status: 400 }
        );
      }

      // If user exists but doesn't have a company, we'll still send them an invitation
      console.log(
        `User exists but has no company. Sending invitation to ${email}`
      );
    } catch (error: any) {
      // If error is auth/user-not-found, that's expected - we'll create a new user when they set up their password
      if (
        error.code === "auth/user-not-found" ||
        (error.message && error.message.includes("auth/user-not-found"))
      ) {
        console.log(
          `User does not exist. Will create when they set up password: ${email}`
        );
      } else {
        // For any other error, log it but continue with the invitation process
        console.error("Error checking existing user:", error);
        console.log("Continuing with invitation process despite error");
      }
    }

    // If we've determined the user already has a company, we've already returned an error response
    if (userHasCompany) {
      return;
    }

    // Generate a token for security
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    console.log(
      `Generated token with expiry: ${new Date(expires).toISOString()}`
    );

    // Create a payload with the necessary information
    const payload = {
      email,
      companyId,
      companyName: companyData?.companyName || "Company",
      token,
      expires,
    };

    // Encode the payload for the URL
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    console.log("Encoded payload for URL");

    // Check if NEXT_PUBLIC_APP_URL is set
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error("NEXT_PUBLIC_APP_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate the password setup link
    const setupPasswordLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/setup-employee-password?data=${encodedPayload}`;
    console.log(
      `Generated setup password link with base URL: ${process.env.NEXT_PUBLIC_APP_URL}`
    );

    // Send the invitation email
    console.log(`Sending invitation email to ${email}`);
    const emailSent = await sendEmployeeInvitationEmail(
      email,
      setupPasswordLink,
      companyData?.companyName || "Company"
    );

    if (!emailSent) {
      console.error(`Failed to send invitation email to ${email}`);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send invitation email.",
        },
        { status: 500 }
      );
    }

    console.log(`Invitation email successfully sent to ${email}`);
    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send invitation",
      },
      { status: 500 }
    );
  }
}
