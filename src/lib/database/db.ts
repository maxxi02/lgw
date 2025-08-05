import { Db, MongoClient } from "mongodb";
import mongoose from "mongoose";

export const client = new MongoClient(process.env.MONGODB_URI || "");
export const db: Db = client.db(process.env.MONGODB_URI || "");

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
