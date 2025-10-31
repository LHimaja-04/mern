import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    console.warn("MONGODB_URI missing, running without database connection");
    return;
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { dbName: "edukart" });
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    console.warn("Running without database connection");
  }
}
