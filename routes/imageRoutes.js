import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Image from "../models/Image.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Multer memory storage (works on serverless platforms)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Cloudinary configuration from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Admin login
router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ message: "Login successful" });
  }
  return res.status(401).json({ error: "Not authorized" });
});

// Admin logout
router.post("/admin/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

// Upload cover image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body; // album name

    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        const image = new Image({
          name,
          url: result.secure_url,
          public_id: result.public_id,
          type: "cover",
        });

        await image.save();
        res.json(image);
      })
      .end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cover images
router.get("/images", async (req, res) => {
  try {
    const images = await Image.find({ type: "cover" });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete image
router.delete("/delete/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne();
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload image to album
router.post("/upload/album", upload.single("image"), async (req, res) => {
  try {
    const albumName = req.body.name;

    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        const image = new Image({
          name: albumName,
          url: result.secure_url,
          public_id: result.public_id,
          type: "photo",
        });

        await image.save();
        res.json(image);
      })
      .end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get images by album
router.get("/images/album/:name", async (req, res) => {
  try {
    const albumName = req.params.name;
    const images = await Image.find({ name: albumName });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Router is working ✅" });
});

export default router;
