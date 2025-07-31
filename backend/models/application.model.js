import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const applicationSchema = new Schema(
  {
    applicant: {
      type: Types.ObjectId,
      ref: "user",
    },
    job: {
      type: Types.ObjectId,
      ref: "jobpost",
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "rejected"],
      default: "applied",
    },
    noteFromEmployer: String,
  },
  {
    timestamps: true,
  }
);

// This ensures that the applicant can only apply to a job once
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

export default model("application", applicationSchema);
