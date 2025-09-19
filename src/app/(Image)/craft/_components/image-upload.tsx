"use client";

import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

interface ImageUploadProps {
  uploadedImage: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ImageUpload({
  uploadedImage,
  onImageUpload,
  onRemoveImage,
  fileInputRef,
}: ImageUploadProps) {
  return (
    <>
      {uploadedImage && (
        <div className="mb-4 relative">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 w-6 h-6 p-0 rounded-full"
            onClick={onRemoveImage}
          >
            ×
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </>
  );
}
