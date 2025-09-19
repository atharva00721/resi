"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const editFormSchema = z.object({
  productTitle: z.string().min(1, "Product title is required"),
  productDescription: z.string().min(1, "Product description is required"),
  audience: z.string().optional(),
  productVibes: z.string().optional(),
  brandPersonality: z.string().optional(),
});

type EditFormData = z.infer<typeof editFormSchema>;

interface BrandKitEditFormProps {
  brandKit: {
    id: string;
    productTitle: string;
    productDescription: string;
    audience?: string;
    productVibes?: string;
    brandPersonality?: string;
    extractedFeatures: string[];
    brandColors: string[];
  };
  onSave: (
    data: EditFormData & { extractedFeatures: string[]; brandColors: string[] }
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function BrandKitEditForm({
  brandKit,
  onSave,
  onCancel,
  loading = false,
}: BrandKitEditFormProps) {
  const [editingFeatures, setEditingFeatures] = useState(false);
  const [editingColors, setEditingColors] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newColor, setNewColor] = useState("");
  const [features, setFeatures] = useState<string[]>(
    brandKit.extractedFeatures
  );
  const [colors, setColors] = useState<string[]>(brandKit.brandColors);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      productTitle: brandKit.productTitle,
      productDescription: brandKit.productDescription,
      audience: brandKit.audience || "",
      productVibes: brandKit.productVibes || "",
      brandPersonality: brandKit.brandPersonality || "",
    },
  });

  // Check if features or colors have changed
  const featuresChanged =
    JSON.stringify(features) !== JSON.stringify(brandKit.extractedFeatures);
  const colorsChanged =
    JSON.stringify(colors) !== JSON.stringify(brandKit.brandColors);
  const hasChanges = isDirty || featuresChanged || colorsChanged;

  const onSubmit = async (data: EditFormData) => {
    await onSave({
      ...data,
      extractedFeatures: features,
      brandColors: colors,
    });
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (
      newColor.trim() &&
      /^#[0-9A-F]{6}$/i.test(newColor) &&
      !colors.includes(newColor.trim())
    ) {
      setColors([...colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Brand Kit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>

              <div className="space-y-2">
                <label
                  htmlFor="productTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Title *
                </label>
                <Input
                  id="productTitle"
                  {...register("productTitle")}
                  className={
                    errors.productTitle
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }
                />
                {errors.productTitle && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.productTitle.message}</span>
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
                  rows={4}
                  {...register("productDescription")}
                  className={
                    errors.productDescription
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }
                />
                {errors.productDescription && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.productDescription.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                AI-Generated Insights
              </h3>

              <div className="space-y-2">
                <label
                  htmlFor="audience"
                  className="block text-sm font-medium text-gray-700"
                >
                  Target Audience
                </label>
                <Textarea
                  id="audience"
                  rows={2}
                  {...register("audience")}
                  placeholder="Describe your target audience..."
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="productVibes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Vibes
                </label>
                <Textarea
                  id="productVibes"
                  rows={2}
                  {...register("productVibes")}
                  placeholder="Describe the vibes and feel of your product..."
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="brandPersonality"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand Personality
                </label>
                <Textarea
                  id="brandPersonality"
                  rows={3}
                  {...register("brandPersonality")}
                  placeholder="Describe your brand's personality and character..."
                />
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Key Features
                  </h3>
                  {featuresChanged && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Modified
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingFeatures(!editingFeatures)}
                >
                  {editingFeatures ? "Done" : "Edit"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Badge variant="secondary">{feature}</Badge>
                    {editingFeatures && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {editingFeatures && (
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="Add new feature..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    size="sm"
                    disabled={
                      !newFeature.trim() || features.includes(newFeature.trim())
                    }
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Brand Colors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Brand Colors
                  </h3>
                  {colorsChanged && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Modified
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingColors(!editingColors)}
                >
                  {editingColors ? "Done" : "Edit"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-gray-600 font-mono">
                      {color}
                    </span>
                    {editingColors && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColor(index)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {editingColors && (
                <div className="flex gap-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addColor}
                    size="sm"
                    disabled={
                      !newColor.trim() ||
                      !/^#[0-9A-F]{6}$/i.test(newColor) ||
                      colors.includes(newColor.trim())
                    }
                  >
                    Add
                  </Button>
                </div>
              )}
              {editingColors &&
                newColor &&
                !/^#[0-9A-F]{6}$/i.test(newColor) && (
                  <p className="text-sm text-red-600">
                    Please enter a valid hex color (e.g., #FF0000)
                  </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !hasChanges}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
