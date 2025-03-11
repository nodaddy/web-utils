import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Fetch the company document from Firestore
    const companyDoc = await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .get();

    if (!companyDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    const companyData = companyDoc.data();

    return NextResponse.json({
      success: true,
      company: companyData,
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch company",
      },
      { status: 500 }
    );
  }
}
