"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BrandKitStepProps } from "@/types/brand-kit";
import { step1Schema, Step1Data } from "../schemas";
import { uploadFiles } from "@/lib/uploadthing";

interface StepLogoFormProps extends BrandKitStepProps {
  onComplete?: (data: any) => void;
}

export function StepLogoForm({
  data,
  updateData,
  onNext,
  onComplete,
}: StepLogoFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      logo: data.logo,
      productTitle: data.productTitle,
      productDescription: data.productDescription,
    },
  });

  const watchedLogo = watch("logo");
  const watchedTitle = watch("productTitle");
  const watchedDescription = watch("productDescription");

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setValue("logo", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        updateData({
          logo: file,
          logoPreview: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeLogo = () => {
    setValue("logo", undefined as any);
    updateData({
      logo: undefined,
      logoPreview: undefined,
    });
  };

  const onSubmit = async (formData: Step1Data) => {
    // Upload logo to UploadThing to get a stable URL for the review/AI steps
    let logoPreviewUrl = data.logoPreview;
    try {
      if (formData.logo instanceof File) {
        const result = await uploadFiles("imageUploader", {
          files: [formData.logo],
        });

        const url =
          (result[0] as any)?.serverData?.ufsUrl ||
          (result[0] as any)?.ufsUrl ||
          result[0]?.url;
        if (typeof url === "string") {
          logoPreviewUrl = url;
        }
      }
    } catch (err) {
      console.error("Logo upload failed, using local preview:", err);
    }

    const updatedData = {
      logo: formData.logo,
      logoPreview: logoPreviewUrl,
      productTitle: formData.productTitle,
      productDescription: formData.productDescription,
    };

    updateData(updatedData);

    // Call onComplete if provided, otherwise use onNext
    if (onComplete) {
      onComplete(updatedData);
    } else {
      onNext();
    }
  };

  const canProceed =
    watchedTitle?.trim() && watchedDescription?.trim() && watchedLogo;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Upload Your Logo & Product Details
        </h2>
        <p className="text-gray-600">
          Start by uploading your logo and providing basic information about
          your product.
        </p>
      </div>

      <div className="border-0">
        <div className="p-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Logo Upload */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Logo Upload
                </h3>
                <p className="text-sm text-gray-500">Upload your brand logo</p>
              </div>

              {!data.logoPreview ? (
                <>
                  <div
                    className={`border-2 border-dashed rounded-xl w-full p-6 text-center transition-all duration-200 ${
                      errors.logo
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
                    <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Drop your logo here
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      or click to browse files
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-gray-300 hover:border-gray-400"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>

                  {errors.logo && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Invalid file</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3 w-full">
                  <div className="flex justify-center w-full">
                    <div className="relative w-full">
                      <img
                        src={data.logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain border border-gray-200 rounded-lg bg-white"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 w-5 h-5"
                        onClick={removeLogo}
                      >
                        <X className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  </div>
                  {/* <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {data.logo?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(data.logo?.size &&
                        (data.logo.size / 1024 / 1024).toFixed(2)) ||
                        "0"}{" "}
                      MB
                    </p>
                  </div> */}
                </div>
              )}
            </div>

            {/* Right Column - Product Information */}
            <div className="space-y-4 col-span-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Product Information
                </h3>
                <p className="text-sm text-gray-500">
                  Enter your product details
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="productTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Title *
                  </label>
                  <Input
                    id="productTitle"
                    placeholder="Enter your product name"
                    {...register("productTitle", {
                      onChange: (e) => {
                        updateData({ productTitle: e.target.value });
                      },
                    })}
                    className={`${
                      errors.productTitle
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.productTitle && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Invalid input</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="productDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Description *
                  </label>
                  <Textarea
                    id="productDescription"
                    placeholder="Describe your product in detail..."
                    {...register("productDescription", {
                      onChange: (e) => {
                        updateData({ productDescription: e.target.value });
                      },
                    })}
                    rows={6}
                    className={`${
                      errors.productDescription
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.productDescription && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Invalid input</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={!canProceed}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          Continue to Product Images
        </Button>
      </div>
    </form>
  );
}
