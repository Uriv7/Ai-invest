import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connection";
import { Research } from "@/lib/db/models/Research";

export async function GET() {
  try {
    await dbConnect();

    // Fetch the 20 most recent research results
    const history = await Research.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch research history" },
      { status: 500 }
    );
  }
}
