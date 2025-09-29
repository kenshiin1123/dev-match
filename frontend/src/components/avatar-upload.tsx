import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { getAuthToken } from "@/util/auth";
import { toast } from "sonner";
import { useSelector } from "react-redux";

interface AvatarUploadProps {
  avatar: string | null | undefined;
  setAvatar: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatar, setAvatar }) => {
  const userId = useSelector((state: any) => state.user.user_id);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (fileToUpload: File) => {
    toast.promise(
      async () => {
        setUploading(true);
        // Ask backend for signature
        const { VITE_API_BASE_URL } = import.meta.env;
        const sigRes = await fetch(VITE_API_BASE_URL + "/upload/signature", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getAuthToken(),
          },
          body: JSON.stringify({
            public_id: `avatars/${userId}`,
          }),
        });
        const sigData = await sigRes.json();

        // Step 2: Upload directly to Cloudinary
        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder);
        formData.append("public_id", sigData.public_id);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
          { method: "POST", body: formData }
        );

        const cloudData = await cloudRes.json();
        setAvatar(cloudData.secure_url);

        // Save URL in backend (optional, for DB)
        await fetch(VITE_API_BASE_URL + "/users/avatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getAuthToken(),
          },
          body: JSON.stringify({ avatar: cloudData.secure_url }),
        });
      },
      {
        loading: "Uploading avatar...",
        success: () => {
          setUploading(false);
          return "Avatar uploaded successfully!";
        },
        error: (err) => {
          setUploading(false);
          console.error("Upload failed:", err);
          return "Failed to upload avatar.";
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    handleUpload(selected);
  };

  let buttonMessage = "Upload your avatar";
  if (avatar) {
    buttonMessage = "Change Avatar";
  }
  if (uploading) {
    buttonMessage = "Uploading...";
  }

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <Button
        className="w-full rounded-none"
        variant="outline"
        onClick={() => avatarInputRef.current?.click()}
        disabled={uploading}
      >
        {buttonMessage}
      </Button>

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUpload;
