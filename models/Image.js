import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Album name
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["cover", "photo"], 
    default: "photo" 
  } 
});

export default mongoose.model("Image", ImageSchema);
