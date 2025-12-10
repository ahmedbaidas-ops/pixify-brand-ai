import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BrandBrainAction = 
  | "explain" 
  | "rewrite" 
  | "check" 
  | "suggest" 
  | "analyze" 
  | "convert"
  | "general";

interface BrandBrainResponse {
  response: string;
  action: string;
  timestamp: string;
}

export function useBrandBrain() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const ask = useCallback(async (
    query: string, 
    action: BrandBrainAction = "general",
    context?: string
  ): Promise<string | null> => {
    setIsLoading(true);
    setResponse(null);

    try {
      const { data, error } = await supabase.functions.invoke<BrandBrainResponse>("brand-brain", {
        body: { action, query, context }
      });

      if (error) {
        console.error("Brand Brain error:", error);
        toast.error("AI request failed. Please try again.");
        return null;
      }

      if (data?.response) {
        setResponse(data.response);
        return data.response;
      }

      return null;
    } catch (err) {
      console.error("Brand Brain error:", err);
      toast.error("Failed to connect to Brand Brain.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const explain = useCallback((rule: string) => ask(rule, "explain"), [ask]);
  
  const rewrite = useCallback((content: string, context?: string) => 
    ask(content, "rewrite", context), [ask]);
  
  const checkCompliance = useCallback((content: string) => 
    ask(content, "check"), [ask]);
  
  const suggest = useCallback((prompt: string, context?: string) => 
    ask(prompt, "suggest", context), [ask]);
  
  const analyze = useCallback((content: string) => 
    ask(content, "analyze"), [ask]);

  const convert = useCallback((content: string, format: string) => 
    ask(`Convert to ${format}: ${content}`, "convert"), [ask]);

  const clearResponse = useCallback(() => setResponse(null), []);

  return {
    isLoading,
    response,
    ask,
    explain,
    rewrite,
    checkCompliance,
    suggest,
    analyze,
    convert,
    clearResponse
  };
}
