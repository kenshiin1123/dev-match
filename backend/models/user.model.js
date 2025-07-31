import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: { type: String, required: true },
    role: {
      type: String,
      enum: ["developer", "employer", "admin"],
      default: "developer",
    },
    location: String,
    skills: { type: [String], default: [] },
    company: String, // For employers only
    avatar: { type: Buffer, contentType: String }, // Image
    resume: { type: Buffer, contentType: String }, // PDF format of resume
  },
  {
    timestamps: true,
  }
);

export default model("user", userSchema);
