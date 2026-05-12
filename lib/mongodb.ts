import mongoose, { Connection } from "mongoose";

/**
 * Type definition for the cached Mongoose connection stored on the global object.
 * This allows us to persist the connection across hot reloads in development.
 */
type MongooseCache = {
  /** The active Mongoose connection instance, or null if not connected */
  conn: Connection | null;
  /** A promise representing an in-progress connection attempt, or null */
  promise: Promise<Connection> | null;
};

/**
 * Global declaration to attach the mongoose cache to the Node.js global object.
 * This prevents TypeScript from complaining about an unknown property on `global`.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

/**
 * Cached connection object. In development, this is stored on the global object
 * so that hot reloads do not create multiple database connections.
 */
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

/**
 * Establishes a cached connection to MongoDB using Mongoose.
 *
 * - Returns an existing connection if one is already active.
 * - Returns an in-progress connection promise if a connection is currently being established.
 * - Otherwise, initiates a new connection and caches it for reuse.
 *
 * @returns {Promise<Connection>} A promise that resolves to the active Mongoose connection.
 * @throws {Error} If the MONGODB_URI environment variable is not defined.
 */
export async function connectToDatabase(): Promise<Connection> {
  // Return the existing connection if already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Throw a clear error if the connection string is missing
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // If no connection promise exists, create one and cache it
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  // Await the shared connection promise and cache the resolved connection
  cached.conn = await cached.promise;

  // Store the cache on the global object in development to survive hot reloads
  if (process.env.NODE_ENV !== "production") {
    global.mongooseCache = cached;
  }

  return cached.conn;
}
