// import { Db, MongoClient } from "mongodb";
// import mongoose from "mongoose";

// export const client = new MongoClient(process.env.MONGODB_URI || "");
// export const db: Db = client.db(process.env.MONGODB_URI || "");

// let isConnected = false;

// export async function connectDB() {
//   if (isConnected) {
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI || "");
//     isConnected = true;
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error);
//     throw error;
//   }
// }

import { Db, MongoClient } from "mongodb";
import mongoose from "mongoose";

// Validate environment variable
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

// Extract database name from URI (or set a default)
const DATABASE_NAME = process.env.MONGODB_DB_NAME || "your-database-name";

export const client = new MongoClient(MONGODB_URI);
export const db: Db = client.db(DATABASE_NAME);

let isConnected = false;
let isMongoClientConnected = false;

// Connect MongoDB native client
export async function connectMongoClient() {
  if (isMongoClientConnected) {
    return client;
  }

  try {
    await client.connect();
    isMongoClientConnected = true;
    console.log("MongoDB native client connected successfully");
    return client;
  } catch (error) {
    console.error("MongoDB native client connection failed:", error);
    throw error;
  }
}

// Connect Mongoose
export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI || "");
    isConnected = true;
    console.log("Mongoose connected successfully");
  } catch (error) {
    console.error("Mongoose connection failed:", error);
    throw error;
  }
}

// Graceful shutdown
export async function disconnectDB() {
  try {
    if (isMongoClientConnected) {
      await client.close();
      isMongoClientConnected = false;
    }
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
    }
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}
