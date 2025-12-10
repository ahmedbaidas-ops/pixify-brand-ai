import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AssetResult {
  id: string;
  name: string;
  type: string;
  storage_url: string;
  mime_type: string | null;
}

interface AIResponse {
  type: "assets" | "text" | "error";
  message: string;
  assets?: AssetResult[];
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

  const processQuery = async (query: string): Promise<AIResponse> => {
    setIsLoading(true);
    setResponse(null);

    try {
      const lowerQuery = query.toLowerCase();
      
      // Check if asking for logos/assets
      const isAssetQuery = 
        lowerQuery.includes("logo") || 
        lowerQuery.includes("svg") || 
        lowerQuery.includes("png") || 
        lowerQuery.includes("asset") ||
        lowerQuery.includes("qatar airways") ||
        lowerQuery.includes("pull") ||
        lowerQuery.includes("get") ||
        lowerQuery.includes("find") ||
        lowerQuery.includes("show");

      if (isAssetQuery) {
        // Determine file types to filter
        const wantsSvg = lowerQuery.includes("svg");
        const wantsPng = lowerQuery.includes("png");
        const wantsLogo = lowerQuery.includes("logo");

        // Build query for assets
        let assetQuery = supabase
          .from("assets")
          .select("id, name, type, storage_url, mime_type");

        // Filter by type if specific format requested
        if (wantsSvg || wantsPng) {
          const mimeTypes: string[] = [];
          if (wantsSvg) mimeTypes.push("image/svg+xml");
          if (wantsPng) mimeTypes.push("image/png");
          assetQuery = assetQuery.in("mime_type", mimeTypes);
        }

        // If looking for logo specifically
        if (wantsLogo) {
          assetQuery = assetQuery.ilike("name", "%logo%");
        }

        const { data: assets, error } = await assetQuery.limit(10);

        if (error) throw error;

        if (assets && assets.length > 0) {
          const result: AIResponse = {
            type: "assets",
            message: `Found ${assets.length} asset${assets.length > 1 ? "s" : ""} matching your request:`,
            assets: assets as AssetResult[],
          };
          setResponse(result);
          setIsLoading(false);
          return result;
        } else {
          // No assets in DB, return the public logo
          const publicAssets: AssetResult[] = [];
          
          if (!wantsSvg || wantsPng || wantsLogo) {
            publicAssets.push({
              id: "public-logo-png",
              name: "Qatar Airways Logo (PNG)",
              type: "logo",
              storage_url: "/qatar-airways-logo.png",
              mime_type: "image/png",
            });
          }

          const result: AIResponse = {
            type: "assets",
            message: publicAssets.length > 0 
              ? `Here are the Qatar Airways assets:` 
              : "No matching assets found.",
            assets: publicAssets,
          };
          setResponse(result);
          setIsLoading(false);
          return result;
        }
      }

      // Default response for non-asset queries
      const result: AIResponse = {
        type: "text",
        message: "I can help you find brand assets! Try asking me to 'pull the SVG and PNG for Qatar Airways' or 'find the logo'.",
      };
      setResponse(result);
      setIsLoading(false);
      return result;

    } catch (error) {
      console.error("AI Assistant error:", error);
      const result: AIResponse = {
        type: "error",
        message: "Sorry, I encountered an error processing your request.",
      };
      setResponse(result);
      setIsLoading(false);
      return result;
    }
  };

  const clearResponse = () => setResponse(null);

  return {
    isLoading,
    response,
    processQuery,
    clearResponse,
  };
};
