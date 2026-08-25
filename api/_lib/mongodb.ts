// Save as: api/_lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

// Cache the connection across function invocations (serverless-safe pattern).
// Without this, every request would open a brand new DB connection.
let cached = (global as any).mongooseConn;

if (!cached) {
  cached = (global as any).mongooseConn = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}