import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";
import { generateCompanyVerificationToken } from "./tokens";
import crypto from "crypto";
import { sendCompanyRegistrationEmail } from "./nodemailer";

export async function POST(request: Request) {
  try {
    const { companyName, adminName, adminEmail, productId } =
      await request.json();

    // Generate verification token
    const verificationToken = generateCompanyVerificationToken(
      crypto.randomBytes(16).toString("hex"),
      adminEmail
    );

    // Create payload with registration data
    const payload = {
      companyName,
      adminName,
      adminEmail,
      token: verificationToken,
      productId,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    };

    // Encode the payload for the URL
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );

    // Generate verification link with encoded payload
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/setup-password?data=${encodedPayload}`;

    console.log(`Verification link for ${adminEmail}: ${verificationLink}`);

    // Send verification email
    const emailSent = await sendCompanyRegistrationEmail(
      adminEmail,
      verificationLink,
      companyName,
      adminName
    );

    return NextResponse.json({
      success: true,
      message:
        "Registration initiated. Please check your email to verify and set your password.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to register company",
      },
      { status: 400 }
    );
  }
}
