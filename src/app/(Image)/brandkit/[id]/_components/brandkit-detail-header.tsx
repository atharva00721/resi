"use client";

import {
  ArrowLeft,
  Edit,
  Download,
  Share,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BrandKitDetailHeaderProps {
  brandKit: {
    id: string;
    productTitle: string;
    status: "DRAFT" | "PROCESSING" | "COMPLETED" | "ARCHIVED";
    createdAt: string;
  };
  onBack: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onRefresh?: () => void;
  deleting: boolean;
  isEditing: boolean;
}

export function BrandKitDetailHeader({
  brandKit,
  onBack,
  onDelete,
  onEdit,
  onRefresh,
  deleting,
  isEditing,
}: BrandKitDetailHeaderProps) {
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

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {brandKit.productTitle}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <Badge className={getStatusColor(brandKit.status)}>
                  {brandKit.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Created {new Date(brandKit.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              disabled={isEditing}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Editing..." : "Edit"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
