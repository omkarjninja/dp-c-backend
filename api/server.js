
import dotenv from "dotenv";
import path from "path";

// load .env from backend/ folder
dotenv.config({ path: path.resolve("../.env") });


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serverless from "serverless-http";
import imageRoutes from "../routes/imageRoutes.js";


const app = express();

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection (prevent multiple connects on Vercel)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGO_URI:", process.env.MONGO_URI);
    console.log("Cloudnary :",process.env.CLOUDINARY_CLOUD_NAME)
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    console.log("MONGO_URI:", process.env.MONGO_URI);

  }
};
connectDB();

// ✅ Routes
app.use("/", imageRoutes);

// ✅ If running locally -> use app.listen
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// ✅ Always export for Vercel
export const handler = serverless(app);

