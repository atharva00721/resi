"use client";

import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductOverviewProps {
  brandKit: {
    productTitle: string;
    productDescription: string;
    logoPreviewUrl?: string;
    productImages: Array<{
      id: string;
      imageUrl: string;
      previewUrl?: string;
      order: number;
    }>;
  };
}

export function ProductOverview({ brandKit }: ProductOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex text-2xl items-center">
          {/* <Eye className="w-5 h-5 mr-2" /> */}
          Product Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo */}
          {brandKit.logoPreviewUrl && (
            <div className="space-y-3">
              {/* <h3 className="text-sm font-medium text-gray-700">Logo</h3> */}
              <div className="aspect-square max-w-48  flex items-center justify-center">
                <img
                  src={brandKit.logoPreviewUrl}
                  alt="Brand logo "
                  className="max-w-full rounded-lg max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 col-span-2">
            <h3 className="text-xl font-bold">
              {brandKit.productTitle}
            </h3>

            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {brandKit.productDescription}
            </p>
          </div>
        </div>

        {/* Product Images */}
        {brandKit.productImages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Product Images ({brandKit.productImages.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {brandKit.productImages
                .sort((a, b) => a.order - b.order)
                .map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.previewUrl || image.imageUrl}
                      alt={`Product image ${image.order + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
