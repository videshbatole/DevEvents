import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Interface representing an Event document in MongoDB.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * String fields that must be present and non-empty.
 */
type RequiredStringField =
  | "title"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer";

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, index: true, trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    overview: { type: String, required: [true, "Overview is required"], trim: true },
    image: { type: String, required: [true, "Image is required"], trim: true },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    date: { type: String, required: [true, "Date is required"], trim: true },
    time: { type: String, required: [true, "Time is required"], trim: true },
    mode: { type: String, required: [true, "Mode is required"], trim: true },
    audience: { type: String, required: [true, "Audience is required"], trim: true },
    agenda: { type: [String], required: [true, "Agenda is required"], default: [] },
    organizer: { type: String, required: [true, "Organizer is required"], trim: true },
    tags: { type: [String], required: [true, "Tags are required"], default: [] },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: generates a URL-friendly slug from the title (only when
 * the title changes), normalizes the date to ISO YYYY-MM-DD, ensures the
 * time is stored as 24-hour HH:MM, and validates all required fields.
 */
EventSchema.pre("save", async function () {
  const doc = this;

  // Regenerate slug only when the title is new or has changed
  if (doc.isModified("title")) {
    doc.slug = doc.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Normalize date to ISO YYYY-MM-DD format
  if (doc.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.date)) {
      const parsed = new Date(doc.date);
      if (isNaN(parsed.getTime())) {
        throw new Error("Invalid date value");
      }
      doc.date = parsed.toISOString().split("T")[0];
    }
  }

  // Normalize time to consistent 24-hour HH:MM format
  if (doc.time) {
    const match = doc.time.trim().match(/^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i);
    if (!match) {
      throw new Error("Invalid time format. Expected HH:MM or HH:MM AM/PM");
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const meridian = match[3]?.toUpperCase();

    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    if (hours < 0 || hours > 23 || parseInt(minutes, 10) > 59) {
      throw new Error("Invalid time value");
    }

    doc.time = `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  // Validate required string fields are present and non-empty
  const requiredStrings: RequiredStringField[] = [
    "title", "description", "overview", "image", "venue",
    "location", "date", "time", "mode", "audience", "organizer",
  ];
  for (const field of requiredStrings) {
    const value = doc[field];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${field} is required and cannot be empty`);
    }
  }

  // Validate agenda is a non-empty array of non-empty strings
  if (!Array.isArray(doc.agenda) || doc.agenda.length === 0) {
    throw new Error("Agenda is required and cannot be empty");
  }
  for (const item of doc.agenda) {
    if (typeof item !== "string" || item.trim() === "") {
      throw new Error("Agenda items must be non-empty strings");
    }
  }

  // Validate tags is a non-empty array of non-empty strings
  if (!Array.isArray(doc.tags) || doc.tags.length === 0) {
    throw new Error("Tags are required and cannot be empty");
  }
  for (const item of doc.tags) {
    if (typeof item !== "string" || item.trim() === "") {
      throw new Error("Tag items must be non-empty strings");
    }
  }
});

/**
 * Reuse the existing Event model if already registered to prevent
 * "OverwriteModelError" during Next.js hot reloads in development.
 */
export const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>("Event", EventSchema);
