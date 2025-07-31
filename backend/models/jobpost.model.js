import mongoose from "mongoose";
const { Schema, model } = mongoose;

const jobPostSchema = new Schema(
  {
    postedBy: { type: String },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    company: {
      type: String,
      required: true,
    },
    location: { type: String, required: true },
    salaryRange: {
      min: Number,
      max: Number,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
    },
    remote: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("jobpost", jobPostSchema);
