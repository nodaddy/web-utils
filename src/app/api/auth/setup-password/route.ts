import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

// Interface for the registration payload
interface RegistrationPayload {
  companyName: string;
  adminName: string;
  adminEmail: string;
  token: string;
  expires: number;
  productId?: string;
}

export async function POST(request: Request) {
  try {
    const { registrationData, password } = await request.json();

    if (!registrationData || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = registrationData as RegistrationPayload;

    // Validate the payload
    if (
      !payload.companyName ||
      !payload.adminName ||
      !payload.adminEmail ||
      !payload.token
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid registration data" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (payload.expires < Date.now()) {
      return NextResponse.json(
        { success: false, error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Check if the email is already registered
    // try {
    //   const existingUser = await admin
    //     .auth()
    //     .getUserByEmail(payload.adminEmail);
    //   if (existingUser) {
    //     return NextResponse.json(
    //       { success: false, error: "Email is already registered" },
    //       { status: 400 }
    //     );
    //   }
    // } catch (error) {
    //   // If error is auth/user-not-found, that's good - we want to create a new user
    //   if (
    //     !(error instanceof Error) ||
    //     !error.message.includes("auth/user-not-found")
    //   ) {
    //     console.error("Error checking existing user:", error);
    //     throw error;
    //   }
    // }

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: payload.adminEmail,
      password: password,
      displayName: payload.adminName,
      emailVerified: true, // Email is verified since they clicked the link
    });

    // Create company document in Firestore
    const companyDoc = await admin
      .firestore()
      .collection("companies")
      .add({
        companyName: payload.companyName,
        adminId: userRecord.uid,
        adminEmail: payload.adminEmail,
        adminName: payload.adminName,
        emailDomains: payload.adminEmail.split("@")[1], // Extracting domain from email
        status: "active", // Active since email is verified
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        OwnedNexonwareProductIds: [],
        updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
      });

    // if payload.productId is not null, fetch the product from the database
    if (payload.productId) {
      const product = await admin
        .firestore()
        .collection("products")
        .doc(payload.productId)
        .get();
      if (product.exists) {
        // add the product to the nexonwareProducts collection in company document
        await admin
          .firestore()
          .collection("companies")
          .doc(companyDoc.id)
          .collection("nexonwareProducts")
          .add({
            ...product.data(),
            productId: payload.productId,
            createdAt: admin.firestore.Timestamp.fromDate(new Date()),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
            trialStartData: admin.firestore.Timestamp.fromDate(new Date()),
            isPurchased: false,
          });
      }
    }
    // Set custom claims for admin user
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: "admin",
      companyId: companyDoc.id,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Password setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to setup password",
      },
      { status: 400 }
    );
  }
}
