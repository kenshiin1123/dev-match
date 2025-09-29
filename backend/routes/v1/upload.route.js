import express from "express";
import cloudinary from "../../utils/claudinary.js";

const router = express.Router();

router.post("/signature", (req, res) => {
  const { public_id } = req.body;
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "user_uploads", public_id },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: "user_uploads",
    public_id,
  });
});

export default router;
