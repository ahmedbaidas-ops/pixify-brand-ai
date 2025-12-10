import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AssetResult {
  id: string;
  name: string;
  type: string;
  storage_url: string;
  mime_type: string | null;
}

interface ColorInfo {
  name: string;
  value: string;
  description?: string;
}

interface TypographyInfo {
  name: string;
  value: string;
  description?: string;
}

interface BrandInfo {
  archetype?: string;
  tone?: string;
  values?: string[];
  purpose?: string;
  audience?: string;
}

interface AIResponse {
  type: "assets" | "colors" | "typography" | "brand" | "text" | "error";
  message: string;
  assets?: AssetResult[];
  colors?: ColorInfo[];
  typography?: TypographyInfo[];
  brand?: BrandInfo;
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

  const processQuery = async (query: string): Promise<AIResponse> => {
    setIsLoading(true);
    setResponse(null);

    try {
      const lowerQuery = query.toLowerCase();
      
      // Detect query type
      const isColorQuery = 
        lowerQuery.includes("color") || 
        lowerQuery.includes("colour") ||
        lowerQuery.includes("palette") ||
        lowerQuery.includes("maroon") ||
        lowerQuery.includes("hex") ||
        lowerQuery.includes("brand color");

      const isTypographyQuery = 
        lowerQuery.includes("font") || 
        lowerQuery.includes("typography") ||
        lowerQuery.includes("typeface") ||
        lowerQuery.includes("heading") ||
        lowerQuery.includes("text style");

      const isBrandQuery = 
        lowerQuery.includes("archetype") ||
        lowerQuery.includes("tone") ||
        lowerQuery.includes("values") ||
        lowerQuery.includes("mission") ||
        lowerQuery.includes("purpose") ||
        lowerQuery.includes("audience") ||
        lowerQuery.includes("brand strategy") ||
        lowerQuery.includes("who is") ||
        lowerQuery.includes("what is the brand");

      const isAssetQuery = 
        lowerQuery.includes("logo") || 
        lowerQuery.includes("svg") || 
        lowerQuery.includes("png") || 
        lowerQuery.includes("asset") ||
        lowerQuery.includes("pull") ||
        lowerQuery.includes("download") ||
        lowerQuery.includes("get the") ||
        lowerQuery.includes("find") ||
        lowerQuery.includes("show me");

      // Handle color queries
      if (isColorQuery) {
        const { data: tokens, error } = await supabase
          .from("design_tokens")
          .select("name, value, description, type")
          .eq("type", "color");

        if (error) throw error;

        const colors: ColorInfo[] = tokens?.map(t => ({
          name: t.name,
          value: typeof t.value === 'object' && t.value !== null && 'hex' in t.value 
            ? (t.value as { hex: string }).hex 
            : String(t.value),
          description: t.description || undefined,
        })) || [];

        // Add fallback Qatar Airways colors if no tokens found
        if (colors.length === 0) {
          colors.push(
            { name: "Qatar Maroon", value: "#5C0A3A", description: "Primary brand color" },
            { name: "Desert Sand", value: "#CBB59C", description: "Secondary accent color" },
            { name: "Night Sky", value: "#0F1020", description: "Dark neutral color" },
            { name: "Cloud Gray", value: "#A2A2A2", description: "Light neutral color" }
          );
        }

        const result: AIResponse = {
          type: "colors",
          message: `Here are the Qatar Airways brand colors:`,
          colors,
        };
        setResponse(result);
        setIsLoading(false);
        return result;
      }

      // Handle typography queries
      if (isTypographyQuery) {
        const { data: tokens, error } = await supabase
          .from("design_tokens")
          .select("name, value, description, type")
          .eq("type", "typography");

        if (error) throw error;

        const typography: TypographyInfo[] = tokens?.map(t => ({
          name: t.name,
          value: typeof t.value === 'object' && t.value !== null && 'fontFamily' in t.value
            ? (t.value as { fontFamily: string }).fontFamily
            : String(t.value),
          description: t.description || undefined,
        })) || [];

        // Add fallback typography if no tokens found
        if (typography.length === 0) {
          typography.push(
            { name: "Display Font", value: "Cormorant Garamond", description: "Used for headlines and display text" },
            { name: "UI Font", value: "Inter", description: "Used for body text and UI elements" }
          );
        }

        const result: AIResponse = {
          type: "typography",
          message: `Here are the Qatar Airways brand fonts:`,
          typography,
        };
        setResponse(result);
        setIsLoading(false);
        return result;
      }

      // Handle brand strategy queries
      if (isBrandQuery) {
        const { data: brand, error } = await supabase
          .from("brands")
          .select("archetype, tone, values, purpose, audience")
          .eq("name", "Qatar Airways")
          .single();

        if (error) throw error;

        const brandInfo: BrandInfo = brand || {
          archetype: "Caregiver / Explorer",
          tone: "Warm, Premium, Trustworthy",
          values: ["Excellence", "Innovation", "Care", "Cultural Pride"],
          purpose: "To connect the world with warmth and excellence",
          audience: "Premium travelers seeking comfort and cultural experiences",
        };

        const result: AIResponse = {
          type: "brand",
          message: `Here's the Qatar Airways brand strategy:`,
          brand: brandInfo,
        };
        setResponse(result);
        setIsLoading(false);
        return result;
      }

      // Handle asset queries
      if (isAssetQuery) {
        const wantsSvg = lowerQuery.includes("svg");
        const wantsPng = lowerQuery.includes("png");
        const wantsLogo = lowerQuery.includes("logo");

        let assetQuery = supabase
          .from("assets")
          .select("id, name, type, storage_url, mime_type");

        if (wantsSvg || wantsPng) {
          const mimeTypes: string[] = [];
          if (wantsSvg) mimeTypes.push("image/svg+xml");
          if (wantsPng) mimeTypes.push("image/png");
          assetQuery = assetQuery.in("mime_type", mimeTypes);
        }

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
          const publicAssets: AssetResult[] = [{
            id: "public-logo-png",
            name: "Qatar Airways Logo (PNG)",
            type: "logo",
            storage_url: "/qatar-airways-logo.png",
            mime_type: "image/png",
          }];

          const result: AIResponse = {
            type: "assets",
            message: `Here are the Qatar Airways assets:`,
            assets: publicAssets,
          };
          setResponse(result);
          setIsLoading(false);
          return result;
        }
      }

      // Default help response
      const result: AIResponse = {
        type: "text",
        message: "I can help you with:\n• **Colors**: \"What are our brand colors?\" or \"Show me the color palette\"\n• **Typography**: \"What fonts do we use?\" or \"Show typography\"\n• **Brand Strategy**: \"What's our brand archetype?\" or \"Tell me about our tone\"\n• **Assets**: \"Pull the logo\" or \"Find PNG assets\"",
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
