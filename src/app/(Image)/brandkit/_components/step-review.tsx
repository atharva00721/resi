"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit2,
  Check,
  X,
  Palette,
  Image as ImageIcon,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CustomCard,
  InfoCard,
  EditableCard,
} from "@/components/ui/custom-card";
import { BrandKitStepProps } from "@/types/brand-kit";
import { step3Schema, Step3Data } from "../schemas";

export function StepReview({
  data,
  updateData,
  onNext,
  onPrevious,
}: BrandKitStepProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
  const [editingColor, setEditingColor] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [newColor, setNewColor] = useState("");

  // Mock extracted features and brand colors - now editable
  const [features, setFeatures] = useState([
    "Premium Quality Materials",
    "Eco-Friendly Design",
    "User-Friendly Interface",
    "Advanced Technology",
    "Durable Construction",
  ]);

  const [brandColors, setBrandColors] = useState([
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: "onChange",
    defaultValues: {
      extractedFeatures: features,
      brandColors: brandColors,
    },
  });

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValues({ [field]: currentValue });
  };

  const saveEdit = (field: string) => {
    if (field === "productTitle") {
      updateData({ productTitle: tempValues[field] });
    } else if (field === "productDescription") {
      updateData({ productDescription: tempValues[field] });
    }
    setEditingField(null);
    setTempValues({});
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleInputChange = (field: string, value: string) => {
    setTempValues({ [field]: value });
  };

  // Feature editing functions
  const startEditingFeature = (index: number) => {
    setEditingFeature(index);
    setTempValues({ feature: features[index] });
  };

  const saveFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures[index] = tempValues.feature || features[index];
    setFeatures(newFeatures);
    setEditingFeature(null);
    setTempValues({});
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  // Color editing functions
  const startEditingColor = (index: number) => {
    setEditingColor(index);
    setTempValues({ color: brandColors[index] });
  };

  const saveColor = (index: number) => {
    const newColors = [...brandColors];
    newColors[index] = tempValues.color || brandColors[index];
    setBrandColors(newColors);
    setEditingColor(null);
    setTempValues({});
  };

  const removeColor = (index: number) => {
    const newColors = brandColors.filter((_, i) => i !== index);
    setBrandColors(newColors);
    setValue("brandColors", newColors);
  };

  const addColor = () => {
    const colorValue = newColor.trim();
    if (colorValue && /^#[0-9A-F]{6}$/i.test(colorValue)) {
      const newColors = [...brandColors, colorValue];
      setBrandColors(newColors);
      setValue("brandColors", newColors);
      setNewColor("");
    }
  };

  const onSubmit = (formData: Step3Data) => {
    // Update the main data with current features and colors
    updateData({
      extractedFeatures: formData.extractedFeatures,
      brandColors: formData.brandColors,
    });
    onNext();
  };

  // Initialize features and colors from AI results (passed from processing step)
  useEffect(() => {
    if (data.extractedFeatures && data.extractedFeatures.length > 0) {
      setFeatures(data.extractedFeatures);
    }
    if (data.brandColors && data.brandColors.length > 0) {
      setBrandColors(data.brandColors);
    }
  }, [data.extractedFeatures, data.brandColors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Main Content Layout */}
      <div className="space-y-12">
        {/* Brand Assets Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900">
              Brand Assets
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Information */}
            <EditableCard
              title="Product Information"
              icon={FileText}
              className="space-y-6"
            >
              {data.logoPreview && (
                <div>
                  {/* <div className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                        <ImageIcon className="w-5 h-5" />
                        Logo
                      </CardTitle>
                    </div> */}
                  <div>
                    <div className="flex items-center gap-4">
                      <img
                        src={data.logoPreview}
                        alt="Logo preview"
                        className="w-full h-full aspect-square object-fill border border-gray-200 rounded-lg bg-white"
                      />
                      {/* <div>
                          <p className="font-medium text-gray-900">
                            {data.logo?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(data.logo?.size &&
                              (data.logo.size / 1024 / 1024).toFixed(2)) ||
                              "0"}{" "}
                            MB
                          </p>
                        </div> */}
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Title
                </label>
                {editingField === "productTitle" ? (
                  <div className="flex gap-2">
                    <Input
                      value={tempValues.productTitle || ""}
                      onChange={(e) =>
                        handleInputChange("productTitle", e.target.value)
                      }
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => saveEdit("productTitle")}
                      className="border-gray-300 hover:border-gray-400"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={cancelEdit}
                      className="border-gray-300 hover:border-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group">
                    <p className="text-lg font-medium text-gray-900 flex-1">
                      {data.productTitle}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        startEditing("productTitle", data.productTitle)
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Description
                </label>
                {editingField === "productDescription" ? (
                  <div className="space-y-3">
                    <Textarea
                      value={tempValues.productDescription || ""}
                      onChange={(e) =>
                        handleInputChange("productDescription", e.target.value)
                      }
                      rows={4}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit("productDescription")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="border-gray-300 hover:border-gray-400"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 group">
                    <p className="text-gray-600 flex-1 leading-relaxed">
                      {data.productDescription}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        startEditing(
                          "productDescription",
                          data.productDescription
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </EditableCard>

            {/* Logo Preview */}

            {/* Product Images */}
            <CustomCard
              title={`Product Images (${data.productImagePreviews.length})`}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.productImagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <img
                        src={preview}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded truncate">
                        {data.productImages[index]?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CustomCard>
          </div>
        </div>

        {/* AI Insights Section */}
        {(data.audience || data.productVibes || data.brandPersonality) && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                AI Insights
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {data.audience && (
                <InfoCard
                  title="Target Audience"
                  icon={Users}
                  iconColor="text-blue-600"
                  content={data.audience}
                />
              )}

              {data.productVibes && (
                <InfoCard
                  title="Product Vibes"
                  icon={Sparkles}
                  iconColor="text-purple-600"
                  content={data.productVibes}
                />
              )}

              {data.brandPersonality && (
                <InfoCard
                  title="Brand Personality"
                  icon={Palette}
                  iconColor="text-green-600"
                  content={data.brandPersonality}
                />
              )}
            </div>
          </div>
        )}

        {/* Brand Elements Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Brand Elements
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Extracted Features */}
            <EditableCard title="Extracted Features">
              <div className="space-y-4">
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      {editingFeature === index ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={tempValues.feature || ""}
                            onChange={(e) =>
                              setTempValues({ feature: e.target.value })
                            }
                            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter feature"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => saveFeature(index)}
                            className="border-gray-300 hover:border-gray-400"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEditingFeature(null)}
                            className="border-gray-300 hover:border-gray-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs flex-1 justify-start"
                          >
                            {feature}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditingFeature(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFeature(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new feature */}
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add new feature"
                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addFeature}
                    className="border-gray-300 hover:border-gray-400"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-gray-500">
                  * Features will be automatically extracted from your product
                  images using AI
                </p>
              </div>
            </EditableCard>

            {/* Brand Colors */}
            <EditableCard title="Brand Colors" icon={Palette}>
              <div className="space-y-4">
                <div className="space-y-3">
                  {brandColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      {editingColor === index ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={tempValues.color || ""}
                            onChange={(e) =>
                              setTempValues({ color: e.target.value })
                            }
                            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono"
                            placeholder="#000000"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => saveColor(index)}
                            className="border-gray-300 hover:border-gray-400"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEditingColor(null)}
                            className="border-gray-300 hover:border-gray-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm font-mono text-gray-600 flex-1">
                            {color}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditingColor(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeColor(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new color */}
                <div className="flex gap-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 font-mono border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && addColor()}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addColor}
                    className="border-gray-300 hover:border-gray-400"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {errors.brandColors && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      {errors.brandColors.message || "Invalid colors"}
                    </span>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  * Colors will be automatically extracted from your logo using
                  AI
                </p>
              </div>
            </EditableCard>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="border-gray-300 hover:border-gray-400 text-gray-700"
          >
            ← Back to Processing
          </Button>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Ready to finalize your brand kit?
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-2 shadow-lg"
            >
              Complete Brand Kit ✨
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
