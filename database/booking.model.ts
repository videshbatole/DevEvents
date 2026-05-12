import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Interface representing a Booking document in MongoDB.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: verify the referenced Event exists before persisting.
 * This enforces referential integrity at the application layer.
 */
BookingSchema.pre("save", async function () {
  const EventModel = mongoose.models.Event;
  if (!EventModel) {
    throw new Error(
      "Event model is not registered. Ensure models are imported via the index file."
    );
  }

  const event = await EventModel.findById(this.eventId);
  if (!event) {
    throw new Error(`Referenced Event with ID ${this.eventId} does not exist`);
  }
});

/**
 * Reuse the existing Booking model if already registered to prevent
 * "OverwriteModelError" during Next.js hot reloads in development.
 */
export const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);
