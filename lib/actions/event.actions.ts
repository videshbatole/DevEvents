"use server";

import { Event, IEvent } from "@/database";
import { connectToDatabase } from "../mongodb";
import { event } from "next/dist/build/output/log";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectToDatabase();
    const event = await Event.findOne({ slug });
    if (!event) {
      return [];
    }
    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
    return similarEvents.map((doc) => JSON.parse(JSON.stringify(doc)));
  } catch (error) {
    return [];
  }
};
