"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Image as ImageIcon, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandKitStepProps } from "@/types/brand-kit";
import { step2Schema, Step2Data } from "../schemas";
import { uploadFiles } from "@/lib/uploadthing";

interface StepProductImagesProps extends BrandKitStepProps {
  onComplete?: (data: any) => void;
}

export function StepProductImages({
  data,
  updateData,
  onNext,
  onPrevious,
  onComplete,
}: StepProductImagesProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      productImages: data.productImages,
    },
  });

  const watchedImages = watch("productImages");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const newFiles = [...data.productImages, ...imageFiles];

    // Check if total would exceed limit
    if (newFiles.length > 10) {
      return; // Let Zod validation handle this
    }

    setValue("productImages", newFiles);
    const newPreviews: string[] = [];

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === imageFiles.length) {
          updateData({
            productImages: newFiles,
            productImagePreviews: [
              ...data.productImagePreviews,
              ...newPreviews,
            ],
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    const newImages = data.productImages.filter((_, i) => i !== index);
    const newPreviews = data.productImagePreviews.filter((_, i) => i !== index);
    setValue("productImages", newImages);
    updateData({
      productImages: newImages,
      productImagePreviews: newPreviews,
    });
  };

  const onSubmit = async (formData: Step2Data) => {
    // Upload selected images to UploadThing and replace previews with URLs
    const files = formData.productImages;
    if (!files || files.length === 0) {
      onNext();
      return;
    }

    try {
      const res = await uploadFiles("imageUploader", {
        files,
      });

      const urls = res
        .map(
          (r) => (r.serverData as any)?.ufsUrl || (r as any)?.ufsUrl || r.url
        )
        .filter(Boolean) as string[];

      const updatedData = {
        productImages: files,
        productImagePreviews: urls,
      };

      updateData(updatedData);

      // Call onComplete if provided, otherwise use onNext
      if (onComplete) {
        onComplete(updatedData);
      } else {
        onNext();
      }
    } catch (err) {
      console.error("UploadThing error:", err);
      // Fall back to existing previews if upload fails
      onNext();
    }
  };

  const canProceed = data.productImages.length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Upload Product Images
        </h2>
        <p className="text-gray-600">
          Upload multiple images of your product. These will be processed by AI
          to extract features and insights.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-900">
            Product Images ({data.productImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Left Column - Upload Area (60%) */}
            <div className="lg:col-span-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 h-full ${
                  errors.productImages
                    ? "border-red-500 bg-red-50/50"
                    : dragActive
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your product images here
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  or click to browse files (supports multiple selection)
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-gray-300 hover:border-gray-400"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {errors.productImages && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-4">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {errors.productImages.message || "Invalid images"}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column - Uploaded Images Grid (40%) */}
            <div className="lg:col-span-4 ">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Uploaded Images
                  </h4>
                  <p className="text-xs text-gray-500">
                    {data.productImages.length} image
                    {data.productImages.length !== 1 ? "s" : ""} uploaded
                  </p>
                </div>

                {data.productImagePreviews.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-x-hidden">
                      {data.productImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                            <img
                              src={preview}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-1 -right-1 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      No images uploaded yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="border-gray-300 hover:border-gray-400"
        >
          Back to Logo & Details
        </Button>
        <Button
          type="submit"
          disabled={!canProceed}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          Review Brand Kit
        </Button>
      </div>
    </form>
  );
}
