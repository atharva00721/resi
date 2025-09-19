"use client";

import { Edit, Download, Share, Copy, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DetailSidebarProps {
  brandKit: {
    id: string;
    status: "DRAFT" | "PROCESSING" | "COMPLETED" | "ARCHIVED";
    createdAt: string;
    updatedAt: string;
    logoPreviewUrl?: string;
    productImages: Array<{
      id: string;
      imageUrl: string;
      previewUrl?: string;
      order: number;
    }>;
    brandColors: string[];
    extractedFeatures: string[];
  };
}

export function DetailSidebar({ brandKit }: DetailSidebarProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(brandKit, null, 2));
      toast.success("Brand kit JSON copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleGoToCraft = () => {
    router.push("/craft/posts");
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Brand Kit
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleGoToCraft}
          >
            <Palette className="w-4 h-4 mr-2" />
            Go to Craft Posts
          </Button>
          <Button className="w-full" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Assets
          </Button>
          <Button className="w-full" variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button className="w-full" variant="outline" onClick={handleCopyJson}>
            <Copy className="w-4 h-4 mr-2" />
            Copy JSON
          </Button>
        </CardContent>
      </Card>

      {/* Brand Kit Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brand Kit Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <Badge className={getStatusColor(brandKit.status)}>
              {brandKit.status}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Created</h3>
            <p className="text-sm text-gray-600">
              {new Date(brandKit.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Last Updated</h3>
            <p className="text-sm text-gray-600">
              {new Date(brandKit.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Assets</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Logo:</span>
                <span>{brandKit.logoPreviewUrl ? "✓" : "✗"}</span>
              </div>
              <div className="flex justify-between">
                <span>Product Images:</span>
                <span>{brandKit.productImages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Brand Colors:</span>
                <span>{brandKit.brandColors.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Features:</span>
                <span>{brandKit.extractedFeatures.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
