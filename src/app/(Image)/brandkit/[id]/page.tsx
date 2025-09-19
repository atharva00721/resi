"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useBrandKit } from "@/hooks/use-brandkit";
import { BrandKitDetailHeader } from "./_components/brandkit-detail-header";
import { ProductOverview } from "./_components/product-overview";
import { AIInsights } from "./_components/ai-insights";
import { DetailSidebar } from "./_components/detail-sidebar";
import { ErrorState } from "./_components/error-state";
import { BrandKitEditForm } from "./_components/brandkit-edit-form";

interface BrandKitDetail {
  id: string;
  productTitle: string;
  productDescription: string;
  logoUrl?: string;
  logoPreviewUrl?: string;
  extractedFeatures: string[];
  brandColors: string[];
  audience?: string;
  productVibes?: string;
  brandPersonality?: string;
  status: "DRAFT" | "PROCESSING" | "COMPLETED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  productImages: Array<{
    id: string;
    imageUrl: string;
    previewUrl?: string;
    order: number;
  }>;
}

export default function BrandKitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { deleteBrandKit, loading } = useBrandKit();

  const [brandKit, setBrandKit] = useState<BrandKitDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const hasFetchedRef = useRef(false);

  const brandKitId = params.id as string;

  // Reset fetch flag when brandKitId changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [brandKitId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (
      status === "authenticated" &&
      brandKitId &&
      session?.user?.id &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;
      fetchBrandKit();
    }
  }, [brandKitId, session?.user?.id, status, router]);

  const fetchBrandKit = async (forceRefresh = false) => {
    try {
      setLoadingDetail(true);
      setError(null);

      const response = await fetch(
        `/api/brandkit/${brandKitId}${forceRefresh ? "?t=" + Date.now() : ""}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Brand kit not found");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to view this brand kit");
        } else {
          throw new Error("Failed to fetch brand kit");
        }
      }

      const data = await response.json();
      setBrandKit(data.brandKit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this brand kit? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deleteBrandKit(brandKitId);
      router.push("/brandkit");
    } catch (error) {
      console.error("Failed to delete brand kit:", error);
      alert("Failed to delete brand kit. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: {
    productTitle: string;
    productDescription: string;
    audience?: string;
    productVibes?: string;
    brandPersonality?: string;
    extractedFeatures: string[];
    brandColors: string[];
  }) => {
    if (!brandKit) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/brandkit/${brandKitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update brand kit");
      }

      const updatedData = await response.json();
      setBrandKit(updatedData.brandKit);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save brand kit:", error);
      alert("Failed to save brand kit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loadingDetail) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brand kit...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onBack={() => router.push("/brandkit")}
        onRetry={() => fetchBrandKit(true)}
      />
    );
  }

  if (!brandKit) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Brand kit not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <BrandKitDetailHeader
        brandKit={brandKit}
        onBack={() => router.push("/brandkit")}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRefresh={() => fetchBrandKit(true)}
        deleting={deleting}
        isEditing={isEditing}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isEditing ? (
          <BrandKitEditForm
            brandKit={brandKit}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            loading={saving}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProductOverview brandKit={brandKit} />
              <AIInsights brandKit={brandKit} />
            </div>
            <DetailSidebar brandKit={brandKit} />
          </div>
        )}
      </div>
    </div>
  );
}
