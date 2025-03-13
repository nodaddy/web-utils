import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function GET(req: NextRequest, { params }) {
  try {
    // Ensure params is properly awaited and accessed
    const { companyId } = params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Get the company document from Firestore
    const companyDoc = await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .get();

    if (!companyDoc.exists) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const companyData = companyDoc.data();

    return NextResponse.json({
      companyId: companyDoc.id,
      companyName: companyData?.companyName || "Company",
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Failed to fetch company information" },
      { status: 500 }
    );
  }
}
