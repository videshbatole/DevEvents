import { Event } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const sanitizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) {
      return NextResponse.json(
        { message: "Invalid Event slug" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const event = await Event.findOne({ slug: sanitizedSlug });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event: event },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { message: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
