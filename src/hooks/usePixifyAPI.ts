import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AskPixifyResponse {
  answer: string;
  query: string;
  brandId?: string;
  sources?: string[];
}

interface BrandHealthData {
  brandId: string;
  brandName: string;
  overallScore: number;
  breakdown: {
    visualConsistency: number;
    assetLibraryUsage: number;
    guidelineCompleteness: number;
    teamActivity: number;
    campaignPerformance: number;
  };
  stats: {
    totalAssets: number;
    guidelineSections: number;
    designTokens: number;
  };
  tier: "Excellent" | "Strong" | "Needs Attention" | "Critical";
  updatedAt: string;
}

interface SearchResult {
  id: string;
  name?: string;
  title?: string;
  type: string;
  resultType: "asset" | "guideline" | "token";
  brandId: string;
  url?: string;
  value?: any;
  description?: string;
}

interface SearchResponse {
  query: string;
  scope: string;
  totalResults: number;
  results: {
    assets: SearchResult[];
    guidelines: SearchResult[];
    tokens: SearchResult[];
  };
}

export function usePixifyAPI() {
  const [loading, setLoading] = useState(false);

  const askPixify = async (question: string, brandId?: string): Promise<AskPixifyResponse | null> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to use Ask Pixify");
        return null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-pixify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ question, brandId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (response.status === 402) {
          toast.error("AI credits exhausted. Please add funds to continue.");
        } else {
          toast.error(error.error || "Failed to get response");
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Ask Pixify error:", error);
      toast.error("Failed to connect to AI assistant");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBrandHealth = async (brandId: string): Promise<BrandHealthData | null> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to view brand health");
        return null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/brand-health?brandId=${brandId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to get brand health");
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Brand health error:", error);
      toast.error("Failed to fetch brand health data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const search = async (
    query: string,
    options?: { scope?: "all" | "assets" | "guidelines"; brandId?: string }
  ): Promise<SearchResponse | null> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to search");
        return null;
      }

      const params = new URLSearchParams({ q: query });
      if (options?.scope) params.append("scope", options.scope);
      if (options?.brandId) params.append("brandId", options.brandId);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Search failed");
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to perform search");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const retrieveQatarTemplate = async (): Promise<{ success: boolean; brandId?: string; message?: string }> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in first");
        return { success: false };
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/retrieve-template`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ templateName: "Qatar Airways" }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.error || "Failed to retrieve template");
        return { success: false };
      }

      toast.success(data.message || "Qatar Airways template activated!");
      return { success: true, brandId: data.brandId, message: data.message };
    } catch (error) {
      console.error("Retrieve template error:", error);
      toast.error("Failed to retrieve template");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    askPixify,
    getBrandHealth,
    search,
    retrieveQatarTemplate,
  };
}
