import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


interface BrandKit {
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

export function useBrandKit() {
  const { data: session } = useSession();
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all brand kits for the current user
  const fetchBrandKits = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/brandkit");
      if (!response.ok) {
        throw new Error("Failed to fetch brand kits");
      }

      const data = await response.json();
      setBrandKits(data.brandKits);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Create a new brand kit
  const createBrandKit = async (brandKitData: {
    productTitle: string;
    productDescription: string;
    logoUrl: string;
    logoPreviewUrl?: string;
    productImageUrls?: string[];
    productImagePreviewUrls?: string[];
  }) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/brandkit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandKitData),
      });

      if (!response.ok) {
        throw new Error("Failed to create brand kit");
      }

      const data = await response.json();
      setBrandKits((prev) => [data.brandKit, ...prev]);
      return data.brandKit;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a brand kit with AI results
  const updateBrandKitWithAI = async (
    brandKitId: string,
    aiResults: {
      extractedFeatures?: string[];
      brandColors?: string[];
      audience?: string;
      productVibes?: string;
      brandPersonality?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/brandkit/${brandKitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...aiResults,
          status: "COMPLETED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update brand kit");
      }

      const data = await response.json();
      setBrandKits((prev) =>
        prev.map((bk) => (bk.id === brandKitId ? data.brandKit : bk))
      );
      return data.brandKit;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update brand kit with product images
  const updateBrandKitImages = async (
    brandKitId: string,
    productImageUrls: string[],
    productImagePreviewUrls?: string[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/brandkit/${brandKitId}/images`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productImageUrls,
          productImagePreviewUrls,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product images");
      }

      const data = await response.json();
      setBrandKits((prev) =>
        prev.map((bk) => (bk.id === brandKitId ? data.brandKit : bk))
      );
      return data.brandKit;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a brand kit
  const deleteBrandKit = async (brandKitId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/brandkit/${brandKitId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete brand kit");
      }

      setBrandKits((prev) => prev.filter((bk) => bk.id !== brandKitId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch brand kits on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchBrandKits();
    }
  }, [session?.user?.id]);

  return {
    brandKits,
    loading,
    error,
    createBrandKit,
    updateBrandKitWithAI,
    updateBrandKitImages,
    deleteBrandKit,
    refetch: fetchBrandKits,
  };
}
