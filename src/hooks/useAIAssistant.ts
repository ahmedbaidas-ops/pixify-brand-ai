import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const fetchStructuredData = async (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for asset requests
    if (lowerQuery.includes("logo") || lowerQuery.includes("svg") || 
        lowerQuery.includes("png") || lowerQuery.includes("asset") ||
        lowerQuery.includes("pull") || lowerQuery.includes("download")) {
      
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

      const { data: assets } = await assetQuery.limit(10);

      if (assets && assets.length > 0) {
        return { assets: assets as AssetResult[] };
      } else {
        return {
          assets: [{
            id: "public-logo-png",
            name: "Qatar Airways Logo (PNG)",
            type: "logo",
            storage_url: "/qatar-airways-logo.png",
            mime_type: "image/png",
          }]
        };
      }
    }

    // Check for color requests
    if (lowerQuery.includes("color") || lowerQuery.includes("colour") ||
        lowerQuery.includes("palette") || lowerQuery.includes("hex")) {
      
      const { data: tokens } = await supabase
        .from("design_tokens")
        .select("name, value, description, type")
        .eq("type", "color");

      const colors: ColorInfo[] = tokens?.map(t => ({
        name: t.name,
        value: typeof t.value === 'object' && t.value !== null && 'hex' in t.value 
          ? (t.value as { hex: string }).hex 
          : String(t.value),
        description: t.description || undefined,
      })) || [];

      if (colors.length === 0) {
        colors.push(
          { name: "Qatar Maroon", value: "#5C0A3A", description: "Primary brand color" },
          { name: "Desert Sand", value: "#CBB59C", description: "Secondary accent color" },
          { name: "Night Sky", value: "#0F1020", description: "Dark neutral color" },
          { name: "Cloud Gray", value: "#A2A2A2", description: "Light neutral color" }
        );
      }
      return { colors };
    }

    // Check for typography requests
    if (lowerQuery.includes("font") || lowerQuery.includes("typography") ||
        lowerQuery.includes("typeface")) {
      
      const { data: tokens } = await supabase
        .from("design_tokens")
        .select("name, value, description, type")
        .eq("type", "typography");

      const typography: TypographyInfo[] = tokens?.map(t => ({
        name: t.name,
        value: typeof t.value === 'object' && t.value !== null && 'fontFamily' in t.value
          ? (t.value as { fontFamily: string }).fontFamily
          : String(t.value),
        description: t.description || undefined,
      })) || [];

      if (typography.length === 0) {
        typography.push(
          { name: "Display Font", value: "Cormorant Garamond", description: "Used for headlines" },
          { name: "UI Font", value: "Inter", description: "Used for body text and UI" }
        );
      }
      return { typography };
    }

    return null;
  };

  const processQuery = async (query: string): Promise<AIResponse> => {
    setIsLoading(true);
    setResponse(null);

    try {
      // First, fetch any relevant structured data
      const structuredData = await fetchStructuredData(query);

      // Call Lovable AI for natural language response
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { 
          query, 
          context: structuredData 
        }
      });

      if (error) {
        console.error('AI function error:', error);
        throw new Error(error.message);
      }

      if (data?.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Rate limit exceeded. Please wait a moment.');
        } else if (data.error.includes('credits')) {
          toast.error('AI credits exhausted. Please add funds.');
        }
        throw new Error(data.error);
      }

      // Determine response type based on structured data
      let responseType: AIResponse['type'] = 'text';
      if (structuredData?.assets) responseType = 'assets';
      else if (structuredData?.colors) responseType = 'colors';
      else if (structuredData?.typography) responseType = 'typography';

      const result: AIResponse = {
        type: responseType,
        message: data.response,
        ...(structuredData?.assets && { assets: structuredData.assets }),
        ...(structuredData?.colors && { colors: structuredData.colors }),
        ...(structuredData?.typography && { typography: structuredData.typography }),
      };

      setResponse(result);
      setIsLoading(false);
      return result;

    } catch (error) {
      console.error("AI Assistant error:", error);
      const result: AIResponse = {
        type: "error",
        message: error instanceof Error ? error.message : "Sorry, I encountered an error.",
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
