import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { connectDB } from "./db";

let bucket: GridFSBucket | null = null;

export async function getBucket() {
  if (bucket) return bucket;
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Mongo connection has no db");
  bucket = new GridFSBucket(db, { bucketName: "images" });
  return bucket;
}

export async function getDb() {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Mongo connection has no db");
  return db;
}
