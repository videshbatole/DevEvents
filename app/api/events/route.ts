import { Event } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { error } from "next/dist/build/output/log";
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json({
        message: "Invalid Data json Formate ",
        status: 400,
      });
    }

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image is required " },
        { status: 400 },
      );
    }

    let tags = JSON.parse(formData.get("tags") as string);
    let agenda = JSON.parse(formData.get("agenda") as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResults = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "DevEvents",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(buffer);
    });

    event.image = (uploadResults as { secure_url: string }).secure_url;
    const createEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });

    return NextResponse.json({
      massege: "Event Created Successfully",
      event: createEvent,
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      messge: "Event Creation faild ",
      error: error instanceof Error ? error.message : "unknown",
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "events fetched successfully", events },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Events fetching  faild ", error: error },
      { status: 500 },
    );
  }
}
