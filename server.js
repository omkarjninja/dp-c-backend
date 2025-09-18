import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.use("/api", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Cloudinary Config:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY);
});

